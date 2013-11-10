
'use strict';
//	data access layer 

var utils           = require('../lib/utilities.js');


function Store (mongoose, connection, options) {
	this.options = options;
	this.Schema = mongoose.Schema;
	this.ObjectId = this.Schema.ObjectId;

	this.StoreSchema = new this.Schema({
		'dbid': this.ObjectId,
		'id': String, 
		'a': Number,
		'b': Number,
		'operator' : String,
		'equals': Number,
		'created' : { type: Date, index: true },
		'modified' : { type: Date, index: true }
	});

	this.model = connection.model('store', this.StoreSchema);
}



Store.prototype = {

	// adds a new item
	add: function (item, callback){
		item.id = utils.generateID();
		item.created = new Date();
		item.modified = new Date();

		new this.model(item).save( function(err, item){
			console.log(err);
			if(callback){
				callback(err, item);
			}
		});
	},


	// update a given item
	update: function (item){
		if(item){
			item.save(function(err){
				console.log(err);
			});
		}
	},


	// append a new item or save an existing one
	append: function ( item, callback ){
		var context = this;
		this.get( {id: item.id}, function( err, doc ){
			if(doc){
				
				// update
				doc.a = item.a;
				doc.b = item.b;
				doc.operator = item.operator;
				doc.equals = item.equals;
				doc.created = item.created;
				doc.modified = new Date();

				doc.save(function(err, doc){
					callback(err, doc);
				});
			}else{

				// add
				context.add(item, callback);
			}
		});
	},


	// get a single item
	get: function(options, callback){
		var context = this;
		if(options.id){
			this.model.findOne( {'id': options.id}, function(err,doc){
				callback(err, doc);
			});
		}else{
			callback('No id passed to find item', null);
		}
	},


	// paging query - keep number of object requested low or use mongoosejs stream
	list: function(options, callback){
		var skipFrom = (options.page * options.pageSize) - options.pageSize;
		var model = this.model;
		var context = this;

		if(!options.sort){
			options.sort = {modified:1};
		}

		if(!options.query){
			options.query = {};
		}

		model.find(options.query)
			.skip(skipFrom)
			.limit(options.pageSize)
			.sort(options.sort)
			.exec(function(err, data) {
				if (err) {
					callback({'error': err});
				}else{
					model.count(options.query, function(err, count){
					if (err) {
						callback(err, null);
					}else{
						callback(null, {
							'items': data,
							'count': count,
							'pageSize': options.pageSize,
							'page': options.page,
							'pageCount': Math.ceil(count / options.pageSize)
						});
					}
				});
			}
		});
	},


	// remove documents from db collection using a query
	remove: function(options, callback){
		if(options.id){
			this.model.remove({'id': options.id}, function (err) {
				callback(err, null);
			});
		}else{
			callback('No id passed to find item', null);
		}
	},


	// remove all documents from db collection
	removeAll: function(){
		this.model.remove({}, function (err) {
			console.log(err);
		});
	}

};


exports.Store = Store;




