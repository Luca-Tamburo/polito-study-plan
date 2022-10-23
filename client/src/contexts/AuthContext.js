/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          contexts
 * File:            AuthContext.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { createContext, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';

// Services
import api from '../services/api';

// Hooks
import useNotification from '../hooks/useNotification';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ user: null, plan: null, loggedIn: false }); // Stores user, data plan and whether the user is logged in
    const [dirty, setDirty] = useState(true); // State to reload user information
    const notify = useNotification();

    // Load user data and data plan into client session
    useEffect(() => {
        if (dirty)
            api.getUserInfo()
                .then((user) => {
                    setUser({ user: { ...user }, plan: null, loggedIn: true });
                    api.getStudyPlan()
                        .then((plan) => {
                            setUser({ user: { ...user }, plan: { ...plan }, loggedIn: true });
                            setDirty(false);
                        })
                        .catch((error) => {
                            if (error.status === 404)
                                setUser({ user: { ...user }, plan: null, loggedIn: true });
                            else notify.error(error.data)
                            setDirty(false);
                        })
                })
                .catch(() => {
                    setUser({ user: undefined, loggedIn: false });
                    setDirty(false);
                })
    }, [dirty]); //eslint-disable-line react-hooks/exhaustive-deps

    if (!dirty) {
        return (
            <AuthContext.Provider value={[user, setUser, setDirty]}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <div className='h-100 d-flex align-items-center justify-content-center'>
            <Spinner animation='border' variant='primary' className='opacity-25' />
        </div>
    );
}

export { AuthContext, AuthProvider };