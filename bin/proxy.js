var Hapi            = require('hapi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    Blipp           = require('blipp'),
    Joi             = require('joi'),
    H2o2            = require('h2o2'),
    Wreck           = require('wreck'),
    Pack            = require('../package');

var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 3000 
});


var swaggerOptions = {};


// register plug-ins 
server.register([
    Inert,
    Vision,
    Blipp,
    H2o2,
    {
        register: require('hapi-swagger'), 
        options: swaggerOptions
    }
    ], function (err) {
        server.start(function(){
            console.log('Server running at:', server.info.uri);
        });
    });
    
    
var ufModel = Joi.object({
	url: Joi.string().required()
}).meta({
  className: 'Microformats'
});    
    


server.route([{
    method: 'GET',
    path: '/rest/v1/alpha/gb',
    config: {
        description:'country GB info - with passthrough',
        tags: ['api'],
        handler: {
            proxy: {
                host: 'restcountries.eu',
                protocol: 'https',
                passThrough: true,
                xforward: true,
                onResponse: replyWithJSON
            }
        }
    }
  },{
    method: 'GET',
    path: '/rest/v1/alpha/{code}',
    config: {
        description:'country GB info - with passthrough while validating param',
        tags: ['api'],
        validate: {
            params: {
                code: Joi.string().length(2).lowercase().required()
            }
        },
        handler: {
            proxy: {
                host: 'restcountries.eu',
                protocol: 'https',
                passThrough: true,
                xforward: true,
                onResponse: replyWithJSON
            }
        }
    }
  },{
    method: 'GET',
    path: '/country/gb',
    config: {
        description:'country GB info - with uri ',
        tags: ['api'],
        handler: {
            proxy: {
                uri: 'https://restcountries.eu/rest/v1/alpha/gb',
                onResponse: replyWithJSON
            }
        }
    }
  },{
    method: 'GET',
    path: '/country/2/{code}',
     config: {
        description:'country info by code',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                validate: {
                    params: {
					   code: Joi.string().length(2).lowercase().required()
                    }
                },
            },
        },
        handler: {
            proxy: {
                mapUri: function (request, callback) {
                    var code = request.params.code;
                    callback(null, 'http://restcountries.eu/rest/v1/alpha/' + code);
                },
                onResponse: replyWithJSON
            }
        }
    }
},{
    method: 'GET',
    path: '/country/3/{code}',
     config: {
        description:'country info by code - manual passing on param',
        tags: ['api'],
        validate: {
            params: {
                code: Joi.string().length(2).lowercase().required()
            }
        },
        handler: {
            proxy: {
                mapUri: function (request, callback) {
                    var code = request.params.code;
                    callback(null, 'http://restcountries.eu/rest/v1/alpha/' + code);
                },
                onResponse: replyWithJSON
            }
        }
    }
},{
    method: 'GET',
    path: '/country/4',
     config: {
        description:'country info by code  - manual passing a swapped query to param',
        tags: ['api'],
        validate: {
            query: {
                code: Joi.string().length(2).lowercase().required()
            }
        },
        handler: {
            proxy: {
                mapUri: function (request, callback) {
                    var code = request.query.code;
                    callback(null, 'http://restcountries.eu/rest/v1/alpha/' + code);
                },
                onResponse: replyWithJSON
            }
        }
    }
},{
    method: 'POST',
    path: '/tools/microformats',
    config: {
        description:'parse microformats',
        tags: ['api'],        
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
                validate: {
                    payload: {
					   url: Joi.string().uri().required(),
                       callback: Joi.string(),
                       collapsewhitespace: Joi.boolean(),
                       dateformat: Joi.any().allow(['auto', 'w3c', 'rfc3339', 'html5'])
                    }
                }
            },
        },
        handler: {
            proxy: {
                host: 'glennjones.net',
                protocol: 'http',
                onResponse: replyWithJSON
            }
        }
    }
  },{
    method: 'POST',
    path: '/tools/microformats/',
     config: {
        description:'parse microformats',
        tags: ['api'],
        plugins: {
            'hapi-swagger': {
                nickname: 'microformatsapi',
                validate: {
                    payload: {
					   url: Joi.string().uri().required(),
                       callback: Joi.string(),
                       collapsewhitespace: Joi.boolean(),
                       dateformat: Joi.any().allow(['auto', 'w3c', 'rfc3339', 'html5'])
                    }
                }
            },
        },
        handler: {
            proxy: {
                host: 'glennjones.net',
                protocol: 'http',
                onResponse: replyWithJSON
            }
        }
    }
}]);



function replyWithJSON( err, res, request, reply, settings, ttl ){
    Wreck.read(res, { json: true }, function (err, payload) {
        reply(payload);
    });
}
