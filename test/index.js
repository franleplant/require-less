var glob = require("glob");

var path = './test/test_case_*.js';

// Simple harness to require all the test cases
glob(path, function (err, file_names) {
	if (err) {
		throw err;
	}

	file_names.forEach(function (file_name) {
		require(file_name);
	});	
});