// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line


//should we change to workflowsGetAll ???
var workflowsGetAll = controller(function(req) {
    return workflowApiService.getActiveWorkflows(req.query);
});

var workflowsPost = controller({success: 201}, function(req) {
    var configuration = _.defaults(req.query || {}, req.body || {});
    return workflowApiService.createAndRunGraph(configuration);
});

/****** Delete workflowsPut ******
var workflowsPut = controller({success: 201}, function(req) {
    return workflowApiService.defineTaskGraph(req.body);
});
****************************************/

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

/*******  Delete workflowsGetAllFromLibrary

var workflowsGetAllFromLibrary = controller(function() {
    return workflowApiService.getGraphDefinitions();
});
***************************************/

/*******  Delete workflowsGetFromLirbaryById

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
****************************************/

var workflowsGetById = controller(function(req) {
    return workflowApiService.getWorkflowById(req.swagger.params.identifier.value);
});

// ********** Adding workflowsPatchById ************
var workflowsCancel = controller({success: 202}, function(req) {
    return workflowApiService.patchWorkflowById(req.swagger.params.identifier.value);
});

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

// ******* Adding workflowsDeleteById *********
var workflowsDeleteById = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsById(req.body, req.swagger.params.identifier.value);
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
