import { checkType } from './src/checkType';
import { Post, Blog } from './src/types';
import { die } from './src';
import { markdownPostTemplate } from './templates/markdown';

const blog: Blog = require('../blog-config.json');
const minimist = require('minimist');
const df = require('user-friendly-date-formatter');
const fs = require('fs');
const util = require('util');

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

let args = minimist(process.argv.slice(2), {
    string: [
        'title', 't', 'date', 'd'
    ],
});

const title = args.title || args.t;
const dateArg = args.date || args.d;

if (!title || title.length === 0) {
    die('No title parameter supplied.');
}

let date;
if (dateArg && dateArg.length > 0) {
    date = new Date(dateArg);
    if (isNaN(date.valueOf())) {
        die(`Can't use date: ${dateArg}`);
    }
} else {
    date = new Date();
}

createEmptyPost(title, date);

/* functions */

function createEmptyPost(title: string, date: Date) {

    const titleSlug = createTitleSlug(title);
    const postDate = df(date, '%YYYY-%MM-%DD %H:%m:%s');
    const filename = createFileName(titleSlug, date)
    const postLink = createArchivePath(blog, titleSlug, date);

    const post: Post = {
        title: title,
        date: postDate,
        filename: filename,
        author_uid: blog.authors[0].author_uid,
        status: 'publish',
        slug: titleSlug,
        guid: postLink
    };

    createPostFile(filename, post);
    console.log(`Created file for post: ${post.title}`);
}

function createTitleSlug(title: string): string {
    return title.replace(/\s/gi, '_')
                .replace(/[^a-z0-9_]/gi, '')
                .toLowerCase()
                .slice(0, 50);
}

function createFileName(titleSlug: string, date: Date): string {
    const formattedDate = df(date, '%YYYY-%MM-%DD_%H-%m-%s-%l');
    return `${formattedDate}_${titleSlug}.md`;
}

function createArchivePath(blog: Blog, titleSlug: string, date: Date): string {
    const format = '%YYYY/%MM/%DD';
    const dateFragment = df(date, format);
    return `/${blog.root}/${dateFragment}/${titleSlug}/`;
}

function createPostFile(filename: string, post: Post) {
    if (!fs.existsSync('./posts')){
        fs.mkdirSync('./posts');
    }
    const content = markdownPostTemplate(post);
    try {
        fs.writeFileSync(`./posts/${filename}`, content, { flag: 'wx' });
    } catch (err) {
        die(`Could not write Markdown file: ${err.message}`);
    }
}
