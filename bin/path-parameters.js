var Hapi            = require('hapi'),
    Inert           = require('inert'),
    Vision          = require('vision'),
    Blipp           = require('blipp'),
    Joi             = require('joi'),
    Pack            = require('../package');

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});


var getAlbum = function (request, reply) {
    return reply('You asked for ' +
        (request.params.song ? request.params.song + ' from ' : '') +
        request.params.album);
};


var swaggerOptions = {};


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


server.route([{
    path: '/{album}/',
    method: 'GET',
    config: {
        description:'Get album',
        tags: ['api'],
        handler: getAlbum,
        validate: {
            params:{
                album: Joi.string().required()
            }
        }
    }
},{
    path: '/{album}/{song}',
    method: 'GET',
    config: {
        description:'Get album and song',
        tags: ['api'],
        handler: getAlbum,
        validate: {
            params:{
                album: Joi.string().required(),
                song: Joi.string().required()
            }
        }
    }
}]);