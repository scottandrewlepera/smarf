import { checkType } from './src/checkType';
import { Post, Blog } from './src/types';
const blog: Blog = require('../blog-config.json');
const minimist = require('minimist');
const df = require('user-friendly-date-formatter');
const fs = require('fs');

const POST_FILENAME_DATE_FORMAT = '%YYYY-%MM-%DD_%H-%m-%s-%l';
const POST_DATE_FORMAT = '%YYYY-%MM-%DD %H:%m:%s';

checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');

let args = minimist(process.argv.slice(2), {
    string: [
        'title',
        't'
    ],
});

const title = args.title || args.t;

if (!title) {
    throw Error('No title parameter supplied');
}

createEmptyPost(title);

/* functions */

function createEmptyPost(title: string) {

    if (!fs.existsSync('./posts')){
        fs.mkdirSync('./posts');
    }

    const titleSlug = createTitleSlug(title);

    const date = new Date();
    const postDate = df(date, POST_DATE_FORMAT);
    const formattedDate = df(date, POST_FILENAME_DATE_FORMAT);
    const postLink = createFormattedArchivePath(blog, titleSlug, date);

    const filename = `${formattedDate}_${titleSlug}.md`;

    const post: Post = {
        title: title,
        date: postDate,
        filename: filename,
        author_uid: blog.authors[0].author_uid,
        status: 'publish',
        slug: titleSlug,
        guid: postLink
    };

    createPostFile(filename, createPostContent(post));
    console.log(`Created file for post: ${post.title}`);
}

function createTitleSlug(title: string): string {
    let slug =  title.replace(/\s/gi, '_')
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase();

    if (slug.length > 100) {
        slug = slug.slice(0, 100);
    }
    return slug;
}

function createFormattedArchivePath(blog: Blog, titleSlug: string, date: Date): string {
    const formattedArchivePath = 
        (blog.archive_format === 'YearMonthDay') ? '%YYYY/%MM/%DD' : '%YYYY/%MM';
    const dateFragment = df(date, formattedArchivePath);
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
