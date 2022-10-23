/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          routes
 * File:            studyPlanRouter.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

'use strict';

const express = require("express");
const router = express.Router();

// Import the module for validations
const { check, validationResult } = require('express-validator');

// Import models/DAOs (Data Access Objects)
const studyPlanModel = require('../models/studyPlanModel');
const courseListModel = require('../models/courseListModel');
const courseModel = require('../models/courseModel');

// Import session middleware to check if the user is authenticated
const withAuth = require('../middlewares/withAuth');

// Import constraints middleware to check for study plan constraints errors
const withConstraints = require('../middlewares/withConstraints');

// GET /study-plans
// Route to get info about study plan associated with the logged in user
router.get("/", withAuth, (req, res) => {
    studyPlanModel.getStudyPlan(req.user.id)
        .then((data) => {
            res.status(data.status).json(data.studyPlan);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

//GET /study-plans/types
// Route to get info about study plan types associated with the logged in user
router.get("/types", withAuth, (req, res) => {
    studyPlanModel.getStudyPlanType()
        .then((data) => {
            res.status(data.status).json(data.study_plan_type);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

// POST /study-plans
// Route to create a study plan
router.post("/", [
    check('courses').isArray().exists({ checkNull: true }),
    check('type_id').isInt({ min: 1, max: 2 }).exists({ checkFalsy: true }),
    check('tot_credits').if(check('type_id').equals('1')).isInt({ min: 20, max: 40 }).exists({ checkFalsy: true }),
    check('tot_credits').if(check('type_id').equals('2')).isInt({ min: 60, max: 80 }).exists({ checkFalsy: true })
], withAuth, withConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json("Errore di validazione.");
    courseListModel.addCourses(req.body.courses)
        .then((course_list_id) => {
            studyPlanModel.addStudyPlan(req.user.id, course_list_id, req.body.type_id, req.body.tot_credits)
                .then(() => {
                    courseModel.updateRegisteredStudents(req.body.courses, [])
                        .then(() => res.status(200).end())
                        .catch((error) => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch((error) => {
                    res.status(error.status).json(error.message);
                })
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});


//PUT /study-plans/:id
// Route to update the study plan associated with the logged in user, given the study plan id
router.put('/:id', [
    check('id').isInt().exists({ checkFalsy: true }),
    check('old_course').isArray().exists({ checkNull: true }),
    check('new_course').isArray().exists({ checkNull: true }),
    check('type_id').isInt({ min: 1, max: 2 }).exists({ checkFalsy: true }),
    check('tot_credits').if(check('type_id').equals('1')).isInt({ min: 20, max: 40 }).exists({ checkFalsy: true }),
    check('tot_credits').if(check('type_id').equals('2')).isInt({ min: 60, max: 80 }).exists({ checkFalsy: true })
], withAuth, withConstraints, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: "Errore di validazione.", errors: errors.array() });
    }

    studyPlanModel.getListId(req.params.id)
        .then((course_list_id) => {
            courseListModel.updateCourse(course_list_id, req.body.old_course, req.body.new_course)
                .then(() => {
                    studyPlanModel.updateStudyPlan(req.params.id, req.user.id, req.body.tot_credits)
                        .then(() => {
                            courseModel.updateRegisteredStudents(req.body.new_course, req.body.old_course)
                                .then(() => res.status(200).end())
                                .catch((error) => {
                                    res.status(error.status).json(error.message);
                                })
                        })
                        .catch((error) => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch(error => res.status(error.status).json(error.message));
        })
        .catch(error => {
            res.status(error.status).json(error.message);
        })
})

//DELETE /study-plans/:id
// Route to delete a study plan and its associated courses list, given the study plan id
router.delete("/:id", [
    check('id').isInt().exists({ checkFalsy: true }),
], withAuth, (req, res) => {
    studyPlanModel.getListId(req.params.id)
        .then((course_list_id) => {
            courseListModel.getCourseListID(course_list_id)
                .then((courses) => {
                    courseModel.updateRegisteredStudents([], courses)
                        .then(() => {
                            courseListModel.deleteCourses(course_list_id)
                                .then(() => {
                                    studyPlanModel.deleteStudyPlan(req.params.id)
                                        .then((data) => {
                                            res.status(data.status).end();
                                        })
                                        .catch((error) => {
                                            res.status(error.status).json(error.message);
                                        })
                                })
                                .catch(error => {
                                    res.status(error.status).json(error.message);
                                })
                        })
                        .catch((error) => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch((error) => {
                    res.status(error.status).json(error.message);
                })
        })
        .catch((error) => {
            res.status(error.status).json(error.message);
        })
});
module.exports = router;