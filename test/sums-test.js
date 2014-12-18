'use strict';

var Hapi        = require('hapi'),
    assert      = require('assert'),
    chai        = require('chai'),
    assert      = chai.assert,
    routes      = require('../lib/routes.js');


// integration tests for API endpoint


// setup server with firing up - use inject instead
var server = new Hapi.Server();

server.connection({ host: 'test' });
server.route(routes.routes);


// parseurls endpoint test
describe('add endpoint', function(){


  it('add - should add two numbers together', function(done){
    server.inject({method: 'PUT', url: '/sum/add/5/5'}, function (res) {
        assert.deepEqual(
        {
          'equals': 10      
        }, JSON.parse(res.payload));
        done();
    });
  });


  it('add - should error if a string is passed', function(done){
    server.inject({method: 'PUT', url: '/sum/add/100/x'}, function (res) {
        assert.deepEqual(
        {
          'statusCode': 400,
          'error': 'Bad Request',
          'message': 'b must be a number',
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