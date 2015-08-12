/*

'use strict';
var Hapi            = require('hapi'),
    Swagger         = require('hapi-swagger'),
    Blipp           = require('blipp'),
    Pack            = require('../package'),
    Routes          = require('../lib/routes.js');
    


//Example of the use of more than one connection


var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3001, 
    labels: 'a' 
});
server.connection({ 
    host: 'localhost',
    port: 3002, 
    labels: 'b' 
});



// plug-in with routes
var apiPlugin = {
    register: function (plugin, options, next) {

        plugin.route({
            method: 'GET',
            path: '/api',
            config: {
                handler: function (request, reply) {
                    reply('Main DELETE');
                },
                description: 'Main GET',
                tags: ['api']
                
            }
        });

        return next();
    }
};

apiPlugin.register.attributes = {
    name: 'an api plugin',
    version: '0.0.1'
};


// plug-in with routes
var mainPlugin = {
    register: function (plugin, options, next) {

        plugin.route({
            method: 'GET',
            path: '/main',
            config: {
                handler: function (request, reply) {
                    reply('Main GET');
                },
                description: 'Main post',
                tags: ['api']
            }
        });

        plugin.route({
            method: 'POST',
            path: '/main/{foo}/comment/{bar}',
            config: {
                handler: function (request, reply) {
                    reply('Main post');
                },
                description: 'Main POST',
                tags: ['api']
            }
        });

        plugin.route({
            method: 'DELETE',
            path: '/main/{id}',
            config: {
                handler: function (request, reply) {
                    reply('Main DELETE');
                },
                description: 'Main post',
                tags: ['api']
            }
        });


        return next();
    }
};

mainPlugin.register.attributes = {
    name: 'main',
    version: '0.1.1'
};



// add all the normal routes to both connectsion
server.route(Routes.routes);


// setup template engine
server.views({
        path: 'templates',
        engines: { html: require('handlebars') },
        partialsPath: './templates/withPartials',
        helpersPath: './templates/helpers',
        isCached: false
    })


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






// register all the plug-ins and start server
server.register([{
        register: require('hapi-swagger'), 
        options: swaggerOptions
    },{
        register: require('blipp')
    }], function (err) {
            server.register([mainPlugin], { select: 'a' }, function (err) {
                server.register([apiPlugin], { select: 'b', routes: {prefix: '/v2'} }, function (err) {
                   
                    console.log(['hapi-swagger','start'], 'swagger interface loaded')
                    server.start(function(){
                        console.log(['hapi','start'], Pack.name + ' - web interface: ' + server.info.uri);
                    });

                });
            });
        });



*/


