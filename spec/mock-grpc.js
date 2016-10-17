// Copyright 2016, EMC, Inc.

'use strict';

var response;

var functions = {
    getTasksById: function(client, callback) {
        if (client.identifier == undefined) {
            return callback('invalid task id', undefined);
        } else {
            //return callback(undefined, {response: '[{"node":"581a41cd30c24078070f9deb","_status":"succeeded"}]'});
            return callback(undefined, {response: response});
        }
    },
    workflowsGet: function(client, callback) {
        if (typeof response === 'object') {
            throw response;
        }
        return callback(undefined, {response: response});
    }
};

var scheduler = {
    scheduler: {
        Scheduler: function() {
            return functions;
        }
    }
};

var mockGrpc = {
    credentials: {
        createInsecure: function() {}
    },
    load: function() {
        return scheduler;
    },
    setResponse: function(res) {
        response = res;
    }
};

module.exports = mockGrpc;