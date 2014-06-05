var test = require('tape');

var b = require('browserify');
var fs = require('fs');
var gulp = require('gulp');
var clean = require('gulp-clean');


var bundle_js = './test/bundle.js';
var bundle_css = './test/bundle.css';


function clean_up () {
	gulp.src([bundle_js, bundle_css], {read: false})
        .pipe(clean());	
}


test('It should create bundle.js and bundle.css', function (t) {
    t.plan(2);

    var require_less = require('../index.js')({dest: bundle_css})

	var browserify_opts = {
			entries: './test/src/index.js'
		};


	clean_up();

	var bundler = b(browserify_opts)
		.transform(require_less)
		.bundle()
		.pipe(fs.createWriteStream(bundle_js));

	fs.exists(bundle_js, function(exists) {
		t.ok(  exists, 'bundle.js should exist');
	});
	fs.exists(bundle_css, function(exists) {
		t.ok(  exists, 'bundle.css should exist');
	});

});






