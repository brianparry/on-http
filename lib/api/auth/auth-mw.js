'use strict'

var di = require('di');

module.exports = authMiddlewareFactory;

di.annotate(authMiddlewareFactory, new di.Provide('Api.Auth.Middleware'));
di.annotate(authMiddlewareFactory, new di.Inject('passport'));

function authMiddlewareFactory(passport) {
    var UNAUTHORIZED_STATUS = 401;
    var ERROR_STATUS = 500;

    return function (req, res, next) {
        if (req.protocol === 'http') { return next(); }
        return passport.authenticate(
            'jwt',
            {session: false},
            function(err, user, challenges) {
                if (err) { 
                    res.status(ERROR_STATUS).send({message: 'Internal server errror'}); 
                } else if (!user) {
                    res.status(UNAUTHORIZED_STATUS).send({message: challenges.message});
                } else {
                    next();
                }
            }
        )(req, res, next);
    };
}
