'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    // This function returns user information based on the email.
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM user WHERE email = ?';
            db.get(query, [email], (err, row) => {
                if (err)
                    reject({ message: err.message, status: 500 });
                else if (!row)
                    reject({ messagge: "Email errata", status: 404 });
                else
                    resolve({ user: row, status: 200 });
            })
        })
    },

    // This function returns user information based on the id.
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM user WHERE id = ?';
            db.get(query, [id], (err, row) => {
                if (err)
                    reject({ message: err.message, status: 500 });
                else if (!row)
                    reject({ messagge: "Password errata", status: 404 });
                else
                    resolve({ user: row, status: 200 });
            })
        })
    }
}