/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          routes
 * File:            courseRouter.js
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

// Import models/DAOs (Data Access Objects)
const courseModel = require('../models/courseModel');

// GET /courses/all
// Route to get all courses info
router.get("/all", (req, res) => {
    courseModel.retrieveAll()
        .then((data) => {
            res.status(data.status).json(data.courses);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

module.exports = router;