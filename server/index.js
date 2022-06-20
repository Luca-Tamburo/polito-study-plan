'use strict';

//Importing modules
const express = require("express");
const logger = require("morgan");       //loggin middleware
const cors = require("cors");

//Authentication-related imports 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');

//Routes and models
const sessionsRouter = require("./routes/sessions");
const courseRouter = require("./routes/courseRouter");
const studyPlanRouter = require("./routes/studyPlanRouter");
const usersModel = require("./models/usersModel");

//Allow to use public route
const path = require("path");

//Module that performs data encryption and decryption
const crypto = require("crypto");

//Init express and set-up the middlewares
const app = express();
app.use(logger("dev"));
app.use(express.json());

//Set up and enable Cross-Origin Resource Sharing (CORS)
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Creating the session
app.use(session({
    secret: 'a secret sentence not to share with anybody and anywhere, userd to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}))

//Passport
// Set up local strategy to verify, search in the DB a user with a matching password, and retrieve its information by userModel.getUserByEmail (i.e., id, username, name).
passport.use(
    new LocalStrategy(function (username, password, done) {
        usersModel.getUserByEmail(username)
            .then((res) => {
                crypto.scrypt(password, res.user.salt, 32, function (err, hashedPassword) {
                    if (err)
                        return done({ message: 'Crypto error', status: 500 });

                    const passwordHex = Buffer.from(res.user.password, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        return done({ message: 'Email e/o password errata!', status: 401 });
                    return done(null, { id: res.user.id, email: res.user.email, name: res.user.name });
                })
            })
            .catch(err => {
                if (err.status === 404)
                    return done({ message: 'Email e/o password errata!', status: 401 });
                return done(err);
            })
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser((id, done) => {
    usersModel.getUserById(id)
        .then((res) => {
            done(null, { id: res.user.id, email: res.user.email, name: res.user.name });
        }).catch(err => {
            done(err, null);
        });
});

app.use("/public", express.static(path.join(__dirname, 'public')));

/* ---  APIs  --- */
app.use("/api/courses", courseRouter);
app.use("/api/study-plans", studyPlanRouter);
app.use("/api/sessions", sessionsRouter);

//Activating server
const PORT = 3001;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}/`)
);
