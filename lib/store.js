
'use strict';
//	data access layer
const Utils = require('../lib/utilities.js');


function Store(mongoose, connection, options) {
    this.options = options;
    this.Schema = mongoose.Schema;
    this.ObjectId = this.Schema.ObjectId;

    this.StoreSchema = new this.Schema({
        'dbid': this.ObjectId,
        'id': String,
        'a': Number,
        'b': Number,
        'operator': String,
        'equals': Number,
        'created': { type: Date, index: true },
        'modified': { type: Date, index: true }
    });

    this.model = connection.model('store', this.StoreSchema);
}



Store.prototype = {

    // adds a new item
    add: function(item, callback) {
        item.id = Utils.generateID();
        item.created = new Date();

        new this.model(item).save(function(err, item) {
            console.log(err);
            if (callback) {
                if (item) {
                    // quick way to simplify object
                    item = Utils.clone(item);
                    delete item._id;
                    delete item.__v;
                }
                callback(err, item);
            }
        });
    },


    // append a new item or save an existing one
    update: function(item, callback) {
        const self = this;
        this.get({ id: item.id, dataType: 'internal' }, function(err, doc) {
            if (doc) {

                // update
                doc.a = item.a;
                doc.b = item.b;
                doc.operator = item.operator;
                doc.equals = item.equals;
                doc.modified = new Date();

                doc.save(function(err, item) {
                    if (item) {
                        // quick way to simplify object
                        item = Utils.clone(item);
                        delete item._id;
                        delete item.__v;
                    }
                    callback(err, item);
                });
            } else {
                callback(Utils.buildError('404', 'Sum not found'), null);
            }
        });
    },


    // get a single item
    get: function(options, callback) {
        const self = this;
        if (options.id) {
            this.model.findOne({ 'id': options.id }, function(err, doc) {
                if (doc) {
                    // dataType is internal or json the default is json
                    if (!options.dataType || options.dataType === 'json') {
                        // quick way to simplify object
                        doc = Utils.clone(doc);
                        delete doc._id;
                        delete doc.__v;
                    }
                    callback(null, doc);
                } else {
                    callback(Utils.buildError('404', 'Sum not found'), null);
                }
            });
        } else {
            callback(Utils.buildError('400', 'No sum id passed to find item'), null);
        }
    },


    // paging query - keep number of object requested low or use mongoosejs stream
    list: function(options, callback) {
        let skipFrom = (options.page * options.pageSize) - options.pageSize,
            model = this.model,
            self = this;

        if (!options.sort) {
            options.sort = { modified: 1 };
        }

        if (!options.query) {
            options.query = {};
        }

        model.find(options.query)
            .skip(skipFrom)
            .limit(options.pageSize)
            .sort(options.sort)
            .exec(function(err, data) {
                if (err) {
                    callback({ 'error': err });
                } else {
                    model.count(options.query, function(err, count) {
                        if (err) {
                            callback(err, null);
                        } else {
                            let i = data.length;
                            while (i--) {
                                delete data[i]._doc._id;
                                delete data[i]._doc.__v;
                            }
                            // quick way to simplify object
                            data = Utils.clone(data);

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
    remove: function(options, callback) {
        const self = this;
        if (options.id) {
            this.get(options, function(err, data) {
                if (data) {
                    self.model.remove({ 'id': options.id }, function(err) {
                        callback(err, null);
                    });
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(Utils.buildError('400', 'No sum id passed to find item'), null);
        }
    },


    // remove all documents from db collection
    removeAll: function() {
        this.model.remove({}, function(err) {
            console.log(err);
        });
    }

};


exports.Store = Store;




