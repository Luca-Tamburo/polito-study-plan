'use strict';
const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();
const studyPlanModel = require('../models/studyPlanModel');
const courseListModel = require('../models/courseListModel');
const courseModel = require('../models/courseModel');
const withAuth = require('../middlewares/withAuth');

// GET /study-plans
router.get("/", withAuth, (req, res) => {
    studyPlanModel.getStudyPlan(req.user.id)
        .then((data) => {
            res.status(data.status).json(data.studyPlan);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

//GET /study-plans/types
router.get("/types", withAuth, (req, res) => {
    studyPlanModel.getStudyPlanType()
        .then((data) => {
            res.status(data.status).json(data.study_plan_type);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

// POST /study-plans
router.post("/", [
    check('courses').isArray({ min: 2 }).not().optional(),
    check('type_id').isInt({ min: 1, max: 2 }),
    check('tot_credits').if(check('type_id').equals('1')).isInt({ min: 20, max: 40 }),
    check('tot_credits').if(check('type_id').equals('2')).isInt({ min: 60, max: 80 })
], withAuth, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ message: "Errore di validazione.", errors: errors.array() });
    courseListModel.addCourses(req.body.courses)
        .then((course_list_id) => {
            studyPlanModel.addStudyPlan(req.user.id, course_list_id, req.body.type_id, req.body.tot_credits)
                .then(() => {
                    courseModel.updateRegisteredStudents(req.body.courses, [])
                        .then((data) => res.status(data.status).end())
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
router.put('/:id', [
    check('id').isInt(),
    check('old_course').isArray().not().optional(),
    check('new_course').isArray().not().optional(),
], withAuth, (req, res) => {
    studyPlanModel.getListId(req.params.id)
        .then((course_list_id) => {
            courseListModel.updateCourse(course_list_id, req.body.old_course, req.body.new_course)
                .then(() => {
                    studyPlanModel.updateStudyPlan(req.params.id, req.user.id, req.body.tot_credits)
                        .then(() => {
                            courseModel.updateRegisteredStudents(req.body.new_course, req.body.old_course)
                                .then((data) => res.status(data.status).end())
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
router.delete("/:id", withAuth, (req, res) => {
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