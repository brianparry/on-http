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

// ****** Adding workflowsGetTasksByName *****************
var workflowsGetTasksByName = controller(function(req) {
    return workflowApiService.getWorkflowsTasksByName(req.swagger.params.injectableName.value);
});

// ***** Adding workflowsDeleteTasksByName ***************
var workflowsDeleteTasksByName = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsTasksByName(req.swagger.params.injectableName.value);
});


// ******* Adding workflowsPutTasksByName ************
var workflowsPutTasksByName = controller({success: 202}, function(req) {
    return workflowApiService.putWorkflowsTasksByName(req.body, req.swagger.params.injectableName.value);
});

module.exports = {
    
    //update GetActive if we change method name
    workflowsGetAll: workflowsGetAll,

    workflowsPost: workflowsPost,
//    workflowsPut: workflowsPut,
    workflowsPutTask: workflowsPutTask,
    workflowsGetAllTasks: workflowsGetAllTasks,
//    workflowsGetAllFromLibrary: workflowsGetAllFromLibrary,
//    workflowsGetFromLibraryById: workflowsGetFromLibraryById,
    workflowsGetById: workflowsGetById,
    workflowsDeleteById: workflowsDeleteById,
    workflowsGetTasksByName: workflowsGetTasksByName,
    workflowsPutTasksByName: workflowsPutTasksByName,
    workflowsDeleteTasksByName: workflowsDeleteTasksByName,
    workflowsCancel: workflowsCancel,
    workflowsGetGraphs: workflowsGetGraphs,
    workflowsGetGraphsByName: workflowsGetGraphsByName,
    workflowsPutGraphs: workflowsPutGraphs,
    workflowsPutGraphsByName: workflowsPutGraphsByName,
    workflowsDeleteGraphsByName: workflowsDeleteGraphsByName
};
