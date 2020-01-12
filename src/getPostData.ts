const frontmatter = require('frontmatter');
const fs = require('fs');
const markdown = require('markdown-it')({ html: true });
import { Post } from './types';
import { checkType } from './checkType';

export function getPostData(filename: string): Post {
    const postContents: string = fs.readFileSync(`./posts/${filename}`, { encoding: 'utf8' });
    const parsedContents: any = frontmatter(postContents);
    const post: Post = JSON.parse(JSON.stringify(parsedContents.data));
    checkType(post, 'Post');
    post.content = markdown.render(parsedContents.content);
    return post;
}
