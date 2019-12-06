"use strict";
exports.__esModule = true;
var checkType_1 = require("./src/checkType");
var CONFIG_PATH = './blog_config.json';
var blog = require(CONFIG_PATH);
var minimist = require('minimist');
var format = require('date-format');
checkType_1.checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');
var argv = minimist(process.argv.slice(2), {
    string: [
        'title'
    ]
});
var formattedTitle = argv.title.replace(/\s/gi, '_')
    .replace(/[^a-z0-9_]/gi, '')
    .toLowerCase();
var postDate = new Date();
var filenameDate = format.asString('yyyy-MM-dd_hh:mm:ss', postDate);
var filename = filenameDate + "_" + formattedTitle + ".md";
console.log(filename);
