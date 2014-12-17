
'use strict';
var Joi 		= require('joi');


var bookmark = Joi.object({
	id: Joi.string().required(),
	a: Joi.number().required(),
	b: Joi.number().required(),
	operator: Joi.string().required().description('either +, -, /, or *'),
	equals: Joi.number().required(),
	created: Joi.string().required().isoDate().description('ISO date string'),
	modified: Joi.string().isoDate().description('ISO date string'),
}).options({
  className: 'Bookmark'
});

var bookmarkList = Joi.object({
	items: Joi.array().includes(bookmark),
	count: Joi.number().required(),
	pageSize: Joi.number().required(),
	page: Joi.number().required(),
	pageCount: Joi.number().required()
}).options({
  className: 'List'
});



exports.bookmark = bookmark;
exports.bookmarkList = bookmarkList;