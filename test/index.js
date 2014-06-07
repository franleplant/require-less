var glob = require('glob');
var path = require('path');

var globs = './test/test_case_*.js';

// Simple harness to require all the test cases
glob(globs, function (err, file_names) {
	if (err) {
		throw err;
	}

	file_names.forEach(function (file_name) {
		require(  './' + path.relative(__dirname, file_name)  );
	});	
});