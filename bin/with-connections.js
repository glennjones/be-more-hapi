
// Used to test server connections and plugins documentation

'use strict';
var Hapi        = require('hapi'),
    Inert       = require('inert'),
    Vision      = require('vision'),
    Blipp       = require('blipp'),
    Hoek        = require('hoek'),
    Pack        = require('../package');

var server = new Hapi.Server();

server.connection({ host: 'localhost', port: 3000, labels: 'a' });
server.connection({ host: 'localhost', port: 3001, labels: 'b' });
server.connection({ host: 'localhost', port: 3002, labels: 'c' });



var plugin1 = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/plugin1',
        config: {
            handler: function (request, reply) {
                reply('Hi from plugin 1');
            },
            description: 'plugin1',
            tags: ['api']
        }
    });
    next();
};
plugin1.attributes = { name: 'plugin1' };



var plugin2 = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/plugin2',
        config: {
            handler: function (request, reply) {
                reply('Hi from plugin 2');
            },
            description: 'plugin2',
            tags: ['api']
        }
    });
    next();
};
plugin2.attributes = { name: 'plugin2' };



// setup swagger options
var swaggerOptions = {
    apiVersion: Pack.version,
    authorizations: {
        default: {
            type: "apiKey",
            passAs: "header",
            keyname: "authentication"
        }
    },
    info: {
        title: 'be more hapi',
        description: 'This web API was built to demonstrate some of the hapi features and functionality.',
        contact: 'glennjonesnet@gmail.com',
        license: 'MIT',
        licenseUrl: '/license'
    }
};

var swaggerOptionsA = Hoek.clone(swaggerOptions),
    swaggerOptionsB = Hoek.clone(swaggerOptions)

swaggerOptionsA.basePath = 'http://localhost:3000';
swaggerOptionsB.basePath = 'http://localhost:3001';



// defaults
server.register([
    Blipp,
    Inert,
    Vision,
], function (err) {
    if (err) {
        throw err;
    }
    
    // interface a
    server.register([
        plugin1,
        {
            register: require('hapi-swagger'),
            options: swaggerOptionsA
        }], { select: ['a'] }, function (err) {
            if (err) {
                throw err;
            }
            
            // interface b
            server.register([
                plugin2,
                {
                    register: require('hapi-swagger'),
                    options: swaggerOptionsB
                }], { select: ['b'] }, function (err) {
                    if (err) {
                        throw err;
                    }
                    server.start(function () {
                        console.log('Server running at:', server.info.uri);
                    });
                });

        });

});

