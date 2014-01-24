'use strict';
var hapi            = require('hapi'),
    swagger         = require('hapi-swagger'),
    pack            = require('../package'),
    routes          = require('../lib/routes.js');


var serverOptions = {
    views: {
        path: 'templates',
        engines: { html: 'handlebars' },
        partialsPath: __dirname.replace('/bin','') + '/templates/withPartials',
        helpersPath: __dirname.replace('/bin','') + '/templates/helpers',
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
    if (!err && err !== null) {
        console.log(['error'], 'plugin "hapi-swagger" load error: ' + err) 
    }else{
        console.log(['start'], 'swagger interface loaded')
    }
});

 





