// Copyright 2014-2015, Renasar Technologies Inc.
/* jshint node: true */
'use strict';

var di = require('di');

module.exports = profileApiServiceFactory;
di.annotate(profileApiServiceFactory, new di.Provide('Http.Services.Api.Profiles'));
di.annotate(profileApiServiceFactory,
    new di.Inject(
        'Protocol.TaskGraphRunner',
        'Protocol.Task',
        'Services.Waterline',
        'Logger',
        'Errors',
        '_'
    )
);
function profileApiServiceFactory(
    taskGraphProtocol,
    taskProtocol,
    waterline,
    Logger,
    Errors,
    _
) {

    var logger = Logger.initialize(profileApiServiceFactory);

    function ProfileApiService() {
    }

    // Helper to convert property kargs into an ipxe friendly string.
    ProfileApiService.prototype.convertProperties = function(properties) {
        properties = properties || {};

        if (properties.hasOwnProperty('kargs')) {
            // This a promotion of the kargs property
            // for DOS disks (or linux) for saving
            // the trouble of having to write a
            // bunch of code in the EJS template.
            properties.kargs = _.map(
                properties.kargs, function (value, key) {
                return key + '=' + value;
            }).join(' ');
        } else {
            // Ensure kargs is set for rendering.
            properties.kargs = null;
        }

        return properties;
    };

    ProfileApiService.prototype.getMacs = function(macs) {
        return _.flatten([macs]);
    };

    ProfileApiService.prototype.getNode = function(macAddresses) {
        var self = this;
        return waterline.nodes.findByIdentifier(macAddresses)
        .then(function (node) {
            if (node) {
                return node;
            } else {
                return self.createNodeAndRunDiscovery(macAddresses);
            }
        });
    };

    ProfileApiService.prototype.createNodeAndRunDiscovery = function(macAddresses) {
        return waterline.nodes.create({
            name: macAddresses.join(','),
            identifiers: macAddresses
        })
        .then(function (node) {
            // Setting newRecord to true allows us to
            // render the redirect again to avoid refresh
            // of the node document and race conditions with
            // the state machine changing states.
            node.newRecord = true;

            var options = {
                defaults: {
                    graphOptions: {
                        target: node.id
                    },
                    nodeId: node.id
                }
            };

            return taskGraphProtocol.runTaskGraph(
                'Graph.SKU.Discovery', options, undefined)
            .then(function() {
                return node;
            });
        });
    };

    ProfileApiService.prototype.renderProfileFromTask = function(node) {
        var self = this;
        return taskGraphProtocol.getActiveTaskGraph({ target: node.id })
        .then(function (taskgraphInstance) {
            if (taskgraphInstance) {
                return taskProtocol.requestProfile(node.id)
                .then(function(profile) {
                    return [profile, taskProtocol.requestProperties(node.id)];
                })
                .spread(function (profile, properties) {
                    return {
                        profile: profile || 'redirect.ipxe',
                        options: self.convertProperties(properties)
                    };
                })
                .catch(function (e) {
                    logger.error("Unable to retrieve workflow properties.", {
                        error: e,
                        id: node.id,
                        taskgraphInstance: taskgraphInstance
                    });
                    return {
                        profile: 'error.ipxe',
                        options: {
                            error: 'Unable to retrieve workflow properties.'
                        }
                    };
                });
            } else {
                return {
                    profile: 'error.ipxe',
                    options: {
                        error: 'Unable to locate active workflow.'
                    }
                };
            }
        });
    };

    return new ProfileApiService();
}