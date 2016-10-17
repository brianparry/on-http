// Copyright 2016, EMC, Inc.

'use strict';

var _ = require('lodash');

var serviceList = [];

var consul = {
    agent: {
        service: {
            serviceList: serviceList,
            list: function () {
                return new Promise(function (resolve, reject) {
                    resolve(serviceList);
                });
            },
            register: function (service) {
                serviceList.push(service);
            },
            deregister: function (serviceId) {
                _.remove(serviceList, function (id) {
                    id == serviceId.id;
                });
            }
        }
    }
};

function mockConsulServer() {
    return consul;
}

module.exports = mockConsulServer;
