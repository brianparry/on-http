// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line


var workflowsPutTask = controller({success: 201}, function(req) {
    return workflowApiService.defineTask(req.body);
});

var workflowsGetAllTasks = controller(function() {
    return workflowApiService.getTaskDefinitions();
});

var workflowsGetTasksByName = controller(function(req) {
    return workflowApiService.getWorkflowsTasksByName(req.swagger.params.injectableName.value);
});

var workflowsDeleteTasksByName = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsTasksByName(req.swagger.params.injectableName.value);
});


var workflowsPutTasksByName = controller({success: 202}, function(req) {
    return workflowApiService.putWorkflowsTasksByName(req.body, req.swagger.params.injectableName.value);
});

module.exports = {
    workflowsPutTask: workflowsPutTask,
    workflowsGetAllTasks: workflowsGetAllTasks,
    workflowsGetTasksByName: workflowsGetTasksByName,
    workflowsPutTasksByName: workflowsPutTasksByName,
    workflowsDeleteTasksByName: workflowsDeleteTasksByName,
};
