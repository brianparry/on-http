// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line

var workflowsGetActive = controller(function(req) {
    return workflowApiService.getActiveWorkflows(req.query);
});

var workflowsPost = controller({success: 201}, function(req) {
    var configuration = _.defaults(req.query || {}, req.body || {});
    return workflowApiService.createAndRunGraph(configuration);
});

var workflowsPut = controller({success: 201}, function(req) {
    return workflowApiService.defineTaskGraph(req.body);
});

var workflowsPutTask = controller({success: 201}, function(req) {
    return workflowApiService.defineTask(req.body);
});

var workflowsGetAllTasks = controller(function() {
    return workflowApiService.getTaskDefinitions();
});

var workflowsGetAllFromLibrary = controller(function() {
    return workflowApiService.getGraphDefinitions();
});

var workflowsGetFromLibraryById = controller(function(req) {
    return workflowApiService.getGraphDefinitions(req.swagger.params.identifier.value)
        .then(function(graphs) {
            if (_.isEmpty(graphs)) {
                return [];
            } else {
                return graphs[0];
            }
        });
});

var workflowsGetById = controller(function(req) {
    return workflowApiService.getWorkflowById(req.swagger.params.identifier.value);
});

module.exports = {
    workflowsGetActive: workflowsGetActive,
    workflowsPost: workflowsPost,
    workflowsPut: workflowsPut,
    workflowsPutTask: workflowsPutTask,
    workflowsGetAllTasks: workflowsGetAllTasks,
    workflowsGetAllFromLibrary: workflowsGetAllFromLibrary,
    workflowsGetFromLibraryById: workflowsGetFromLibraryById,
    workflowsGetById: workflowsGetById
};
