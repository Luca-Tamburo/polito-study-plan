/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          services
 * File:            api.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import axios from "axios";

const SERVER_URL = 'http://localhost:3001/api/';

const api = {
    getCourses: () => {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + `courses/all`)
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }));
        })
    },

    getStudyPlan: () => {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + 'study-plans', { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }));
        })
    },

    getStudyPlanType: () => {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + 'study-plans/types', { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }))
        })
    },

    addStudyPlan: (courses, type_id, tot_credits) => {
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + 'study-plans', { courses, type_id, tot_credits }, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }))
        })
    },

    updateStudyPlan: (id, tot_credits, old_course, new_course, type_id) => {
        return new Promise((resolve, reject) => {
            axios.put(SERVER_URL + `study-plans/${id}`, { old_course, new_course, tot_credits, type_id }, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }))
        })
    },

    deleteStudyPlan: (id_study_plan) => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + `study-plans/${id_study_plan}`, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }))
        })
    },

    login: (credentials) => {
        return new Promise((resolve, reject) => {
            axios.post(SERVER_URL + 'sessions', credentials, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data));
        })
    },

    logout: () => {
        return new Promise((resolve, reject) => {
            axios.delete(SERVER_URL + 'sessions/current', { withCredentials: true })
                .then(() => resolve())
                .catch((err) => reject(err.response.data));
        })
    },

    getUserInfo: () => {
        return new Promise((resolve, reject) => {
            axios.get(SERVER_URL + 'sessions/current', { withCredentials: true })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err.response.data));
        })
    }
}

export default api;