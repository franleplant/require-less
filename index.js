"use strict";

var through = require("through");
var fs = require('fs');
var path = require("path");
var compile_less = require('./src/compile_less');












module.exports = function (opts) {

    var less_str = '';

    //Opts is the same as less opts plus some custom options
    opts = opts || {};
    opts.paths = [__dirname];


    return function (fileName) {

        if (!/\.css$|\.less$/.test(fileName)) {
            return through();
        }

        var buffer = "";

        opts.paths.push( path.dirname(fileName) );

 		function write (chunk) {
                buffer += chunk.toString();
        }

        function end () {
            less_str += buffer;

            compile_less(less_str, opts)

            this.queue(null);
        }
        return through(write, end);
    }   
};