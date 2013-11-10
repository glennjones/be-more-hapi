'use strict';
var hapi        = require('hapi'),
	handlers    = require('../lib/handlers.js'),
	routes;


// adds the routes and validation for api
routes = [{
		method: 'GET',
		path: '/',
		config: {
			handler: handlers.index
		}
	}, {
		method: 'GET',
		path: '/sum/add/{a}/{b}',
		config: {
			handler: handlers.add,
			description: 'Add',
			notes: 'Adds together two numbers and return the result',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			}
		}
	},{
		method: 'GET',
		path: '/sum/subtract/{a}/{b}',
		config: {
			handler: handlers.subtract,
			description: 'Subtract',
			notes: 'Subtracts the second number from the first and return the result',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			}
		}
	},{
		method: 'GET',
		path: '/sum/divide/{a}/{b}',
		config: {
			handler: handlers.divide,
			description: 'Divide',
			notes: 'Divides the first number by the second and return the result',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number - can NOT be 0'),

					b: hapi.types.Number()
						.required()
						.description('the second number - can NOT be 0')
				}
			}
		}
	},{
		method: 'GET',
		path: '/sum/multiple/{a}/{b}',
		config: {
			handler: handlers.multiple,
			description: 'Multiple',
			notes: 'Multiples the two numbers together and return the result',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number')
				}
			}
		}
	},{
		method: 'GET',
		path: '/store/',
		config: {
			handler: handlers.storeList,
			description: 'List sums',
			notes: 'List the sums in the cloud store',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					page: hapi.types.Number()
						.description('the page number'),

					pagesize: hapi.types.Number()
						.description('the number of items to a page')
				}
			}
		}
	},  {
		method: 'GET',
		path: '/store/{id}',
		config: {
			handler: handlers.storeItem,
			description: 'Get sum',
			notes: 'Get a sum from the store',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}
			}
		}
	},  {
		method: 'POST',
		path: '/store/',
		config: {
			handler: handlers.storeAdd,
			description: 'Add sum',
			notes: 'Adds a sum to the cloud store',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				query: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number'),

					operator: hapi.types.String()
						.required()
						.description('the opertator i.e. + - / or *'),

					equals: hapi.types.Number()
						.required()
						.description('the result of the sum')
				}
			}
		}
	},  {
		method: 'PUT',
		path: '/store/{id}',
		config: {
			handler: handlers.storeUpdate,
			description: 'Update sum',
			notes: 'Update a sum in our cloud store',
			tags: ['api'],
			jsonp: 'callback',
			validate: {
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}, 
				query: {
					a: hapi.types.Number()
						.required()
						.description('the first number'),

					b: hapi.types.Number()
						.required()
						.description('the second number'),

					operator: hapi.types.String()
						.required()
						.description('the opertator i.e. + - / or *'),

					equals: hapi.types.Number()
						.required()
						.description('the result of the sum')
				}
			}
		}
	}, {
		method: 'DELETE',
		path: '/store/{id}',
		config: {
			handler: handlers.storeRemove,
			description: 'Delete sums',
			notes: 'Deletea a sums from the cloud store',
			tags: ['api'],
			jsonp: 'callback',
			validate: { 
				path: {
					id: hapi.types.String()
						.required()
						.description('the id of the sum in the store')
				}
			}
		}
	}, {
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
			jsonp: 'callback',
			validate: { 
				query: {
					requests: hapi.types.Array()
				}
			}
		}
	}, */


exports.routes = routes;