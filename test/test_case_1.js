var test = require('tape');
var b = require('browserify');
var fs = require('fs');

var entry_file = './test/fixtures/index.js';
var bundle_js = './test/bundle.js';
var bundle_css = './test/bundle.css';

// Partially apply clean helper to suit the test needs
var clean = require('./clean_helper').bind(null, bundle_js, bundle_css);

test('It should create bundle.js and bundle.css', function (t) {
    t.plan(3);
	clean();


	function browserify_test(bundle) {
		t.ok(  fs.existsSync(bundle_js) , 'bundle.js should exist');
	}

	function require_less_test() {
		t.ok(  fs.existsSync(bundle_css), 'bundle.css should exist');

		var style_compiled = fs.readFileSync('./test/bundle.css', 'utf8');
		t.notEqual( style_compiled.search( 'border: 2px solid black;' ), -1, 'bundle.css should contain the compiled content' );
		
		clean();
	}


	var browserify_opts = {
			entries: entry_file
		};

    var require_less = require('../index.js')({
    		pipe: [fs.createWriteStream(bundle_css)],
    		cb: require_less_test
    	});

	b(browserify_opts)
		.transform(require_less)
		.bundle(browserify_test)
		.pipe(fs.createWriteStream(bundle_js));
});




