'use strict';
var Hapi            = require('hapi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    Blipp           = require('blipp'),
    Pack            = require('../package'),
    Routes          = require('../lib/routes.js');


var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3000 
});


    
// setup swagger options
var swaggerOptions = {
    apiVersion: Pack.version,
    basePath: 'http://localhost:3000',
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
server.route(Routes.routes);

// add templates support with handlebars
server.views({
    path: 'templates',
    engines: { html: require('handlebars') },
    partialsPath: './templates/withPartials',
    helpersPath: './templates/helpers',
    isCached: false
})








