"use strict";

var through = require("through");
var fs = require('fs');
var less = require('less');
var path = require("path");

var less_str = '';
var paths = [__dirname]

var options;



var db = require('just-debounce')
var debounced_compile = db(function compile(less_str) {


        //Defaults
        options.less_opts = options.less_opts || {};
        options.less_opts.paths = paths;
        options.less_opts.syncImport = true;


        less.render(less_str, options.less_opts, function (err, css) {
          if (err) {

            // convert the keys so PluginError can read them
            err.lineNumber = err.line;
            err.fileName = err.filename;

            // add a better error message
            err.message = err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;

            throw err.message;
          } else {
            fs.writeFile(options.dest || "./compiled.css", css, function(err) {
                if (err) {
                    throw "Cant save compiled css file";
                }
                options.cb();
            }); 
          }
        });
         
    }, 1000, false);





module.exports = function (opts) {
    options = opts || {};

    return function (fileName) {

        if (!/\.css$|\.less$/.test(fileName)) {
            return through();
        }

        var buffer = "";

        paths.push( path.dirname(fileName) );

 		function write (chunk) {
                buffer += chunk.toString();
        }

        function end () {
            less_str += buffer;
            debounced_compile(less_str)

            this.queue(null);
        }
        return through(write, end);
    }   
};