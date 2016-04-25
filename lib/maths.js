'use strict';
const ConvertBase = require('convert-base');
const converter = new ConvertBase();


module.exports = {


    // 'add'
    add: function(options, callback) {

        let result;
        if (validNumbers(options)) {
            result = options.a + options.b;
            callback(null, toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'subtract'
    subtract: function(options, callback) {

        let result;
        if (validNumbers(options)) {
            result = options.a - options.b;
            callback(null, toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'divide'
    divide: function(options, callback) {

        let result;
        if (validNumbers(options)) {
            if (!isZero(options.a) && !isZero(options.b)) {
                result = options.a / options.b;
                callback(null, toFormat(options, result));
            } else {
                callback('One of the supplied numbers is set zero. You cannot divide by zero.', null);
            }
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    },


    // 'multiple'
    multiple: function(options, callback) {

        let result;
        if (validNumbers(options)) {
            result = options.a * options.b;
            callback(null, toFormat(options, result));
        } else {
            callback('The one of the two numbers was not provided', null);
        }
    }


};



// tests that object has properties a and b and they are both numbers
const validNumbers = function(options) {

    if (options.hasOwnProperty('a') &&
        options.hasOwnProperty('b') &&
        isNumber(options.a) &&
        isNumber(options.b)
    ) {
        return true;
    }
    return false;
}


// if options has a binary format convert number
const toFormat = function(options, result) {

    if (options.format === 'binary') {
        return converter.convert(result, 10, 2);  // decimal to binary
    } else {
        return result;
    }
}


// is object a number
const isNumber = function(n) {

    return (!isNaN(parseFloat(n)) && isFinite(n));
}


// is object a number that a 0 (zero)
const isZero = function(obj) {

    if (isNumber(obj) && obj === 0) {
        return true;
    }
    return false;
}
