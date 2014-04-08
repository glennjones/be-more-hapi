'use strict';

var chai		= require('chai'),
	assert		= chai.assert,
	maths       = require('../lib/maths');

// units tests math.js 

describe('maths', function(){


	it('should add numbers together', function(done){
		var options = {
			a: 5,
			b: 5
		};
		maths.add(options, function(error, result){
			assert.equal(result, 10, '5 + 5 should = 10');
			assert.equal(error, null, '5 + 5 should = 10 without error');
			done();
		});
	});

	it('should capture type errors', function(done){
		var options = {
			a: 'text',
			b: 5
		};
		maths.add(options, function(error, result){
			assert.equal(result, null, 'if input is not a number return null');
			assert.equal(error, 'The one of the two numbers was not provided', 'if a input is not a number throw error');
			done();
		});
	});

	it('should capture missing input errors', function(done){
		var options = {
			a: '5'
		};
		maths.add(options, function(error, result){
			assert.equal(result, null, 'if we are missing input is not a number return null');
			assert.equal(error, 'The one of the two numbers was not provided', 'if we are missing input throw error');
			done();
		});
	});

	it('should subtract numbers', function(done){
		var options = {
			a: 10,
			b: 5
		};
		maths.subtract(options, function(error, result){
			assert.equal(result, 5, '10 - 5 should = 5');
			assert.equal(error, null, '10 - 5 should = 5 without error');
			done();
		});
	});

	it('should divide numbers', function(done){
		var options = {
			a: 10,
			b: 5
		};
		maths.divide(options, function(error, result){
			assert.equal(result, 2, '10 / 5 should = 2');
			assert.equal(error, null, '10 / 5 should = 2 without error');
			done();
		});
	});

	it('should divide capture divide by zero errors', function(done){
		var options = {
			a: 10,
			b: 0
		};
		maths.divide(options, function(error, result){
			assert.equal(result, null, 'should return null for dividing by zero error');
			assert.equal(error, 'One of the supplied numbers is set zero. You cannot divide by zero.', 'should throw an error for dividing by zero');
			done();
		});
	});

	it('should multiple numbers', function(done){
		var options = {
			a: 10,
			b: 5
		};
		maths.multiple(options, function(error, result){
			assert.equal(result, 50, '10 * 5 should = 50');
			assert.equal(error, null, '10 * 5 should = 50 without error');
			done();
		});
	});



});