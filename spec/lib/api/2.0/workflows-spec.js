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
            stop: sinon.stub()
        };

        this.sandbox = sinon.sandbox.create();

        return helper.startServer([
                dihelper.simpleWrapper(waterline, 'Services.Waterline'),
            ])
            .then(function() {
                workflowApiService = helper.injector.get('Http.Services.Api.Workflows');
                self.sandbox.stub(workflowApiService, 'defineTask').resolves();
                self.sandbox.stub(workflowApiService, 'defineTaskGraph').resolves();
                self.sandbox.stub(workflowApiService, 'getGraphDefinitions').resolves();
                self.sandbox.stub(workflowApiService, 'getTaskDefinitions').resolves();
                self.sandbox.stub(workflowApiService, 'getActiveWorkflows').resolves();
                self.sandbox.stub(workflowApiService, 'getWorkflowById').resolves();
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

    describe('GET /workflows', function () {
        it('should return a list of persisted graph objects', function () {
            var graph = { name: 'foobar' };
            workflowApiService.getActiveWorkflows.resolves([graph]);

            return helper.request().get('/api/2.0/workflows')
                .expect('Content-Type', /^application\/json/)
                .expect(200, [graph])
                .expect(function () {
                    expect(workflowApiService.getActiveWorkflows).to.have.been.calledOnce;
                });
        });
    });

    describe('GET /workflows/:id', function () {
        it('should return a single persisted graph', function () {
            var graph = { name: 'foobar' };
            workflowApiService.getWorkflowById.resolves(graph);

            return helper.request().get('/api/2.0/workflows/12345')
                .expect('Content-Type', /^application\/json/)
                .expect(200, graph)
                .expect(function () {
                    expect(workflowApiService.getWorkflowById).to.have.been.calledOnce;
                    expect(workflowApiService.getWorkflowById).to.have.been.calledWith('12345');
                });
        });

        it('should return a 404 if not found', function () {
            var Errors = helper.injector.get('Errors');
            workflowApiService.getWorkflowById.rejects(new Errors.NotFoundError('test'));

            return helper.request().get('/api/2.0/workflows/12345')
                .expect('Content-Type', /^application\/json/)
                .expect(404);
        });
    });

    describe('PUT /workflows', function () {
        it('should persist a task graph', function () {
            var graph = { name: 'foobar' };
            workflowApiService.defineTaskGraph.resolves(graph);

            return helper.request().put('/api/2.0/workflows')
                .send(graph)
                .expect('Content-Type', /^application\/json/)
                .expect(201, graph);
        });
    });

    describe('PUT /workflows/tasks', function () {
        it('should persist a task', function () {
            var task = { name: 'foobar' };
            workflowApiService.defineTask.resolves(task);

            return helper.request().put('/api/2.0/workflows/tasks')
                .send(task)
                .expect('Content-Type', /^application\/json/)
                .expect(201, task);
        });
    });

    describe('GET /workflows/tasks/library', function () {
        it('should retrieve the task library', function () {
            var task = { name: 'foobar' };
            workflowApiService.getTaskDefinitions.resolves([task]);

            return helper.request().get('/api/2.0/workflows/tasks/library')
                .expect('Content-Type', /^application\/json/)
                .expect(200, [task]);
        });
    });

    describe('GET /workflows/library', function () {
        it('should retrieve the graph library', function () {
            var graph = { name: 'foobar' };
            workflowApiService.getGraphDefinitions.resolves([graph]);

            return helper.request().get('/api/2.0/workflows/library')
                .expect('Content-Type', /^application\/json/)
                .expect(200, [graph]);
        });
    });

    describe('GET /workflows/library/:id', function () {
        it('should retrieve a graph from the graph library', function () {
            var graph = { friendlyName: 'foobar' };
            workflowApiService.getGraphDefinitions.resolves([graph]);

            return helper.request().get('/api/2.0/workflows/library/1234')
                .expect('Content-Type', /^application\/json/)
                .expect(200, graph)
                .expect(function () {
                    expect(workflowApiService.getGraphDefinitions).to.have.been.calledOnce;
                    expect(workflowApiService.getGraphDefinitions).to.have.been.calledWith('1234');
                });
        });
    });
});
