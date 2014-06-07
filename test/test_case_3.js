var test = require('tape');

var b = require('browserify');
var fs = require('fs');
var gulp = require('gulp');
var clean = require('gulp-clean');
var gulp_buffer = require('gulp-buffer');


var bundle_js = './test/bundle.js';
var bundle_css = './test/bundle.css';


var clean_helper = require('./clean_helper');
var clean = clean_helper.bind(null, bundle_js, './test/rev-manifest.json', './test/bundle*.css');




test('It should allow piping the CSS stream', function (t) {
    t.plan(2);



    clean();

	var rev = require('gulp-rev');
	var source = require('vinyl-source-stream');

	function browserify_test_cb(bundle) {
		t.ok(  fs.existsSync(bundle_js) , 'bundle.js should exist');
	}

	function require_less_test_cb() {
		t.ok(  fs.existsSync('./test/rev-manifest.json') , 'manifest.json should be created');
		clean();
	}
	


	var browserify_opts = {
			entries: './test/fixtures/index.js'
		};

    var require_less = require('../index.js')({
    		cb: require_less_test_cb,
    		pipe: [
    			source('bundle.css'), 
    			gulp_buffer(),
    			rev(), 
    			rev.manifest(),
    			gulp.dest('./test')
    		]
    	});

	b(browserify_opts)
		.transform(require_less)
		.bundle(browserify_test_cb)
		.pipe(fs.createWriteStream(bundle_js));
});






