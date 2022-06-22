'use strict';

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const passport = require('passport');

//POST /sessions
//login
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
//logout
router.delete('/current', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
    });
    res.end();
})


//GET /current
//check if an user is logged in or not
router.get('/current', (req, res) => {
    if (req.isAuthenticated())
        return res.status(200).json(req.user);
    res.status(401).json({ message: 'User not authenticated' });
})

module.exports = router;