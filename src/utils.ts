const frontmatter = require('frontmatter');
const fs = require('fs');

export function getPostData(filename: string): object {
    const postContents = fs.readFileSync(`./posts/${filename}`, { encoding: 'utf8' });
    return frontmatter(postContents);
}
