'use strict';
var Glue            = require('glue'),
    Pack            = require('../package');


// setup swagger options
var swaggerOptions = {
    info: {
        version: Pack.version,
        title: 'be more hapi',
        description: 'This web API was built to demonstrate some of the hapi features and functionality.'
    },
    tags: [{
        'name': 'sum',
        'description': 'working with maths',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }, {
        'name': 'store',
        'description': 'storing your susm for later use',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }]
};

var manifest = {
    server: {},
    connections: [
        {
            host: 'localhost',
            port: 3000,
            labels: ['web']
        }
    ],
    registrations: [
        {plugin: 'inert'},
        {plugin: 'vision'},
        {plugin: {
                register: 'visionary',
                options: {
                    'engines': { 'html': 'handlebars' },
                    'path': 'templates',
                    'partialsPath': './templates/withPartials',
                    'helpersPath': './templates/helpers',
                    'isCached': false
                }
            }
        },
        {plugin: 'blipp'},
        {plugin: {
                register: 'hapi-swagger',
                options: swaggerOptions
            }
        },
        {plugin: '../bin/glue-routes.js'}
    ]
};

var options = {
    relativeTo: __dirname
};

Glue.compose(manifest, options, function(err, server) {

    if (err) {
        throw err;
    }


    server.start(function() {

        console.log('hapi days!');
    });
});