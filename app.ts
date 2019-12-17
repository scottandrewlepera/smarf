import { checkType } from './src/checkType';
import { Post, Blog, Link, Template } from './src/types';
import { getPostData } from './src';

const blog = require('../blog-config.json');
const fs = require('fs');

import { rssTemplate } from './templates/rss';
import { htmlIndexTemplate, htmlPostTemplate, htmlArchiveIndexTemplate } from './templates/html';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

console.log('Indexing source files...')
const sourceFiles: any[] = fs.readdirSync('./posts');
console.log(`Processing ${sourceFiles.length} post files.`);

const lastNPosts = (sourceFiles.length > blog.index_posts) ?
                        sourceFiles.reverse().slice(0, blog.index_posts) :
                        sourceFiles.reverse();

console.log('Building indexes...');

const feedContent = buildIndexes(lastNPosts, blog, rssTemplate);
createIndexFile('feed.xml', feedContent);
console.log('Created RSS feed XML file.');

const htmlIndexContent = buildIndexes(lastNPosts, blog, htmlIndexTemplate);
createIndexFile('index.html', htmlIndexContent);
console.log('Created HTML index file.');

console.log('Building individual posts...');
renderPostFiles(sourceFiles.reverse(), blog, htmlPostTemplate);

const htmlIndexArchiveContent = buildIndexes(sourceFiles.reverse(), blog, htmlArchiveIndexTemplate);
createIndexFile('./archive/index.html', htmlIndexArchiveContent);
console.log('Created archive HTML index file.');
console.log('Finished!');

function buildIndexes(files: any[], blog: Blog, template: Template) {
    const items: Post[] = [];
    files.forEach( filename => {
        const post: Post = getPostData(filename);
        checkType(post, 'Post');
        if (post.status === 'publish') {
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

    filenames.forEach( (filename, index) => {
        let postData: Post;
        if (cachedPost && cachedPost.filename === filename) {
            postData = cachedPost;
        } else {
            postData = getPostData(filename);
        }

        if (postData.status === "publish" && predicate(postData)) {

            if (filenames[index + 1]) {
                const nextPostData = getPostData(filenames[index + 1]);
                const nextLink: Link = {
                    url: nextPostData.guid,
                    title: nextPostData.title,
                    text: nextPostData.title
                }
                postData.next_link = nextLink;

                const prevLink: Link = {
                    url: postData.guid,
                    title: postData.title,
                    text: postData.title
                }
                nextPostData.previous_link = prevLink;

                cachedPost = nextPostData;
            }
        }

        const content = template(postData, blog);

        const filePath = `./html${postData.guid}`;
        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath, { recursive : true });
        }
        fs.writeFileSync(`${filePath}index.html`, content, { flag: 'w' });

        postCounter++;

    });

    console.log(`Built ${postCounter} individual posts.`);
}
