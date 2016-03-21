// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var Errors = injector.get('Errors');
var _ = require('lodash');    // jshint ignore:line


//should we change to workflowsGetAll ???
var workflowsGet = controller(function(req) {
    return workflowApiService.getActiveWorkflows(req.swagger.query);
});

var workflowsPost = controller({success: 201}, function(req) {
    var configuration = _.defaults(req.query || {}, req.body || {});
    return workflowApiService.createAndRunGraph(configuration);
});

var workflowsGetById = controller(function(req) {
    return workflowApiService.getWorkflowById(req.swagger.params.identifier.value);
});

/*
var workflowsPut = controller(function(req)) {
    if (req.body && req.body.action == 'cancel') {
        return workflowApiService.cancelTaskGraph(req.swagger.params.identifier.value);
    }
    throw new Errors.BadRequestError('Invalid action');
}
*/

var workflowsCancel = controller(function(req) {
    return workflowApiService.cancelTaskGraph(req.swagger.params.identifier.value);
});

var workflowsDeleteById = controller(function(req) {
    return workflowsApiService.getWorkflowById(req.swagger.params.identifier.value)
    .then(function(workflow) {
        // Workflow is done when all tasks have completed
        var done = _(workflow.tasks).every(function(task) {
            return task.state != Constants.Task.States.Running &&
                   task.state != Constants.Task.States.Pending;
        });

        if (done) {
            return workflowsApiService.deleteWorkflowById(req.swagger.params.identifier.value);
        }
        throw new Errors.BadRequestError('Cannot delete a running workflow');
    });
});

module.exports = {
    //update GetActive if we change method name
    workflowsGet: workflowsGet,
    workflowsPost: workflowsPost,
    workflowsGetById: workflowsGetById,
    workflowsDeleteById: workflowsDeleteById,
    workflowsCancel: workflowsCancel
};
