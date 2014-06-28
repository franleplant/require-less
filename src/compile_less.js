"use strict";

var less = require('less');
var path = require("path");
var db = require('just-debounce');
var callback = require('callback-stream');
var Readable = require('stream').Readable;


// Create a debounced less compile function.
// In this way the process will wait untill it gets all the less
// or css files and only then compile it into css

//Right now its debounced for 1 second, this can, and should be improved
var debounced_compile = db(function compile(less_str, options) {

        var less_stream = new Readable;
        var stream;


        //Default options
        options = options || {};
        options.syncImport = true;

        //No op
        if (!options.cb) {
            options.cb = function () {};
        }

        //Prevent the callback function to be called twice
        //TODO: improve this
        var cb_has_been_called = false;


        less.render(less_str, options, function (err, css) {
            if (err) {
                // Error message
                throw 'Less compile:' + err.message + ' line number. ' + err.line;
            } else {
                //Initialize the less_stream readable stream with the entire
                // compiled css
                less_stream.push(css);
                less_stream.push(null);

                // The following code implements the pipe interface
                // It basically execute the pipe array of stream transform
                // in order

                stream = less_stream.pipe(options.pipe[0]);

                for (var i = 1; i < options.pipe.length; i++) {
                    stream = stream.pipe(options.pipe[i]);
                };


                // Finish and end events execute the callback
                // Use it for advaced functionality (we use it for testing)
                // Both events are being captured because sometimes
                // it fires end and sometimes it fires finish
                // I should go deeper into understanding why.
                stream.on('finish', function () { 
                    if ( !cb_has_been_called ){
                        options.cb();
                        //Make sure that this cb is called only once
                        cb_has_been_called = true;                       
                    }
                });

                stream.on('end', function () { 
                    if ( !cb_has_been_called ){
                        options.cb();
                        cb_has_been_called = true;                       
                    }
                });

            }
        });
         
    }, 1000, false);


module.exports = debounced_compile;