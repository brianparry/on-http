'use strict';

module.exports = {
  hello: hello
};

function hello(req, res, context) {
  var path = context.injector.get('Http.Services.RestApi');
  res.json('hello');
}

