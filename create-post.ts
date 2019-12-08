import { checkType } from './src/checkType';
import { Post, Blog, Link } from './types/';
import { link } from 'fs';
const CONFIG_PATH = './blog_config.json';
const blog: Blog = require(CONFIG_PATH);
const minimist = require('minimist');
const format = require('date-format');
const frontmatter = require('frontmatter');
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
        author_uid: blog.authors[0].author_uid,
        status: 'draft',
        slug: titleSlug,
        guid: postLink,
        previous_link: links.previous,
        next_link: links.next
    };

    createPostFile(filename, createPostContent(post));
    console.log(`Created file for post: ${post.title}`);

    if (links.previous) {
        updatePreviousPost(linkFileNames.previous, post);
    }
}

function updatePreviousPost(filename: string, post: Post) {
    const previousPost: any = getPostData(filename);
    const newPost: Post = JSON.parse(JSON.stringify(previousPost.data));
    newPost.content = previousPost.content;
    const nextLink: Link = {
        url: post.guid,
        text: post.title,
        title: `Link to next post - ${post.title}`
    }
    newPost.next_link = nextLink;

    createPostFile(filename, createPostContent(newPost));
    console.log(`Updated previous post: ${newPost.title}`);
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
    return `${blog.url}/${blog.root}/${dateFragment}/${titleSlug}/`;
}

function createPostContent(post: Post): string {

    return `---
title: ${post.title}
date: ${post.date}
status: ${post.status}
author_uid: ${post.author_uid}
slug: ${post.slug}
guid: ${post.guid}
previous_link: ${ !post.previous_link ? '' :`
    url: ${post.previous_link.url || null }
    text: ${post.previous_link.text || null }
    title: ${post.previous_link.title || null }`}
next_link: ${ !post.next_link ? '' :`
    url: ${post.next_link.url || null }
    text: ${post.next_link.text || null }
    title: ${post.next_link.title || null }`}
thumbnail_image: ${post.thumbnail_image || '' }
opengraph_image: ${post.opengraph_image || '' }
tags: ${post.tags || '' }
excerpt: ${post.excerpt || '' }

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

function getPostData(filename: string): object {
    const postContents = fs.readFileSync(`./posts/${filename}`, { encoding: 'utf8' });
    return frontmatter(postContents);
}

function getPreviousNextLinks(filenames: any): any {
    const links: any = {};
    Object.keys(filenames).forEach( key => {
        if (filenames[key]) {
            const parsed: any = getPostData(filenames[key]);
            const link: Link = {
                url: parsed.data.guid,
                text: parsed.data.title,
                title: `Link to ${key} post - '${parsed.data.title}'`
            }
            links[key] = link;
        }
    })

    return links;
}

