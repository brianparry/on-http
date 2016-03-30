// Copyright 2016, EMC, Inc.

'use strict';

var di = require('di');
var util = require('util');
var ejs = require('ejs');

module.exports = swaggerFactory;

di.annotate(swaggerFactory, new di.Provide('Http.Services.Swagger'));
di.annotate(swaggerFactory,
    new di.Inject(
            'Promise',
            'Errors',
            '_',
            di.Injector,
            'Views'
        )
    );

function swaggerFactory(
    Promise,
    Errors,
    _,
    injector,
    views
) {
    function _processError(err) {
        if (!util.isError(err) && err instanceof Object) {
            var status = err.status;
            var message = (err instanceof Error) ? err : err.message;
            err = new Error(message);
            if (status) { err.status = status; }
        }
        return err;
    }

    function _parseQuery(req) {
        req.swagger.query = _(req.swagger.params)
        .pick(function(param) {
            if (param.parameterObject) {
                return param.parameterObject.in === 'query' &&
                       param.parameterObject.type === typeof(param.value);
            }
            return false;
        })
        .mapValues(function(param) {
            req.query = _(req.query).omit(param.parameterObject.definition.name).value();
            if (typeof(param.value) === 'string' && param.value.match(/\+/)) {
                return param.value.split(/\+/);
            }
            return param.value;
        }).value();
    }

    function swaggerController(options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        return function(req, res, next) {
            req.swagger.options = options;
            return Promise.resolve().then(function() {
                _parseQuery(req);
                return callback(req, res);
            }).then(function(result) {
                if (!res.headersSent) {
                    res.body = result;
                    next();
                }
            }).catch(function(err) {
                next(_processError(err));
            });
        };
    }

    function swaggerDeserializer(injectableDeserializer) {
        var Deserializer = injector.get(injectableDeserializer);

        return function(req, res, next) {
            var deserializer = new Deserializer();
            return Promise.resolve().then(function() {
                if (req.method === 'PATCH') {
                    return deserializer.validatePartial(req.body);
                }
                return deserializer.validate(req.body);
            }).then(function(validated) {
                return deserializer.deserialize(validated);
            }).then(function(deserialized) {
                req.body = deserialized;
                next();
            }).catch(function(err) {
                next(_processError(err));
            });
        };
    }

    function swaggerSerializer(injectableSerializer) {
        var Serializer = injector.get(injectableSerializer);

        function serialize(data) {
            var serializer = new Serializer();
            return Promise.resolve().then(function() {
                return serializer.serialize(data);
            }).then(function(serialized) {
                return serializer.validateAsModel(serialized);
            }).then(function(validated) {
                return validated;
            });
        }

        return function(req, res, next) {
            var serialized;

            if (_.isArray(res.body)) {
                serialized = Promise.map(res.body, function(item) {
                    return serialize(item);
                });
            } else {
                serialized = serialize(res.body);
            }

            return serialized.then(function(validated) {
                res.body = validated;
                next();
            }).catch(function(err) {
                next(_processError(err));
            });
        };
    }

    function swaggerRenderer(viewName, data, next) {
        return views.get(viewName, ['global'])
        .then(function(view) {
            if (_.isEmpty(view)) {
                var err = new Errors.TemplateRenderError(viewName + ' does not exist');
                err.status = 500;
                throw err;
            }
            return view.contents;
        })
        .then(function(contents) {
            return ejs.render(contents, data);
        }).catch(function(err) {
            next(_processError(err));
        });
    }

    return {
        controller: swaggerController,
        deserializer: swaggerDeserializer,
        serializer: swaggerSerializer,
        renderer: swaggerRenderer
    };
}
