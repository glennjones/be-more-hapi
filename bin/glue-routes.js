'use strict';
var Routes          = require('../lib/routes.js');


// creates a plugin which injects routes use with glue config


var after = function (server, next) {
    // put logic here
    server.route( Routes );
    return next();
};


exports.register = function (server, options, next) {
    // add route dependencies
    server.dependency(['inert','vision'], after);
    next();
};


exports.register.attributes = {
    name: 'route',
    multiple: true
};



