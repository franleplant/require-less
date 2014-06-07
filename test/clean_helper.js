var fs = require('fs');

//Simple file sync remover func
function clean_up () {
	//Turn arguments into and array
	var args = Array.prototype.slice.call(arguments);

	try {
		args.forEach(function (file_name) {
			fs.unlinkSync(file_name);
		});
	} catch (e) {
		console.log(e);
	}
}

module.exports = clean_up;