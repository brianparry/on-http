'use strict';

module.exports = {
    middleware: middleware
};

function middleware(req, res, next) {
    console.log('middleware called');
}
