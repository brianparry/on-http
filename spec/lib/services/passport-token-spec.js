'use strict'

require('../../helper');

describe('Passport Token Strategy', function() {
    var TokenStrategy;
    before(function() {
        helper.setupInjector([
            helper.require('/lib/services/passport-token'),
            dihelper.requireWrapper('passport', 'passport')
        ]);
        TokenStrategy = helper.injector.get('Passport.Token');
    });

    it("should have required properties", function() {
        var token = new TokenStrategy(function(token, done) {});
        expect(token).to.have.property('authenticate');
        expect(token).to.have.property('name').and.to.equal('token');
    });

    it("should call error method when validation fails", function() {
        var token = new TokenStrategy(function(token, done) {
            done(new Error('error'), token);
        });
        token.error = sinon.stub();
        token.authenticate({
            headers: {
                token: '1234567'
            }
        });
        expect(token.error.called).to.be.true;
    });

    it("should call fail method with 401 when auth fails", function() {
        var token = new TokenStrategy(function(token, done) {
            done(null, false);
        });
        token.fail = sinon.stub();
        token.authenticate({
            headers: {
                token: '1234567'
            }
        });
        expect(token.fail.called).to.be.true;
        expect(token.fail.calledWith(401)).to.be.true;
    });

    it("should call success method with token when auth succeeds", function() {
        var token = new TokenStrategy(function(token, done) {
            done(null, token);
        });
        token.success = sinon.stub();
        token.authenticate({
            headers: {
                token: '1234567'
            }
        });
        expect(token.success.called).to.be.true;
        expect(token.success.calledWith('1234567')).to.be.true;
    });
});
