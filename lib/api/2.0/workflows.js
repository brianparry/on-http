// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line

<<<<<<< HEAD

//should we change to workflowsGetAll ???
=======
>>>>>>> ecd7ce5040f0618bf7dc3b8e0d1c1973fd387800
var workflowsGetActive = controller(function(req) {
    return workflowApiService.getActiveWorkflows(req.query);
});

var workflowsPost = controller({success: 201}, function(req) {
    var configuration = _.defaults(req.query || {}, req.body || {});
    return workflowApiService.createAndRunGraph(configuration);
});
<<<<<<< HEAD
/****** Delete workflowsPut ******
var workflowsPut = controller({success: 201}, function(req) {
    return workflowApiService.defineTaskGraph(req.body);
});
****************************************/
=======

var workflowsPut = controller({success: 201}, function(req) {
    return workflowApiService.defineTaskGraph(req.body);
});
>>>>>>> ecd7ce5040f0618bf7dc3b8e0d1c1973fd387800

var workflowsPutTask = controller({success: 201}, function(req) {
    return workflowApiService.defineTask(req.body);
});

var workflowsGetAllTasks = controller(function() {
    return workflowApiService.getTaskDefinitions();
});

<<<<<<< HEAD
// ****** Adding workflowsGetTasksByName *****************
var workflowsGetTasksByName = controller(function(req) {
    return workflowApiService.getWorkflowsTasksByName(req.swagger.params.identifier.value);
});

// ***** Adding workflowsDeleteTasksByName ***************
var workflowsDeleteTasksByName = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsTasksByName(req.swagger.params.identifier.value);
});

/*******  Delete workflowsGetAllFromLibrary

var workflowsGetAllFromLibrary = controller(function() {
    return workflowApiService.getGraphDefinitions();
});
***************************************/

/*******  Delete workflowsGetFromLirbaryById
=======
>>>>>>> ecd7ce5040f0618bf7dc3b8e0d1c1973fd387800

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
<<<<<<< HEAD
****************************************/
=======
>>>>>>> ecd7ce5040f0618bf7dc3b8e0d1c1973fd387800

var workflowsGetById = controller(function(req) {
    return workflowApiService.getWorkflowById(req.swagger.params.identifier.value);
});

<<<<<<< HEAD
// ********** Adding workflowsPatchById ************
var workflowsPatchById = controller({success: 202}, function(req) {
    return workflowApiService.patchWorkflowById(req.swagger.params.identifier.value);
});

//********** Adding workflowsGetGraphs *************
var workflowsGetGraphs = controller(function(req) {
    return workflowApiService.getWorkflowsGraphs();
});

// ********* Adding workflowsGetGraphsByName ***********
var workflowsGetGraphsByName = controller(function(req) {
    return workflowApiService.getWorkflowsGraphsByName(req.swagger.params.identifier.value);
});

// ******** Adding workflowsPutGraphs *****************
var workflowsPutGraphs = controller({success: 202},function(req) {
    return workflowApiService.putWorkflowsGraphs(req.body);
});

// ******* Adding workflowsPutGraphsByName ************
var workflowsPutGraphsByName = controller({success: 202}, function(req) {
    return workflowApiService.putWorkflowsGraphsByName(req.body, req.swagger.params.identifer.value);
});

// ******* Adding workflowsDeleteGraphsByName *********
var workflowsDeleteGraphsByName = controller({success: 202}, function(req) {
    return workflowApiService.deleteWorkflowsGraphsByName(req.body, req.swagger.params.identifier.value);
});




=======
>>>>>>> ecd7ce5040f0618bf7dc3b8e0d1c1973fd387800
module.exports = {
    
    //update GetActive if we change method name
    workflowsGetActive: workflowsGetActive,

    workflowsPost: workflowsPost,
//    workflowsPut: workflowsPut,
    workflowsPutTask: workflowsPutTask,
    workflowsGetAllTasks: workflowsGetAllTasks,
//    workflowsGetAllFromLibrary: workflowsGetAllFromLibrary,
//    workflowsGetFromLibraryById: workflowsGetFromLibraryById,
    workflowsGetById: workflowsGetById,
    workflowsGetTasksByName: workflowsGetTasksByName,
    workflowsDeleteTasksByName: workflowsDeleteTasksByName,
    workflowsPatchById: workflowsPatchById,
    workflowsGetGraphs: workflowsGetGraphs,
    workflowsGetGraphsByName: workflowsGetGraphsByName,
    workflowsPutGraphs: workflowsPutGraphs,
    workflowsPutGraphsByName: workflowsPutGraphsByName,
    workflowsDeleteGraphsByName: workflowsDeleteGraphsByName


};
