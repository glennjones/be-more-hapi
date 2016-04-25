'use strict';
const chai = require('chai');

const Maths = require('../lib/maths');
const assert = chai.assert;

// units tests math.js

describe('maths', () => {


	it('should add numbers together', (done) =>{

		var options = {
			a: 5,
			b: 5
		};
		Maths.add(options, (error, result) => {

			assert.equal(result, 10, '5 + 5 should = 10');
			assert.equal(error, null, '5 + 5 should = 10 without error');
			done();
		});
	});

	it('should capture type errors', (done) => {

		var options = {
			a: 'text',
			b: 5
		};
		Maths.add(options, (error, result) => {

			assert.equal(result, null, 'if input is not a number return null');
			assert.equal(error, 'The one of the two numbers was not provided', 'if a input is not a number throw error');
			done();
		});
	});

	it('should capture missing input errors', (done) => {

		var options = {
			a: '5'
		};
		Maths.add(options, (error, result) => {

			assert.equal(result, null, 'if we are missing input is not a number return null');
			assert.equal(error, 'The one of the two numbers was not provided', 'if we are missing input throw error');
			done();
		});
	});

	it('should subtract numbers', (done) => {

		var options = {
			a: 10,
			b: 5
		};

		Maths.subtract(options, (error, result) => {

			assert.equal(result, 5, '10 - 5 should = 5');
			assert.equal(error, null, '10 - 5 should = 5 without error');
			done();
		});
	});

	it('should divide numbers', (done) => {

		var options = {
			a: 10,
			b: 5
		};
		Maths.divide(options, (error, result) => {

			assert.equal(result, 2, '10 / 5 should = 2');
			assert.equal(error, null, '10 / 5 should = 2 without error');
			done();
		});
	});

	it('should divide capture divide by zero errors', (done) => {

		var options = {
			a: 10,
			b: 0
		};
		Maths.divide(options, (error, result) => {

			assert.equal(result, null, 'should return null for dividing by zero error');
			assert.equal(error, 'One of the supplied numbers is set zero. You cannot divide by zero.', 'should throw an error for dividing by zero');
			done();
		});
	});

	it('should multiple numbers', (done) => {

		var options = {
			a: 10,
			b: 5
		};
		Maths.multiple(options, (error, result) => {

			assert.equal(result, 50, '10 * 5 should = 50');
			assert.equal(error, null, '10 * 5 should = 50 without error');
			done();
		});
	});

});
