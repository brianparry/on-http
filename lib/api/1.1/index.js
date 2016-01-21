// Copyright 2015, EMC, Inc.

'use strict';

var di = require('di'),
    express = require('express');

module.exports = commonApiFactory;

di.annotate(commonApiFactory, new di.Provide('common-api-router'));
di.annotate(commonApiFactory, new di.Inject(
        'passport',
        di.Injector
    )
);

function commonApiFactory (passport, injector) {
    var router = express.Router();
    var authMW = function(req, res, next) {
        passport.authenticate(      // middleware for token authentication
            'jwt',
            {session: false},
            function(err, user, challenges){        //callback for error handling
                if(err){
                    res.status(ERROR_STATUS).send({message: 'Internal server error'});
                }
                else if (!user){
                    res.status(UNAUTHORIZED_STATUS).send({message: challenges.message});
                }
                else{
                    next();
                }
            }
        )(req, res, next);
    });
    
    router.use(injector.get(require('./catalogs')));
    router.use(injector.get(require('./config')));
    router.use(injector.get(require('./files')));
    router.use(injector.get(require('./lookups')));
    router.use(injector.get(require('./nodes')));
    router.use(injector.get(require('./obms')));
    router.use(injector.get(require('./pollers')));
    router.use(injector.get(require('./profiles')));
    router.use(injector.get(require('./schemas')));
    router.use(injector.get(require('./skus')));
    router.use(injector.get(require('./tasks')));
    router.use(injector.get(require('./templates')));
    router.use(injector.get(require('./workflows')));
    router.use(injector.get(authMW, require('./versions')));

    return router;
}
