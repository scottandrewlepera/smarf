import { checkType } from './src/checkType';
import { Post, Blog, Link } from './types/';
import { getPostData } from './src/utils';
const CONFIG_PATH = '../blog_config.json';
const blog: Blog = require(CONFIG_PATH);
const minimist = require('minimist');
const format = require('date-format');
const fs = require('fs');

const POST_FILENAME_DATE_FORMAT = 'yyyy-MM-dd_hh-mm-ss-SSS';
const POST_DATE_FORMAT = 'yyyy-MM-dd hh:mm:ss';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

let argv = minimist(process.argv.slice(2), {
    string: [
        'title'
    ],
});

if (!argv.title) {
    throw Error('No title parameter supplied');
}

createEmptyPost(argv.title);

/* functions */

function createEmptyPost(title: string) {

    if (!fs.existsSync('./posts')){
        fs.mkdirSync('./posts');
    }

    const titleSlug = createTitleSlug(title);

    const date = new Date();
    const postDate = format.asString(POST_DATE_FORMAT, date);
    const formattedDate = format.asString(POST_FILENAME_DATE_FORMAT, date);
    const postLink = createFormattedArchivePath(blog, titleSlug, date);

    const filename = `${formattedDate}_${titleSlug}.md`;

    const linkFileNames = getPreviousNextFileNames(filename);
    const links: any = getPreviousNextLinks(linkFileNames);

    const post: Post = {
        title: title,
        date: postDate,
        filename: filename,
        author_uid: blog.authors[0].author_uid,
        status: 'publish',
        slug: titleSlug,
        guid: postLink,
        previous_link: links.previous,
        next_link: links.next
    };

    createPostFile(filename, createPostContent(post));
    console.log(`Created file for post: ${post.title}`);
}

function createTitleSlug(title: string): string {
    return title.replace(/\s/gi, '_')
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase();
}

function createFormattedArchivePath(blog: Blog, titleSlug: string, date: Date): string {
    const formattedArchivePath = 
        (blog.archive_format === 'YearMonthDay') ? 'yyyy/MM/dd' : 'yyyy/MM';
    const dateFragment = 
        format.asString(formattedArchivePath, date);
    return `/${blog.root}/${dateFragment}/${titleSlug}/`;
}

function createPostContent(post: Post): string {

    return `---
title: "${post.title}"
date: ${post.date}
filename: ${post.filename}
status: ${post.status}
author_uid: ${post.author_uid}
slug: ${post.slug}
guid: ${post.guid}
thumbnail_image: ${post.thumbnail_image || '' }
opengraph_image: ${post.opengraph_image || '' }
tags: ${post.tags || '' }
excerpt: "${post.excerpt || '' }"

---

${post.content || 'Write a blog post here'}

`;
}

function createPostFile(filename, content) {
    fs.writeFileSync(`./posts/${filename}`, content, { flag: 'w' });
}

function getPreviousNextFileNames(filename: string): any {
    const dir = fs.readdirSync('./posts');
    dir.push(filename);
    dir.sort();
    const indexes: any = {};
    indexes.previous = dir[dir.indexOf(filename) - 1];
    indexes.next = dir[dir.indexOf(filename) + 1];
    return indexes;
}

function getPreviousNextLinks(filenames: any): any {
    const links: any = {};
    Object.keys(filenames).forEach( key => {
        if (filenames[key]) {
            const parsed: any = getPostData(filenames[key]);
            const link: Link = {
                url: parsed.data.guid,
                text: parsed.data.title,
                title: `Link to ${key} post - ${parsed.data.title}`
            }
            links[key] = link;
        }
    })

    return links;
}

