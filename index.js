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




        var callback = require('callback-stream');
        var Readable = require('stream').Readable;
        var less_stream = new Readable;
        var stream;


        //Defaults
        options.less_opts = options.less_opts || {};
        options.less_opts.paths = paths;
        options.less_opts.syncImport = true;

        //No op
        if (!options.cb) {
            options.cb = function () {};
        }



        less.render(less_str, options.less_opts, function (err, css) {
            if (err) {

                // convert the keys so PluginError can read them
                err.lineNumber = err.line;
                err.fileName = err.filename;

                // add a better error message
                err.message = err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;

                throw err.message;
            } else {

                less_stream.push(css);
                less_stream.push(null);

                stream = less_stream.pipe(options.pipe[0]);

                for (var i = 1; i < options.pipe.length; i++) {
                    stream = stream.pipe(options.pipe[i]);
                };


                stream.on('finish', function () { 
                    options.cb(); 
                });

                stream.on('end', function () { 
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