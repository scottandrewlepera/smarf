import { checkType } from './src/checkType';
import { Post, Blog, Link } from './types/index';
import * as utils from './src/utils';
const CONFIG_PATH = '../blog_config.json';
const blog = require(CONFIG_PATH);
const fs = require('fs');
var markdown = require('markdown-it')({ html: true });

import { rssTemplate } from './templates/rss';
import { htmlIndexTemplate } from './templates/html';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

console.log('Indexing source files...')
const sourceFiles: any[] = fs.readdirSync('./posts');
console.log(`Processing ${sourceFiles.length} post files.`);

const lastNPosts = sourceFiles.reverse().slice(sourceFiles.length - blog.index_posts);

console.log('Building indexes...');

const feedContent = buildIndexes(lastNPosts, blog, rssTemplate);
createIndexFile('feed.xml', feedContent);
console.log('Created RSS feed XML file.');

const htmlIndexContent = buildIndexes(lastNPosts, blog, htmlIndexTemplate);
createIndexFile('index.html', htmlIndexContent);
console.log('Created HTML index file.');

renderPostFiles(sourceFiles.reverse());

console.log('Finished!');

function buildIndexes(files: any[], blog: Blog, template) {
    const items: Post[] = [];
    files.reverse().forEach( filename => {
        const fileContents: any = utils.getPostData(filename);
        const post: Post = JSON.parse(JSON.stringify(fileContents.data));
        checkType(post, 'Post');
        if (post.status === 'publish') {
            post.content = markdown.render(JSON.parse(JSON.stringify(fileContents.content)));
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

function renderPostFiles(filenames: string[], predicate: Function = () => { return true; }) {

    let cachedPost: Post;

    filenames.forEach( (filename, index) => {
        let postData: Post;
        if (cachedPost && cachedPost.filename === filename) {
            postData = cachedPost;
        } else {
            postData = getPost(filename);
        }

        if (postData.status === "publish" && predicate(postData)) {

            if (filenames[index + 1]) {
                const nextPostData = getPost(filenames[index + 1]);
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

        const filePath = `./html${postData.guid}`;
        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath, { recursive : true });
        }
        fs.writeFileSync(`${filePath}index.html`, postData.content, { flag: 'w' });

    });
}

function getPost(filename): Post  {
    const fileContents: any = utils.getPostData(filename);
    const post: Post = JSON.parse(JSON.stringify(fileContents.data));
    checkType(post, 'Post');
    post.content = markdown.render(JSON.parse(JSON.stringify(fileContents.content)));
    return post;
}