"use strict";

var through = require("through");
var less_str = '';
var fs = require('fs');
var less = require('less');

var parser = new(less.Parser)({
    paths: [__dirname],
    syncImport: true
});



var db = require('just-debounce')
var debounced_compile = db(function compile(less) {

        parser.parse(less, function(e, r) { 
            fs.writeFile("./log.txt", e ? e : r.toCSS(), function(err) {});  
        });    
         
    }, 1000, false);





module.exports = function (fileName) {

    if (!/\.css$|\.less$/.test(fileName)) {
        return through();
    }

    var buffer = "";

    return through(
        function (chunk) {
            buffer += chunk.toString();
        },
        function () {
            less_str += buffer;
            debounced_compile(less_str)

            this.queue(null);
        }
    );
};