'use strict';
const express = require("express");
const router = express.Router();
const courseModel = require('../models/courseModel');

// GET /courses/all
router.get("/all", (req, res) => {
    courseModel.retrieveAll()
        .then((data) => {
            res.status(data.status).json(data.courses);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

module.exports = router;