'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Chai = require('chai');

const Routes = require('../lib/routes.js');
const assert = Chai.assert;


// setup server with firing up - use inject instead
const server = new Hapi.Server();
server.connection();

// register plug-ins
server.register([
    Inert,
    Vision,
    ], function (err) {
        server.start(function( err ){
          if(err){
            console.log(err);
          }
        });
    });

server.route(Routes);


// parseurls endpoint test
describe('add endpoint', function(){

  it('add - should add two numbers together', (done) => {

    server.inject({method: 'PUT', url: '/sum/add/5/5'}, (res) => {

        assert.deepEqual(
        {
          'equals': 10
        }, JSON.parse(res.payload));
        done();
    });
  });


  it('add - should error if a string is passed', (done) =>{

    server.inject({method: 'PUT', url: '/sum/add/100/x'}, (res) => {

        assert.deepEqual(
        {
          'statusCode': 400,
          'error': 'Bad Request',
          'message': 'child "b" fails because ["b" must be a number]',
          'validation': {
            'source': 'params',
            'keys': [
              'b'
            ]
          }
        }, JSON.parse(res.payload));
        done();
    });
  });

});
