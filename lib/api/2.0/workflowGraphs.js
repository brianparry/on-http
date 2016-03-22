// Copyright 2016, EMC Inc.

'use strict';

var injector = require('../../../index.js').injector;
var controller = injector.get('Http.Services.Swagger').controller;
var workflowApiService = injector.get('Http.Services.Api.Workflows');
var _ = require('lodash');    // jshint ignore:line


//********** Adding workflowsGetGraphs *************
var workflowsGetGraphs = controller(function(req) {
    return workflowApiService.getGraphDefinitions();
});

// ********* Adding workflowsGetGraphsByName ***********
var workflowsGetGraphsByName = controller(function(req) {
   
    return workflowApiService.getGraphDefinitions(req.swagger.params.injectableName.value);
});

// ******** Adding workflowsPutGraphs *****************
// Can include name in body to modify a specific graph
var workflowsPutGraphs = controller({success: 202},function(req) {
    return workflowApiService.defineTaskGraph(req.body);
});

// ******* Adding workflowsDeleteGraphsByName *********
var workflowsDeleteGraphsByName = controller({success: 202}, function(req) {
    return workflowApiService.destroyGraphDefinition(req.swagger.params.injectableName.value); 
});

module.exports = {
    
    workflowsGetGraphs: workflowsGetGraphs,
    workflowsGetGraphsByName: workflowsGetGraphsByName,
    workflowsPutGraphs: workflowsPutGraphs,
    workflowsDeleteGraphsByName: workflowsDeleteGraphsByName
};
