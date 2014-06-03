var b = require('browserify');
var fs = require('fs');


var browserify_opts = {
		entries: './test/src/index.js'
	};


var bundler = b(browserify_opts)
	.transform(require('../index')({dest: '../c.css'}))
	.bundle()
	.pipe(fs.createWriteStream('./bundle.js'));