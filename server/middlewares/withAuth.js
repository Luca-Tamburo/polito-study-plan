/*
 * --------------------------------------------------------------------
 * 
 * Package:         server
 * Module:          middlewares
 * File:            withAuth.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

'use strict';

const withAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json("Utente non autenticato");
}

module.exports = withAuth;