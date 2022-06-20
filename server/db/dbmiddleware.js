'use strict';

//DB access module
const sqlite = require('sqlite3');

//Open the database
const db = new sqlite.Database('study_plan.db', (err) => {
    if (err) throw err;
});

module.exports = db;