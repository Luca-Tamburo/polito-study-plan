'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    // This function returns all courses in the db.
    retrieveAll: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT C1.code, C1.name, C1.CFU, C1.max_students, C1.propaedeuticity, C1.registered_students, C2.code as propaedeuticity_code, C2.name as propaedeuticity_name FROM course as C1 LEFT JOIN course as C2 ON C1.propaedeuticity = C2.code ORDER BY C1.name";
            db.all(query, [], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "No courses found", status: 404 });
                else {
                    const courses = rows;
                    const find_incompatibilities = "SELECT C1.code, I.inc_code, C2.name FROM course as C1 LEFT JOIN incompatibility as I, course as C2 ON C1.code = I.course_code and I.inc_code = C2.code";
                    db.all(find_incompatibilities, [], (err, rows) => {
                        if (err) reject({ message: err.message, status: 500 });
                        else if (rows.length === 0) resolve(courses)
                        else {
                            const incompatibilities = rows.map(course => ({
                                code: course.code,
                                incompatibilities: [
                                    ...rows.filter(c => c.code === course.code && course.inc_code).map(c => ({
                                        code: c.inc_code,
                                        name: c.name
                                    }))
                                ]
                            }));

                            const res = courses.map(course => ({
                                code: course.code,
                                name: course.name,
                                CFU: course.CFU,
                                max_students: course.max_students,
                                propaedeuticity: {
                                    code: course.propaedeuticity_code,
                                    name: course.propaedeuticity_name
                                },
                                registered_students: course.registered_students,
                                ...incompatibilities.find(c => c.code === course.code)
                            }));

                            resolve({ courses: res, status: 200 });
                        }
                    });
                };
            })
        })
    },

    // This function updates the number of students registered for a course.
    updateRegisteredStudents: (new_course, old_course) => {
        return new Promise((resolve, reject) => {
            const queryIncrement = "UPDATE course SET registered_students = registered_students + 1 WHERE code=?"
            const queryDecrement = "UPDATE course SET registered_students = registered_students - 1 WHERE code=?"

            const statement_decrement = db.prepare(queryDecrement);
            const statement_increment = db.prepare(queryIncrement);

            old_course.forEach(course => {
                statement_decrement.run([course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            new_course.forEach(course => {
                statement_increment.run([course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            resolve({ status: 200 });
        })
    },
}
