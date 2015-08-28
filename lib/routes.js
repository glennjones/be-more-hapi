'use strict';
var hapi        = require('hapi'),
	Joi 		= require('joi'),
	handlers    = require('../lib/handlers.js'),
	routes,
	resultModel,
	sumModel,
	listModel,
	standardHTTPErrors,
	extendedHTTPErrors,
	fileHTTPErrors;



resultModel = Joi.object({
	equals: Joi.number(),
}).meta({
  className: 'Result'
});

sumModel = Joi.object({
	id: Joi.string().required(),
	a: Joi.number().required(),
	b: Joi.number().required(),
	operator: Joi.string().required().description('either +, -, /, or *'),
	equals: Joi.number().required(),
	created: Joi.string().required().isoDate().description('ISO date string'),
	modified: Joi.string().isoDate().description('ISO date string'),
}).meta({
  className: 'Sum'
});

listModel = Joi.object({
	items: Joi.array().items(sumModel),
	count: Joi.number().required(),
	pageSize: Joi.number().required(),
	page: Joi.number().required(),
	pageCount: Joi.number().required()
}).meta({
  className: 'List'
});


standardHTTPErrors = [
	{ code: 400, message: 'Bad Request' },
	{ code: 500, message: 'Internal Server Error'}
];

extendedHTTPErrors = [
	{ code: 400, message: 'Bad Request' },
	{ code: 404, message: 'Sum not found' },
	{ code: 500, message: 'Internal Server Error'}
];

fileHTTPErrors = [
	{ code: 400, message: 'Bad Request' },
	{ code: 415, message: 'Unsupported Media Type' },
	{ code: 500, message: 'Internal Server Error'}
];




// adds the routes and validation for api
routes = [{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	}, {
		method: 'GET',
		path: '/reduced',
		config: {
			handler: handlers.reduced
		}
	},{
		method: 'GET',
		path: '/license',
		config: {
			handler: handlers.license
		}
	},  {
		method: 'GET',
		path: '/images/{file*}',
		handler:{
		    directory:{
				path:'./node_modules/hapi-swagger/public/swaggerui/images'
		    }
		}
	},{
		method: 'PUT',
		path: '/sum/add/{a}/{b}',
		config: {
			handler: handlers.add,
			description: 'Add',
			tags: ['api','reduced'],
			notes: ['Adds together two numbers and return the result. As an option you can have the result return as a binary number.'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			validate: { 
				params: {
					a: Joi.number()
						.required()
						.description('the first number')
						.example(8),

					b: Joi.number()
						.required()
						.description('the second number')
						.example(4)
				},
				headers: Joi.object({
							'x-format': Joi.string()
								.valid('decimal', 'binary')
								.default('decimal')
								.description('return result as decimal or binary')
						}).unknown()
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/subtract/{a}/{b}',
		config: {
			handler: handlers.subtract,
			description: 'Subtract',
			notes: ['Subtracts the second number from the first and return the result'],
			tags: ['api'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			validate: { 
				params: {
					a: Joi.number()
						.required()
						.description('the first number'),

					b: Joi.number()
						.required()
						.description('the second number')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/divide/{a}/{b}',
		config: {
			handler: handlers.divide,
			description: 'Divide',
			notes: ['Divides the first number by the second and return the result'],
			tags: ['api'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			validate: { 
				params: {
					a: Joi.number()
						.required()
						.description('the first number - can NOT be 0'),

					b: Joi.number()
						.required()
						.description('the second number - can NOT be 0')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'PUT',
		path: '/sum/multiple/{a}/{b}',
		config: {
			handler: handlers.multiple,
			description: 'Multiple',
			notes: ['Multiples the two numbers together and return the result'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			tags: ['api'],
			validate: { 
				params: {
					a: Joi.number()
						.required()
						.description('the first number'),

					b: Joi.number()
						.required()
						.description('the second number')
				}
			},
			response: {schema : resultModel}
		}
	},{
		method: 'GET',
		path: '/store/',
		config: {
			handler: handlers.storeList,
			description: 'List sums',
			notes: ['List the sums in the data store'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			tags: ['api','reduced','one'],
			validate: { 
				query: {
					page: Joi.number()
						.description('the page number'),

					pagesize: Joi.number()
						.description('the number of items to a page')
				}
			},
			response: {schema : listModel}
		}
	},  {
		method: 'GET',
		path: '/store/{id}',
		config: {
			handler: handlers.storeItem,
			description: 'Get sum',
			notes: ['Get a sum from the store'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
			tags: ['api','reduced','two'],
			validate: { 
				params: {
					id: Joi.string()
						.required()
						.description('the id of the sum in the store')
				}
			},
			response: {schema : sumModel}
		}
	},  {
		method: 'POST',
		path: '/store/',
		config: {
			handler: handlers.storeAdd,
			description: 'Add sum',
			notes: ['Adds a sum to the data store'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors,
					payloadType: 'form',
					nickname: 'storeit'
				}
			},
			tags: ['api','reduced','three'],
			validate: { 
				payload: {
					a: Joi.number()
						.required()
						.description('the first number'),

					b: Joi.number()
						.required()
						.description('the second number'),

					operator: Joi.string()
						.required()
						.default('+')
						.description('the opertator i.e. + - / or *'),

					equals: Joi.number()
						.required()
						.description('the result of the sum')
				}
			},
			response: {schema : sumModel}
		}
	},  {
		method: 'PUT',
		path: '/store/{id}',
		config: {
			handler: handlers.storeUpdate,
			description: 'Update sum',
			notes: ['Update a sum in our data store'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api'],
			validate: {
				params: {
					id: Joi.string()
						.required()
						.description('the id of the sum in the store')
				}, 
				payload: {
					a: Joi.number()
						.required()
						.description('the first number'),

					b: Joi.number()
						.required()
						.description('the second number'),

					operator: Joi.string()
						.required()
						.default('+')
						.description('the opertator i.e. + - / or *'),

					equals: Joi.number()
						.required()
						.description('the result of the sum')
				}
			},
			response: {schema : sumModel}
		}
	}, {
		method: 'DELETE',
		path: '/store/{id}',
		config: {
			handler: handlers.storeRemove,
			description: 'Delete sums',
			notes: ['Delete a sums from the data store'],
			plugins: {
				'hapi-swagger': {
					responseMessages: extendedHTTPErrors
				}
			},
			tags: ['api'],
			validate: { 
				params: {
					id: Joi.string()
						.required()
						.description('the id of the sum in the store')
				}
			}
		}
	}, {
		method: 'POST',
		path: '/store/payload/',
		config: {
			handler: handlers.storeAdd,
			description: 'Add sum, with JSON object',
			notes: ['Adds a sum to the data store, using JSON object in payload'],
			plugins: {
				'hapi-swagger': {
					responseMessages: standardHTTPErrors
				}
			},
			tags: ['api','reduced','three'],
			validate: { 
				payload: {
					a: Joi.number()
						.required()
						.description('the first number'),

					b: Joi.number()
						.required()
						.description('the second number'),

					operator: Joi.string()
						.required()
						.default('+')
						.description('the opertator i.e. + - / or *'),

					equals: Joi.number()
						.required()
						.description('the result of the sum')
				}
			},
			response: {schema : sumModel}
		}
	}, {
	    method: 'POST',
	    path: '/store/file/',
	    config: {
	        handler: handlers.storeAddFile,
			description: 'Add sum, with JSON file',
			notes: ['Adds a sum to the data store, using JSON object in a uploaded file'],
			plugins: {
				'hapi-swagger': {
					responseMessages: fileHTTPErrors,
					payloadType: 'form'
				}
			},
			tags: ['api','reduced','three'],
	        validate: {
	            payload: { 
	            	file: Joi.any()
	            		.meta({ swaggerType: 'file' })
	            		.required()
	            		.description('json file with object containing: a, b, operator and equals')
	            }
	        },
	        payload: {
	            maxBytes: 1048576,
	            parse: true,
	            output: 'stream'
	        },
	    	response: {schema : sumModel}
	    }
	},{
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: './public',
				listing: false,
				index: true
			}
		}
	}];



/*    {
		method: 'POST',
		path: '/sum/batch',
		config: {
			handler: handlers.batch,
			description: 'Batch',
			notes: 'Run a batch of sum requests',
			tags: ['api'],
			validate: { 
				query: {
					requests: Joi.Array()
				}
			}
		}
	}, */


exports.routes = routes;