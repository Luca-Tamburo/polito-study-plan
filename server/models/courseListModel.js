'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    // This function retrieves all course codes given an id.
    getCourseListID: (id_course_list) => {
        return new Promise((resolve, reject) => {
            const queryLastID = 'SELECT course_code FROM course_list WHERE id=?';
            db.all(queryLastID, [id_course_list], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Lista dei corsi non trovata", status: 404 });
                else resolve(rows.map(row => row.course_code));
            })
        })
    },

    // This function adds a course inside the course list.
    addCourses: (courses) => {
        return new Promise((resolve, reject) => {
            const queryLastID = 'SELECT max(id) as lastID FROM course_list';
            db.get(queryLastID, [], (err, row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (row.length === 0) reject({ message: "Lista dei corsi vuota", status: 404 });
                else {
                    const query = 'INSERT INTO course_list(id, course_code) VALUES (?,?)';
                    const statement = db.prepare(query);
                    courses.forEach(course => {
                        statement.run([row.lastID + 1, course], function (err) {
                            if (err) reject({ message: err.message, status: 500 });
                        })
                    });
                    resolve(row.lastID + 1);
                }
            })
        })
    },

    // This function first removes one or more courses from the course list and then inserts additional courses.
    updateCourse: (id_course_list, old_course, new_course) => {
        return new Promise((resolve, reject) => {
            const query_delete = 'DELETE FROM course_list WHERE id=? AND course_code=?';
            const query_insert = 'INSERT INTO course_list (id, course_code) VALUES (?, ?)';

            const statement_delete = db.prepare(query_delete);
            const statement_insert = db.prepare(query_insert);

            old_course.forEach(course => {
                statement_delete.run([id_course_list, course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            new_course.forEach(course => {
                statement_insert.run([id_course_list, course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            resolve();
        })
    },

    // This function deletes all courses associated with an id in the course list
    deleteCourses: (id_course_list) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM course_list WHERE id = ?'
            db.run(query, [id_course_list], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            })
        })
    }
}