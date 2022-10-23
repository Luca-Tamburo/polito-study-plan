/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          middlewares
 * File:            withConstraints.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

'use strict';

// Import models/DAOs (Data Access Objects)
const courseModel = require('../models/courseModel');
const courseListModel = require('../models/courseListModel');
const studyPlanModel = require('../models/studyPlanModel');

const withConstraints = (req, res, next) => {
    courseModel.retrieveAll()
        .then((data) => {
            if (req.params.id)
                studyPlanModel.getListId(req.params.id)
                    .then((course_list_id) => {
                        courseListModel.getCourseListID(course_list_id)
                            .then((coursesPlan) => {
                                const newCoursesPlan = data.courses.filter(c => {
                                    return (
                                        !req.body.old_course.includes(c.code) && (req.body.new_course.includes(c.code) || coursesPlan.includes(c.code))
                                    )
                                })
                                const initialValue = 0;
                                const credits = newCoursesPlan.reduce((previousValue, currentCourse) => {
                                    return (
                                        (previousValue + currentCourse.CFU), initialValue
                                    )
                                })
                                let validationError = false;
                                newCoursesPlan.forEach(course => {
                                    if (course.propaedeuticity.code && !newCoursesPlan.includes(data.courses.find(c => c.code === course.propaedeuticity.code)))
                                        validationError = true;
                                    else if (course.incompatibilities && course.incompatibilities.find(inc_c => newCoursesPlan.includes(data.courses.find(course => course.code === inc_c.code))))
                                        validationError = true;
                                    else if (req.body.new_course.includes(course.code) && course.max_students && course.max_students < course.registered_students + 1)
                                        validationError = true;
                                    else if (parseInt(credits !== req.body.tot_credits))
                                        validationError = true;
                                })
                                if (validationError)
                                    return res.status(422).json('Vincoli non rispettati!');
                                else next();
                            })
                            .catch((err) => {
                                return res.status(err.status).json(err.message);
                            })
                    })
                    .catch((err) => {
                        return res.status(err.status).json(err.message);
                    })
            else {
                const newCoursesPlan = data.courses.filter(c => {
                    return (
                        req.body.courses.includes(c.code)
                    )
                })
                const initialValue = 0;
                const credits = newCoursesPlan.reduce((previousValue, currentCourse) => {
                    return (
                        (previousValue + currentCourse.CFU), initialValue
                    )
                })
                let validationError = false;
                newCoursesPlan.forEach(course => {
                    if (course.propaedeuticity.code && !newCoursesPlan.includes(data.courses.find(c => c.code === course.propaedeuticity.code)))
                        validationError = true;
                    else if (course.incompatibilities && course.incompatibilities.find(inc_c => newCoursesPlan.includes(data.courses.find(course => course.code === inc_c.code))))
                        validationError = true;
                    else if (req.body.courses.includes(course.code) && course.max_students && course.max_students < course.registered_students + 1)
                        validationError = true;
                    else if (parseInt(credits !== req.body.tot_credits))
                        validationError = true;
                })
                if (validationError)
                    return res.status(422).json('Vincoli non rispettati!');
                else next();
            }

        })
        .catch((err) => {
            return res.status(err.status).json(err.message);
        })
}

module.exports = withConstraints;