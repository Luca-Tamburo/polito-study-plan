'use strict';

const withAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json("Utente non autenticato");
}

module.exports = withAuth;