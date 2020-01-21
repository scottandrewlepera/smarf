import { checkType } from './src/checkType';
import { Post, Blog, Link, Template } from './src/types';
import { getPostData, slugify } from './src';

const blog = require('../blog-config.json');
const fs = require('fs');

import { rssTemplate } from './templates/rss';

import {
    htmlIndexTemplate,
    htmlPostTemplate,
    htmlArchiveIndexTemplate
} from './templates/html';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

let allTags: string[];

const files = getSourceFileList().reverse();

const indexPosts = (files.length > blog.index_posts) ?
    files.slice(0, blog.index_posts) : files;

console.log('Building indexes...');

const feedContent = buildIndexes(indexPosts, blog, rssTemplate);
createIndexFile('feed.xml', feedContent);
console.log('Created RSS feed XML file.');

const htmlIndexContent = buildIndexes(indexPosts, blog, htmlIndexTemplate);
createIndexFile('index.html', htmlIndexContent);
console.log('Created HTML index file.');

console.log('Building individual posts...');
renderPostFiles(files, blog, htmlPostTemplate);

const htmlIndexArchiveContent = buildIndexes(files, blog, htmlArchiveIndexTemplate);
createIndexFile(`${blog.root}/index.html`, htmlIndexArchiveContent);
console.log('Created archive HTML index file.');

console.log(`Creating tag archives for ${allTags.length} tags...`);
allTags.forEach(tag => {
    const tagArchiveContent = buildIndexes(files, blog, htmlArchiveIndexTemplate, function(post: Post) { 
        return post.tags.split(' ').includes(tag);
    });
    const safeTag = slugify(tag);
    fs.mkdirSync(`./html/tag/${safeTag}`, { recursive: true });
    createIndexFile(`tag/${safeTag}/index.html`, tagArchiveContent);
    console.log(`- ${safeTag}`);
});

console.log('Finished!');

function getSourceFileList() {
    console.log('Indexing source files...')
    const files: any[] = fs.readdirSync('./posts');
    console.log(`Processing ${files.length} post files.`);
    return files;
}

function buildIndexes(files: any[], blog: Blog, template: Template, predicate: Function = () => { return true; }) {
    const items: Post[] = [];
    files.forEach( filename => {
        const post: Post = getPostData(filename);
        checkType(post, 'Post');
        if (post.status === 'publish' && predicate(post)) {
            items.push(post);
        }
    });
    if (!items.length) {
        console.log('No published posts found! Index file will be empty!');
    }

    const content = template(items, blog);
    return content;
}

function createIndexFile(filename, content) {
    if (!fs.existsSync('./html')){
        fs.mkdirSync('./html');
    }
    fs.writeFileSync(`./html/${filename}`, content, { flag: 'w' });
}

function renderPostFiles(filenames: string[], blog: Blog, template: Template, predicate: Function = () => { return true; }) {

    let cachedPost: Post;
    let postCounter = 0;
    let tags: string[] = [];

    filenames.forEach( (filename, index) => {
        let postData: Post;
        if (cachedPost && cachedPost.filename === filename) {
            postData = cachedPost;
        } else {
            postData = getPostData(filename);
        }

        if (postData.status === "publish" && predicate(postData)) {

            if (filenames[index + 1]) {
                const prevPostData = getPostData(filenames[index + 1]);
                const prevLink: Link = {
                    url: prevPostData.guid,
                    title: prevPostData.title,
                    text: prevPostData.title
                }
                postData.previous_link = prevLink;

                const nextLink: Link = {
                    url: postData.guid,
                    title: postData.title,
                    text: postData.title
                }
                prevPostData.next_link = nextLink;

                cachedPost = prevPostData;
            }
        }

        const content = template(postData, blog);

        const filePath = `./html${postData.guid}`;
        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath, { recursive : true });
        }
        fs.writeFileSync(`${filePath}index.html`, content, { flag: 'w' });

        tags = tags.concat(postData.tags.split(' '));
        postCounter++;

    });

    allTags = Array.from(new Set(tags)).sort();

    console.log(`Built ${postCounter} individual posts.`);
}
