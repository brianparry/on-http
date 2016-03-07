// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line


//********** Adding workflowsGetGraphs *************
var workflowsGetGraphs = controller(function(req) {
    return workflowApiService.getWorkflowsGraphs();
});

// ********* Adding workflowsGetGraphsByName ***********
var workflowsGetGraphsByName = controller(function(req) {
    return workflowApiService.getWorkflowsGraphsByName(req.swagger.params.injectableName.value);
});

// ******** Adding workflowsPutGraphs *****************
var workflowsPutGraphs = controller({success: 202},function(req) {
    return workflowApiService.putWorkflowsGraphs(req.body);
});

// ******* Adding workflowsPutGraphsByName ************
var workflowsPutGraphsByName = controller({success: 202}, function(req) {
    return workflowApiService.putWorkflowsGraphsByName(req.body, req.swagger.params.injectableName.value);
});

// ******* Adding workflowsDeleteGraphsByName *********
var workflowsDeleteGraphsByName = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsGraphsByName(req.body, req.swagger.params.injectableName.value);
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
