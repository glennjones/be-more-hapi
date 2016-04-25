'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp');
const Pack = require('../package');
const Routes = require('../lib/routes.js');


const  server = new Hapi.Server();
server.connection({
    host: (process.env.HOST || 'localhost'),
    port: (process.env.PORT || 3000),
    routes: { cors: true }
});



// setup swagger options
const swaggerOptions = {
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
        'description': 'storing your sums for later use',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }]
};

// register plug-ins
server.register([
    Inert,
    Vision,
    Blipp,
    {
        register: require('hapi-swagger'),
        options: swaggerOptions
    }
    ], function (err) {
        server.start(function(){
            console.log('Server running at:', server.info.uri);
        });
    });


// add routes
server.route(Routes);

// add templates support with handlebars
server.views({
    path: 'templates',
    engines: { html: require('handlebars') },
    partialsPath: './templates/withPartials',
    helpersPath: './templates/helpers',
    isCached: false
})





