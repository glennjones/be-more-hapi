
// this files is for testing HAPI v5
// The way plugins are called changed between v5 and v6

'use strict';
var hapi            = require('hapi'),
    swagger         = require('hapi-swagger'),
    pack            = require('../package'),
    routes          = require('../lib/routes.js');


var serverOptions = {
    views: {
        path: 'templates',
        engines: { html: 'handlebars' },
        partialsPath: './templates/withPartials',
        helpersPath: './templates/helpers',
        isCached: false
    },
    cors: true
};


var server = hapi.createServer('localhost', 3000, serverOptions);
server.route(routes.routes);


server.start(function(){
    console.log(['start'], pack.name + ' - web interface: ' + server.info.uri);
});


// setup swagger options
var swaggerOptions = {
    basePath: 'http://localhost:3000',
    apiVersion: pack.version
};


// adds swagger self documentation plugin
server.pack.require({'hapi-swagger': swaggerOptions}, function (err) {
    if (err) {
        console.log(['error'], 'plugin "hapi-swagger" load error: ' + err) 
    }else{
        console.log(['start'], 'swagger interface loaded')
    }
});

 
