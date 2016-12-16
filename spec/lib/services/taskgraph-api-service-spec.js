// Copyright 2016, EMC, Inc.
/* jshint node:true */

"use strict";

require('../../helper');

describe("Http.Services.Taskgraph", function () {
    var tgApi;
    var Consul = require('../../mock-consul-server.js');
    var mockConsul;
    var mockGrpc = require('../../mock-grpc.js');

    before("Http.Services.Taskgraph before", function() {
        helper.setupInjector([
            helper.require('/lib/services/taskgraph-api-service')
        ]);
        mockConsul = Consul();
        tgApi = helper.injector.get('Http.Services.Api.Taskgraph.Scheduler');
    });

    beforeEach("Http.Services.Taskgraph before", function() {
        mockConsul.agent.service.serviceList.length = 0;
    });

    describe("empty service list", function() {
        it("should reject with no registered services", function() {
            return tgApi.getTasksById(123).should.be.rejectedWith(/No registered service found/);
        });
    });

    describe("invalid service", function() {
        it("should reject if specified service not registered", function() {
            mockConsul.agent.service.register({
                aaa: {
                    Service: 'foo',
                    ID: 'fooId',
                    Tags: ['scheduler'],
                    Address: 'grpcAddress',
                    Port: 31000
                }
            });
            return tgApi.getTasksById(123).should.be.rejectedWith(/No registered service found/);
        });
    });

    describe("getTaskById reject", function() {
        it("should reject invalid identifier", function () {
            mockConsul.agent.service.register({
                bbbb: {
                    Service: 'taskgraph',
                    ID: 'testID',
                    Tags: ['scheduler'],
                    Address: 'grpcAddress',
                    Port: 31000
                }
            });
            return tgApi.getTasksById(undefined).should.be.rejectedWith(/invalid task id/);
        });
    });

    describe("getTaskById fulfill", function() {
        it("should resolve", function() {
            mockConsul.agent.service.register({
                bbbb: {
                    Service: 'taskgraph',
                    ID: 'testID',
                    Tags: ['scheduler'],
                    Address: 'grpcAddress',
                    Port: 31000
                }
            });
            mockGrpc.setResponse('[{"node":"581a41cd30c24078070f9deb","_status":"succeeded"}]');
            return tgApi.getTasksById(123).should.be.fulfilled;
        });
    });

        /*
        Possible future unit tests:

        it("should reject non-existent task", function() {
            return tgApi.getTasksById('does-not-exist').should.be.rejectedWith(/task not found/);
        });

        it("should reject if no taskgraph service is not registered", function() {
            var tasksCollection = {
                '1234': {
                    foo: 'bar'
                }
            };
            tgApi.populate('tasks', tasksCollection);
            tgApi.services.none();
            return tgApi.getTasksById('1234').should.be.rejecteWith(/No registered service/);
        });

        it("should reject if no taskgraph service is not available", function() {
            var tasksCollection = {
                '1234': {
                    foo: 'bar'
                }
            };
            tgApi.populate('tasks', tasksCollection);
            tgApi.services.down();
            return tgApi.getTasksById('1234').should.be.rejecteWith(/No service available/);
        });

        it("should resolve to specified task", function() {
            var tasksCollection = {
                '1234': {
                    foo: 'bar'
                }
            };
            tgApi.populate('tasks', tasksCollection);
            return tgApi.getTasksById('1234').should.eventually.deep.equal(taskCollection[0]['1234']);
        });
        */

});
