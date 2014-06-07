"use strict";

var through = require("through");
var fs = require('fs');
var path = require("path");
var compile_less = require('./src/compile_less');



module.exports = function (opts) {

    var less_str = '';

    // Opts is the same as less opts plus some custom options not related with less
    opts = opts || {};
    opts.paths = [__dirname];


    return function (fileName) {

        // Process only css or less files
        if (!/\.css$|\.less$/.test(fileName)) {
            return through();
        }

        var buffer = "";


        //Save file path so that the Less parser can resolve
        // imports
        opts.paths.push( path.dirname(fileName) );

        //Write function: 
        // buffer the entire file
 		function write (chunk) {
                buffer += chunk.toString();
        }

        //End function:
        // Save and concatenate the less/css buffer into less_str
        // Compile less_str with its options 
        // (compile less is dobounced)
        function end () {
            less_str += buffer;
            compile_less(less_str, opts)
            this.queue(null);
        }


        return through(write, end);
    }   
};