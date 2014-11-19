'use strict';

var ConvertBase = require('convert-base'),
	converter = new ConvertBase();

// this could be a stand alone node module
// but for this example it is part of our simple API


module.exports = {


	// 'add' 
	add: function (options, callback){
		var result;
		if( validNumbers(options) ) {
			result = options.a + options.b;
			callback(null, toFormat(options,result));
		} else {
			callback('The one of the two numbers was not provided', null);
		}
	},


	// 'subtract' 
	subtract: function (options, callback){
		var result;
		if( validNumbers(options) ) {
			result = options.a - options.b;
			callback(null, toFormat(options,result));
		}else{
			callback('The one of the two numbers was not provided', null);
		}
	},


	// 'divide' 
	divide: function(options, callback){
		var result;
		if( validNumbers(options) ){
			if( !isZero(options.a) && !isZero(options.b) ) {
				result = options.a / options.b;
				callback(null, toFormat(options,result));
			}else{
				callback('One of the supplied numbers is set zero. You cannot divide by zero.', null);
			}
		}else{
			callback('The one of the two numbers was not provided', null);
		}
	},


	// 'multiple' 
	multiple: function (options, callback){
		var result;
		if( validNumbers(options) ) {
			result = options.a * options.b;
			callback(null, toFormat(options,result));
		}else{
			callback('The one of the two numbers was not provided', null);
		}
	}


};



// tests that object has properties a and b and they are both numbers
function validNumbers(options){
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
function toFormat( options, result ){
	if(options.format === 'binary'){
		return converter.convert(result, 10, 2);  // decimal to binary
	}else{
		return result;
	}
}


// is object a number
function isNumber(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}


// is object a number that a 0 (zero)
function isZero( obj ){
	if(isNumber( obj ) && obj === 0){
		return true;
	}
	return false;
}




