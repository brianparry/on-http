var index = require('../../index');

module.exports = {
    bearer: index.injector.get('Api.Auth.Middleware')
}
