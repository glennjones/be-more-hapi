'use strict';

var fs				= require('fs'),
	path            = require('path'),
	hapi            = require('hapi'),
	mongoose        = require('mongoose'),
	maths           = require('../lib/maths.js'),
	Store           = require('../lib/store.js').Store,
	utils           = require('../lib/utilities.js'),
	pack            = require('../package');



// mongodb connection for store
var connection = mongoose.createConnection('mongodb://127.0.0.1/be-more-hapi'),
	store = new Store(mongoose, connection);

mongoose.connection.on('error', function (err) {
  console.log(['error'], 'mongodb connect error: ' + err);
});


/* ----------------------------------------------------------------------------------- */


function index(request, reply) {
	utils.getMarkDownHTML(__dirname.replace('/lib','') + '/README.md', function(err, data){
		reply.view('swagger.html', {
			title: pack.name + ' &#151; Calculator',
			markdown: data
		});
	});
}


/* ----------------------------------------------------------------------------------- */

function add (request, reply) { 
	maths.add( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	}); 
}

function subtract (request, reply) { 
	maths.subtract( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});  
}

function divide (request, reply) { 
	maths.divide( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});  
}

function multiple (request, reply) { 
	maths.multiple( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	}); 
}

/*function batch (request, reply) {
	var x = request
	reply(request.payload).type('application/json; charset=utf-8');
}*/


// create options object from request
function buildOptions( request ){

	if(request.query && request.query.a){
		// querystring
		return { 
			a: parseFloat(request.query.a),
			b: parseFloat(request.query.b)
		};
	}else if(request.params && request.params.a){
		// url params or fragment
		return { 
			a: parseFloat(request.params.a),
			b: parseFloat(request.params.b)
		};
	}else{
		return { 
			a: 0,
			b: 0
		};
	}
}

// render json out to http stream
function renderJSON( request, reply, error, result ){
	if(error){
		reply(new hapi.error(500, error));
	}else{
		reply(result).type('application/json; charset=utf-8');
	}
}



/* ----------------------------------------------------------------------------------- */

function storeList (request, reply) { 
	var options = {
		query: {}
	};
	// add defaults as these querystring are optional
	options.page = (request.query.page)? parseInt( request.query.page, 10 ) : 1;
	options.pageSize = (request.query.pagesize)? parseInt( request.query.pagesize, 10 ) : 20;

	store.list( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

function storeItem (request, reply) { 
	var options = {
			id: request.params.id
		};
	store.get( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

function storeAdd (request, reply) { 
	var options = {
			a: parseFloat(request.query.a),
			b: parseFloat(request.query.b),
			operator: request.query.operator,
			equals: parseFloat(request.query.equals),
			created: new Date(),
			modified: new Date()
		};

	store.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

function storeUpdate (request, reply) { 
	var options = {
		id: request.params.id,
		a: parseFloat(request.query.a),
		b: parseFloat(request.query.b),
		operator: request.query.operator,
		equals: parseFloat(request.query.equals),
		modified: new Date()
	};

	// uses append rather than update
	store.append( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}

function storeRemove (request, reply) { 
	var options = {
			id: request.params.id
		};
	store.remove( options, function( error, result ){
		renderJSON( request, reply, error, result );
	}); 
}



/* ----------------------------------------------------------------------------------- */



exports.index = index;
exports.add = add;
exports.subtract = subtract;
exports.divide = divide;
exports.multiple = multiple;
/*exports.batch = batch;*/

exports.storeList = storeList;
exports.storeItem = storeItem;
exports.storeAdd = storeAdd;
exports.storeUpdate = storeUpdate;
exports.storeRemove = storeRemove;





