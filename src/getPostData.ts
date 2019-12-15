const frontmatter = require('frontmatter');
const fs = require('fs');
var markdown = require('markdown-it')({ html: true });
import { Post } from './types';
import { checkType } from './checkType';

export function getPostData(filename: string): Post {
    const postContents = fs.readFileSync(`./posts/${filename}`, { encoding: 'utf8' });
    const parsedContents = frontmatter(postContents);
    const post: Post = JSON.parse(JSON.stringify(parsedContents.data));
    checkType(post, 'Post');
    post.content = markdown.render(JSON.parse(JSON.stringify(parsedContents.content)));
    return post;
}
