// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var Errors = injector.get('Errors');
var _ = require('lodash');    // jshint ignore:line

var workflowsGet = controller(function(req) {
    return workflowApiService.getActiveWorkflows(req.query)
    .then(function(workflows) {
        if (req.swagger.query && _(req.swagger.query).has('active')) {
            return _(workflows)
            .filter(function(workflow) {
                return workflow.active() === req.swagger.query.active; 
            });
        }
        return workflows;
    });
});

var workflowsPost = controller({success: 201}, function(req) {
    var configuration = _.defaults(req.query || {}, req.body || {});
    return workflowApiService.createAndRunGraph(configuration);
});

var workflowsGetById = controller(function(req) {
    return workflowApiService.getWorkflowById(req.swagger.params.identifier.value);
});

var workflowsCancel = controller(function(req) {
    console.log(req.swagger.params.identifier.value)
    return workflowApiService.cancelTaskGraph(req.swagger.params.identifier.value);
});

var workflowsDeleteById = controller(function(req) {
    return workflowApiService.deleteTaskGraph(req.swagger.params.identifier.value);
});

module.exports = {
    workflowsGet: workflowsGet,
    workflowsPost: workflowsPost,
    workflowsGetById: workflowsGetById,
    workflowsDeleteById: workflowsDeleteById,
    workflowsCancel: workflowsCancel
};
