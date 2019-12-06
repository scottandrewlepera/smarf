import { checkType } from './src/checkType';
const CONFIG_PATH = './blog_config.json';
const blog = require(CONFIG_PATH);
const minimist = require('minimist');
const format = require('date-format');

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

let argv = minimist(process.argv.slice(2), {
    string: [
        'title'
    ],
});

const formattedTitle = argv.title.replace(/\s/gi, '_')
                                 .replace(/[^a-z0-9_]/gi, '')
                                 .toLowerCase();

const postDate = new Date();

const filenameDate = format.asString('yyyy-MM-dd_hh:mm:ss', postDate);

const filename = `${filenameDate}_${formattedTitle}.md`;

console.log(filename);
