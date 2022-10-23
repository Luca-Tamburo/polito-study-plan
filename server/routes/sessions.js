/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          routes
 * File:            sessions.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

'use strict';

const express = require('express');
const router = express.Router();

// Import the module for authentication
const passport = require('passport');

// Import the module for validations
const { check, validationResult } = require('express-validator');

//POST /sessions
// Route to perform user login with passport local strategy
router.post('/', [
    check('email').isEmail().not().optional(),
    check('password').isStrongPassword({
        minLength: 8,
        minUppercase: 0,
        minLowercase: 0,
        minSymbols: 0,
        minNumbers: 0
    })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json("Credenziali errate! Riprova");
    passport.authenticate('local', (err, user) => {
        if (err)
            return res.status(err.status).json(err.message);

        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});


//DELETE /sessions/current
// Route to perform the logout of the user
router.delete('/current', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
    });
    res.end();
})


//GET /current
// Route to get the current session of a user, if he is logged in
router.get('/current', (req, res) => {
    if (req.isAuthenticated())
        return res.status(200).json(req.user);
    res.status(401).json({ message: 'User not authenticated' });
})

module.exports = router;