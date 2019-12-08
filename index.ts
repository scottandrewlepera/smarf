import { checkType } from './src/checkType';
import { Post, Blog } from './types/index';
import * as utils from './src/utils';
const CONFIG_PATH = '../blog_config.json';
const blog = require(CONFIG_PATH);
const fs = require('fs');
var markdown = require( "markdown" ).markdown;

import { rssItemTemplate, rssFeedTemplate} from './templates/rss.js';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

console.log('Indexing source files...')
const sourceFiles: any[] = fs.readdirSync('./posts');
console.log(`Processing ${sourceFiles.length} post files.`);

console.log('Building indexes...');
buildIndexes(sourceFiles, blog);
// console.log('Building archives...');
// buildArchives(sourcefiles, blog);
console.log('Finished!');

function buildIndexes(posts: any[], blog: Blog) {
    const rssItems: string[] = [];
    const indexItems: string[] = [];
    const lastNPosts = sourceFiles.slice(sourceFiles.length - blog.index_posts);
    Array.from(lastNPosts).forEach( filename => {
        const fileContents: any = utils.getPostData(filename);
        const post: Post = JSON.parse(JSON.stringify(fileContents.data));
        checkType(post, 'Post');
        post.content = markdown.toHTML(JSON.parse(JSON.stringify(fileContents.content)));
        rssItems.push(rssItemTemplate(post, blog));
    });
    const feedContent = rssFeedTemplate(blog, rssItems);
    createIndexFile('feed.xml', feedContent);
    console.log('Created RSS feed XML file.');
}

function createIndexFile(filename, content) {
    if (!fs.existsSync('./html')){
        fs.mkdirSync('./html');
    }
    fs.writeFileSync(`./html/${filename}`, content, { flag: 'w' });
}