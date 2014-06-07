var test = require('tape');
var b = require('browserify');
var fs = require('fs');

var entry_file = './test/fixtures/index.js';
var bundle_js = './test/bundle.js';
var bundle_css = './test/bundle.css';

// Partially apply clean helper to suit the test needs
var clean = require('./clean_helper').bind(null, bundle_js, bundle_css);


test('It should allow passing options to Less parser', function (t) {
    t.plan(4);
	clean();


	function browserify_test(bundle) {
		t.ok(  fs.existsSync(bundle_js) , 'bundle.js should exist');
	}

	function require_less_test() {
		t.ok(  fs.existsSync(bundle_css), 'bundle.css should exist');

		var style_compiled = fs.readFileSync('./test/bundle.css', 'utf8');
		t.notEqual( style_compiled.search( 'border:2px solid #000' ), -1, 'bundle.css should contain style2.less' );
		t.notEqual( style_compiled.search( 'font-family:sans-serif;' ), -1, 'bundle.css should contain bootstrap source' );
		clean();
	}
	

	var browserify_opts = {
			entries: entry_file
		};

    var require_less = require('../index.js')({
    		cb: require_less_test,
    		pipe: [fs.createWriteStream(bundle_css)],
    		compress:  true
    	});

	b(browserify_opts)
		.transform(require_less)
		.bundle(browserify_test)
		.pipe(fs.createWriteStream(bundle_js));
});