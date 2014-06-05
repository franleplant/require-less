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

        var parser = new less.Parser({
            paths: paths,
            syncImport: true
        });

        parser.parse(less_str, function(e, r) { 
            fs.writeFile(options.dest || "./compiled.css", e ? e : r.toCSS(), function(err) {
                options.cb();
            });  
        });    
         
    }, 1000, false);





module.exports = function (opts) {
    options = opts;

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