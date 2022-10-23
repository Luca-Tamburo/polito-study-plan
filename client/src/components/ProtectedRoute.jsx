/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            ProtectedRoute.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

// Contexts
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = () => {
    const [session] = useContext(AuthContext);
    const navigate = useNavigate(); // Navigation handler

    useEffect(() => {
        if (!session.loggedIn)
            navigate('/', { replace: true });
    }, [session.loggedIn]); //eslint-disable-line react-hooks/exhaustive-deps

    if (session.loggedIn)
        return <Outlet />
}

export default ProtectedRoute;