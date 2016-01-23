var index = require('../../index');

module.exports = {
    jwt: index.injector.get('Api.Auth.Middleware')
}
