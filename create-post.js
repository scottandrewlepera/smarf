"use strict";
exports.__esModule = true;
var checkType_1 = require("./src/checkType");
var CONFIG_PATH = './blog_config.json';
var blog = require(CONFIG_PATH);
var minimist = require('minimist');
var format = require('date-format');
var frontmatter = require('frontmatter');
var fs = require('fs');
var POST_SLUG_DATE_FORMAT = 'yyyy-MM-dd_hh-mm-ss';
var POST_DATE_FORMAT = 'yyyy-MM-dd hh:mm:ss';
checkType_1.checkType(blog, 'Blog');
console.log('Blog config loaded and validated.');
var argv = minimist(process.argv.slice(2), {
    string: [
        'title'
    ]
});
if (!argv.title) {
    throw Error('No title parameter supplied');
}
createEmptyPost(argv.title);
function createEmptyPost(title) {
    if (!fs.existsSync('./posts')) {
        fs.mkdirSync('./posts');
    }
    var titleSlug = createTitleSlug(title);
    var date = new Date();
    var postDate = format.asString(POST_DATE_FORMAT, date);
    var formattedDate = format.asString(POST_SLUG_DATE_FORMAT, date);
    var postLink = createFormattedArchivePath(blog, titleSlug, date);
    var filename = formattedDate + "_" + titleSlug + ".md";
    var linkFileNames = getPreviousNextFileNames(filename);
    var links = getPreviousNextLinks(linkFileNames);
    var post = {
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
    console.log("Created file for post: " + post.title);
    if (links.previous) {
        updatePreviousPost(linkFileNames.previous, post);
    }
}
function updatePreviousPost(filename, post) {
    var previousPost = getPostData(filename);
    var newPost = JSON.parse(JSON.stringify(previousPost.data));
    newPost.content = previousPost.content;
    var nextLink = {
        url: post.guid,
        text: post.title,
        title: "Link to next post - " + post.title
    };
    newPost.next_link = nextLink;
    createPostFile(filename, createPostContent(newPost));
    console.log("Updated previous post: " + newPost.title);
}
function createTitleSlug(title) {
    return title.replace(/\s/gi, '_')
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase();
}
function createFormattedArchivePath(blog, titleSlug, date) {
    var formattedArchivePath = (blog.archive_format === 'YearMonthDay') ? 'yyyy/MM/dd' : 'yyyy/MM';
    var dateFragment = format.asString(formattedArchivePath, date);
    return blog.url + "/" + blog.root + "/" + dateFragment + "/" + titleSlug + "/";
}
function createPostContent(post) {
    return "---\ntitle: " + post.title + "\ndate: " + post.date + "\nstatus: " + post.status + "\nauthor_uid: " + post.author_uid + "\nslug: " + post.slug + "\nguid: " + post.guid + "\nprevious_link: " + (!post.previous_link ? '' : "\n    url: " + (post.previous_link.url || null) + "\n    text: " + (post.previous_link.text || null) + "\n    title: " + (post.previous_link.title || null)) + "\nnext_link: " + (!post.next_link ? '' : "\n    url: " + (post.next_link.url || null) + "\n    text: " + (post.next_link.text || null) + "\n    title: " + (post.next_link.title || null)) + "\nthumbnail_image: " + (post.thumbnail_image || '') + "\nopengraph_image: " + (post.opengraph_image || '') + "\ntags: " + (post.tags || '') + "\nexcerpt: " + (post.excerpt || '') + "\n\n---\n\n" + (post.content || 'Write a blog post here') + "\n\n";
}
function createPostFile(filename, content) {
    fs.writeFileSync("./posts/" + filename, content, { flag: 'w' });
}
function getPreviousNextFileNames(filename) {
    var dir = fs.readdirSync('./posts');
    dir.push(filename);
    dir.sort();
    var indexes = {};
    indexes.previous = dir[dir.indexOf(filename) - 1];
    indexes.next = dir[dir.indexOf(filename) + 1];
    return indexes;
}
function getPostData(filename) {
    var postContents = fs.readFileSync("./posts/" + filename, { encoding: 'utf8' });
    return frontmatter(postContents);
}
function getPreviousNextLinks(filenames) {
    var links = {};
    Object.keys(filenames).forEach(function (key) {
        if (filenames[key]) {
            var parsed = getPostData(filenames[key]);
            var link_1 = {
                url: parsed.data.guid,
                text: parsed.data.title,
                title: "Link to " + key + " post - '" + parsed.data.title + "'"
            };
            links[key] = link_1;
        }
    });
    return links;
}
