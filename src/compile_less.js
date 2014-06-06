"use strict";



var less = require('less');
var path = require("path");
var db = require('just-debounce');
var callback = require('callback-stream');
var Readable = require('stream').Readable;


var debounced_compile = db(function compile(less_str, options) {

        var less_stream = new Readable;
        var stream;


        //Defaults
        options = options || {};
        options.syncImport = true;

        //No op
        if (!options.cb) {
            options.cb = function () {};
        }



        less.render(less_str, options, function (err, css) {
            if (err) {

                // convert the keys so PluginError can read them
                err.lineNumber = err.line;
                err.fileName = err.filename;

                // add a better error message
                err.message = 'Less compile:' + err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;

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





module.exports = debounced_compile;