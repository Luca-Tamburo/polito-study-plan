/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          db
 * File:            dbmiddleware.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

'use strict';

// Import the module for connecting to the DB
const sqlite = require('sqlite3');

// Connect the server to the Database
const db = new sqlite.Database('study_plan.db', (err) => {
    if (err) throw err;
});

module.exports = db;