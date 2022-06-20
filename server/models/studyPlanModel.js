'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    // This function returns all information about a study plan given a user id.
    getStudyPlan: (id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT SP.id, SP.course_list_id, SP.type, SP.tot_credits, SPO.name, SPO.min_credits, SPO.max_credits, CL.course_code
                           FROM study_plan as SP, study_plan_option as SPO, course_list as CL
                           WHERE SP.course_list_id = CL.id AND SP.type = SPO.id AND user_id = ?`;
            db.all(query, [id], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Study plan non trovato", status: 404 });
                else resolve({
                    studyPlan: {
                        id: rows[0].id,
                        id_course_list: rows[0].course_list_id,
                        plan_type: {
                            name: rows[0].name,
                            min_credits: rows[0].min_credits,
                            max_credits: rows[0].max_credits
                        },
                        tot_credits: rows[0].tot_credits,
                        courses: rows.map(row => row.course_code)
                    }, status: 200
                });
            });
        });
    },

    // This function returns all information related to the two types of study plan.
    getStudyPlanType: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM study_plan_option`
            db.all(query, [], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Nessuna opzione disponibile", status: 404 });
                else resolve({ study_plan_type: rows, status: 200 });
            });
        });
    },

    getListId: (id_study_plan) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT course_list_id FROM study_plan WHERE id=?'
            db.get(query, [id_study_plan], (err, row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (!row) reject({ message: "Lista dei corsi non trovata", status: 404 });
                else resolve(row.course_list_id);
            })
        })
    },

    // This function adds a study plan.
    addStudyPlan: (user_id, course_list_id, type, tot_credits) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO study_plan (user_id, course_list_id, type, tot_credits) VALUES (?, ?, ?, ?)'
            db.run(query, [user_id, course_list_id, type, tot_credits], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            })
        })
    },

    // This function update a study plan.
    updateStudyPlan: (id, id_user, newCredits) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE study_plan SET tot_credits = ? WHERE id=? and user_id=?"
            db.run(query, [newCredits, id, id_user], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    },

    // This function removes a study plan given a user id.
    deleteStudyPlan: (id_user) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM study_plan WHERE id=?"
            db.run(query, [id_user], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    }
}