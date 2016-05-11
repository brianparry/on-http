// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index').injector;
var swagger = injector.get('Http.Services.Swagger');
var controller = swagger.controller;
var templates = injector.get('Templates');
var taskProtocol = injector.get('Protocol.Task');
var Errors = injector.get('Errors');
var lookups = injector.get('Services.Lookup');
var waterline = injector.get('Services.Waterline');

// GET /templates/metadata
var templatesMetaGet = controller(function() {
    return templates.getAll();
});

// GET /templates/metadata/:name
var templatesMetaGetByName = controller(function(req) {
    return templates.getName(req.swagger.params.name.value);
});

var templatesGetByName = controller(function(req, res) {
    return lookups.reqIpAddressToMacAddress(req)
    .then(function(mac) {
        return waterline.nodes.needByIdentifier(mac);
    })
    .then(function(node) {
        return Promise.all([
            workflowApiService.findActiveGraphForTarget(node.id),
            node
        ]);
    })
    .spread(function(workflow, node) {
        if (!workflow) {
            throw Errors.NotFoundError('not here!');
        }
        return Promise.all([
            swagger.makeRenderableOptions(req, res, workflow.context),
            taskProtocol.requestProperties(node.id)
        ]);
    })
    .spread(function(options, properties) {
        return templates.render(
            req.swagger.params.name.value,
            _.merge({}, options, properties),
            scope
        ) ;
    });
});

// GET /templates/library/:name
var templatesLibGet = controller(function(req, res) {
    //todo scope
    return templates.get(req.swagger.params.name.value)
    .then(function(template) {
        return template.contents;
    })
});

// PUT /templates/library/:name
var templatesLibPut = controller(function(req, res) {
    //todo scope
    return templates.put(req.swagger.params.name.value, req);
});

module.exports = {
    templatesMetaGet: templatesMetaGet,
    templatesMetaGetByName: templatesMetaGetByName,
    templatesGetByName: templatesGetByName,
    templatesLibGet: templatesLibGet,
    templatesLibPut: templatesLibPut
};
