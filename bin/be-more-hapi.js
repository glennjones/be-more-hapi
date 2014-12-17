'use strict';
var hapi            = require('hapi'),
    swagger         = require('hapi-swagger'),
    pack            = require('../package'),
    routes          = require('../lib/routes.js');


var serverOptions = {
    cors: true
};


var server = hapi.createServer('localhost', 3000, serverOptions);
server.route(routes.routes);
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
    apiVersion: pack.version,
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
server.pack.register({plugin: require('hapi-swagger'), options: swaggerOptions}, function (err) {
    if (err) {
        console.log(['error'], 'plugin "hapi-swagger" load error: ' + err) 
    }else{
        console.log(['start'], 'swagger interface loaded')

        server.start(function(){
            console.log(['start'], pack.name + ' - web interface: ' + server.info.uri);
        });
    }
});

 












