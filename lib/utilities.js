
'use strict';
var marked          = require('marked'),
	hapi            = require('hapi'),
	fs              = require('fs');


module.exports = {

		// read a file and converts the markdown to HTML
		getMarkDownHTML: function( path, callback ){
				fs.readFile(path, 'utf8', function (err,data) {
					if (!err) {
						marked.setOptions({
							gfm: true,
							tables: true,
							breaks: false,
							pedantic: false,
							sanitize: true,
							smartLists: true,
							smartypants: false,
							langPrefix: 'language-',
							highlight: function(code, lang) {
								return code;
							}
						});
						data = marked(data);           
					}
					callback( err, data );
				});
		},


		generateID: function() {
			return ('0000' + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
		},


		buildError: function( code, error ){
			var error = hapi.error.badRequest( error );
    		error.output.statusCode = code
    		error.reformat();
    		return error;
		},


		isString: function (obj) {
		    return typeof (obj) == 'string';
		},


		trim: function (str) {
    		return str.replace(/^\s+|\s+$/g, "");
		},


		isArray: function (obj) {
		    return obj && !(obj.propertyIsEnumerable('length')) 
		        && typeof obj === 'object' 
		        && typeof obj.length === 'number';
		}

};