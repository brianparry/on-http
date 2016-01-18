'use strict'

var di = require('di');
var util = require('util');

module.exports = passportTokenFactory;

di.annotate(passportTokenFactory, new di.Provide('Passport.Token'));
di.annotate(passportTokenFactory, new di.Inject('passport'));

function passportTokenFactory(passport) {
    function TokenStrategy(options, verify) {
        if (typeof options == 'function') {
            verify = options;
            options = {};
        }

        if (!verify) {
             throw new Error('Token Auth strategy requires verify function');
        }

        passport.Strategy.call(this);
        this.name = 'token';
        this._verify = verify;
    }
    util.inherits(TokenStrategy, passport.Strategy);

    TokenStrategy.prototype.authenticate = function(req) {
        var self = this;
        var token = req.headers['token'];
        if (!token) { return this.fail(401); }

        function verified(err, user) {
             if (err) { return self.error(err); }
             if (!user) { return self.fail(401); }
             self.success(user);
        }

        this._verify(token, verified);
    }

    return TokenStrategy;
}
