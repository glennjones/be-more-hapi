'use strict';
const Boom  = require('boom');
const Joi = require('joi');
const Mongoose = require('mongoose');
const Maths = require('../lib/maths.js');
const Store = require('../lib/store.js').Store;
const Utils = require('../lib/utilities.js');
const Pack = require('../package');



// moungodb connection for store
const mongodbURL = (process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/be-more-hapi');
let connection = Mongoose.createConnection(mongodbURL);
let store = new Store(Mongoose, connection);

Mongoose.connection.on('error', function (err) {
  console.log(['error'], 'moungodb connect error: ' + err);
});


/* ----------------------------------------------------------------------------------- */


function index(request, reply) {
	Utils.getMarkDownHTML(__dirname.replace('/lib','') + '/README.md', function(err, data){
		reply.view('swagger.html', {
			title: Pack.name + ' &#151; Calculator',
			markdown: data
		});
	});
}

function reduced(request, reply) {
	Utils.getMarkDownHTML(__dirname.replace('/lib','') + '/README.md', function(err, data){
		reply.view('reduced.html', {
			title: Pack.name + ' &#151; Calculator',
			markdown: data
		});
	});
}

function license(request, reply) {
	reply.view('license.html', {});
}


function hostinfo(request, reply) {

    var connection = request.connection;
    var data = {
       'request.headers.host': request.headers.host,
       'x-forwarded-host': request.headers['x-forwarded-host'],
       'disguised-host': request.headers['disguised-host']
    }
    data['connection.info'] = connection.info.host;
    if (connection.info.port) {
        data['connection.info'] += ':' + connection.info.port;
    }
    reply(JSON.stringify(data)).type('application/json; charset=utf-8');
}


/* ----------------------------------------------------------------------------------- */

function add (request, reply) {
	Maths.add( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});
}

function subtract (request, reply) {
	Maths.subtract( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});
}

function divide (request, reply) {
	Maths.divide( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});
}

function multiple (request, reply) {
	Maths.multiple( buildOptions( request ), function( error, result ){
		renderJSON( request, reply, error, {'equals': parseFloat(result)} );
	});
}


// create options object from request
function buildOptions( request ){
	var options = {
		a: 0,
		b: 0,
		format: 'decimal'
	}

	if(request.headers && request.headers['x-format']){
		options.format = request.headers['x-format']
	}
	if(request.query && request.query.a){
		// querystring
		options.a = parseFloat(request.query.a),
		options.b = parseFloat(request.query.b)
	}else if(request.params && request.params.a){
		// url params or fragment
		options.a = parseFloat(request.params.a),
		options.b = parseFloat(request.params.b)
	}
	return options;
}

// render json out to http stream
function renderJSON( request, reply, error, result ){
	if(error){
		if( Utils.isString( error ) ){
			reply( Utils.buildError( 400, error ) );
		}else{
			reply( error );
		}
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
		if( result ){
			result = Utils.clone( result );
		}
		renderJSON( request, reply, error, result );
	});
}

function storeAdd (request, reply) {
	var options = request.payload;

	if(request.query.a){
		options = {
			a: parseFloat(request.query.a),
			b: parseFloat(request.query.b),
			operator: request.query.operator,
			equals: parseFloat(request.query.equals)
		};
	}
	store.add( options, function( error, result ){
		renderJSON( request, reply, error, result );
	});
}





function storeAddFile (request, reply) {
	var payload = request.payload,
		data = '';

	console.log(payload['file'][0])

	// check that required file is present
	// the filepath property incorrectlty uses a string 'undefined'
	if(payload['file'] && payload['file'][0] !== 'undefined'){

		var file = payload['file'][1],
			headers = file.hapi.headers;

		// check the content-type is json
		if( headers['content-type'] === 'application/json'){

			// read the stream
			file.on('data', function(chunk) {
			    data+=chunk;
			});

			// once we have all the data
			file.on('end', function() {

				// use Joi to validate file data format
				var addSumSchema = Joi.object().keys({
				    a: Joi.number().required(),
				    b: Joi.number().required(),
				    operator: Joi.string().required(),
				    equals: Joi.number().required()
				})

				Joi.validate(data, addSumSchema, function (err, value) {
					if(err){
						reply( Boom.badRequest('JSON file has incorrect format or properties. ' + err) );
					}else{
						store.add( JSON.parse(data), function( error, result ){
							renderJSON( request, reply, error, result );
						});
					}
				});
			});

		}else{
			reply( Boom.unsupportedMediaType() );
		}

	}else{
		reply( Boom.badRequest('File is required') );
	}
}


function storeUpdate (request, reply) {
	var options = {
		id: request.params.id,
		a: parseFloat(request.query.a),
		b: parseFloat(request.query.b),
		operator: request.query.operator,
		equals: parseFloat(request.query.equals),
	};

	store.update( options, function( error, result ){
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
exports.reduced = reduced;
exports.license = license;

exports.add = add;
exports.subtract = subtract;
exports.divide = divide;
exports.multiple = multiple;

exports.storeList = storeList;
exports.storeItem = storeItem;
exports.storeAdd = storeAdd;
exports.storeUpdate = storeUpdate;
exports.storeRemove = storeRemove;
exports.storeAddFile = storeAddFile;

exports.hostinfo = hostinfo;





