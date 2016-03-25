// Copyright 2016, EMC, Inc.
/* jshint node:true */

'use strict';

describe('Http.Api.Workflows.2.0', function () {
    var waterline;
    var workflowApiService;

    before('start HTTP server', function () {
        var self = this;
        this.timeout(5000);

        waterline = {
            start: sinon.stub(),
            stop: sinon.stub(),
            lookups: {
                setIndexes: sinon.stub()
            }
        };
        this.sandbox = sinon.sandbox.create();

        return helper.startServer([
            dihelper.simpleWrapper(waterline, 'Services.Waterline'),
        ])
        .then(function() {
            workflowApiService = helper.injector.get('Http.Services.Api.Workflows');
            self.sandbox.stub(workflowApiService, 'getGraphDefinitions').resolves();
            self.sandbox.stub(workflowApiService, 'getGraphDefinitions').resolves();
            self.sandbox.stub(workflowApiService, 'defineTaskGraph').resolves();
            self.sandbox.stub(workflowApiService, 'destroyGraphDefinition').resolves();
        });
    });

    after('stop HTTP server', function () {
        return helper.stopServer();
    });

    beforeEach('set up mocks', function () {
        waterline.nodes = {
            findByIdentifier: sinon.stub().resolves()
        };
        waterline.graphobjects = {
            find: sinon.stub().resolves([]),
            findByIdentifier: sinon.stub().resolves(),
            needByIdentifier: sinon.stub().resolves()
        };
        waterline.lookups = {
            // This method is for lookups only and it
            // doesn't impact behavior whether it is a
            // resolve or a reject since it's related
            // to logging.
            findOneByTerm: sinon.stub().rejects()
        };
    });

    afterEach('clean up mocks', function () {
        this.sandbox.reset();
    });

    describe('workflowsGetGraphs', function () {
        it('should retrieve the workflow Graphs', function () {
            var task = { name: 'foobar' };
            workflowApiService.getGraphDefinition.resolves([task]);

            return helper.request().get('/api/2.0/workflows/graphs')
                .expect('Content-Type', /^application\/json/)
                .expect(200, [task]);
        });
    });

    describe('workflowsGetGraphsByName', function () {
        it('should retrieve the graph by Name', function () {
            var graph = { name: 'foobar' };
            workflowApiService.getGraphDefinitions.resolves([graph]);

            return helper.request().get('/api/2.0/workflows/library')
                .expect('Content-Type', /^application\/json/)
                .expect(200, [graph]);
        });
    });

   describe('workflowsPutGraphs', function () {
        it('should persist a graph', function () {
            var graph = { name: 'foobar' };
            workflowApiService.defineTaskGraph.resolves(graph);

            return helper.request().put('/api/2.0/workflows/graphs')
            .send(graph)
            .expect('Content-Type', /^application\/json/)
            .expect(202, graph);
        });
    });
     
   describe('workflowsDeleteGraphsByName', function () {
        it('should delete Graph by name', function () {
            var graph = { name: 'Destroy Me' };
            workflowApiService.destroyGraphDefinition(graph[name]);

            return helper.request().delete('/api/2.0/workflows/graphs')
            .expect('Content-Type', /^application\/json/)
            .expect(202, {}); 
        });
    });
});

