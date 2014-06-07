var fs = require('fs');
var glob = require("glob");

function clean_up () {
	//Turn arguments into and array
	var args = Array.prototype.slice.call(arguments);

	try {

		args.forEach(function (path) {
			glob(path, function (err, file_names) {
				if (err) {
					console.log('Clean Helper Glob: ', err);
					return;
				}
				file_names.forEach(function (path) {
					fs.unlinkSync(path);
				})
					
			});
		});
	} catch (e) {
		console.log(e);
	}
}


module.exports = clean_up;