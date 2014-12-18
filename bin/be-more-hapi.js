'use strict';
var Hapi            = require('hapi'),
    Swagger         = require('hapi-swagger'),
    Pack            = require('../package'),
    Routes          = require('../lib/routes.js');




var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3000 
});

server.route(Routes.routes);

server.views({
        path: 'templates',
        engines: { html: require('handlebars') },
        partialsPath: './templates/withPartials',
        helpersPath: './templates/helpers',
        isCached: false
    })


// setup swagger options
var swaggerOptions = {
    basePath: 'http://localhost:3000',
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



// adds swagger self documentation plugin
server.register({
        register: require('hapi-swagger'), 
        options: swaggerOptions
    }, function (err) {
        if (err) {
            console.log(['error'], 'plugin "hapi-swagger" load error: ' + err) 
        }else{
            console.log(['start'], 'swagger interface loaded')

            server.start(function(){
                console.log(['start'], Pack.name + ' - web interface: ' + server.info.uri);
            });
        }
    });
















