import { Blog, Post, Template } from '../src/types';
import { sanitize, slugify } from '../src/';
const df = require('user-friendly-date-formatter');

function getDisplayDate(dateTime: string) {
    return df(new Date(dateTime), '%D %fM %YYYY');
}

export const htmlIndexTemplate: Template = (posts: Post[], blog: Blog): string => {
    let html = '';
    posts.forEach( post => {
        const title = sanitize(post.title);
        html += `<article>
        <h1><a href="${ post.guid }" title="${ title }">${ title }</a></h1>
        <time datetime="${ post.date }">${ getDisplayDate(post.date) }</time>
        ${ post.content }
        </article>
        <hr />
        `;
    });

    return `${ htmlHeader(blog) }
    ${ html }
    <p><a href="/${blog.root}/">All posts</a></p>
    ${ htmlFooter(blog) }
    `;
}

export const htmlPostTemplate: Template = (post: Post, blog: Blog): string => {
    const title = sanitize(post.title);
    return `${ htmlHeader(blog, post) }
        <article>
        <h1><a href="${ post.guid }">${ title }</a></h1>
        <time datetime="${ post.date }">${ getDisplayDate(post.date) }</time>
        ${ post.content }
        <hr />
        <p>Posted in: ${tagsTemplate(post.tags)}</p>
        ${ post.previous_link ? `<p>Previously: <a href="${ post.previous_link.url }">${ sanitize(post.previous_link.text) }</a></p>` : ''}
        ${ post.next_link ? `<p>Next: <a href="${ post.next_link.url }">${ sanitize(post.next_link.text) }</a></p>` : ''}
        </article>
        ${ htmlFooter(blog) }
        `;
}

export const htmlArchiveIndexTemplate: Template = (posts: Post[], blog: Blog): string => {
    let html = '';
    posts.forEach( post => {
        const title = sanitize(post.title);
        html += `<li><a href="${ post.guid }" title="${ title }">${ title }</a> <time datetime="${ post.date }">${ getDisplayDate(post.date) }</time></li>`;
    });

    return `${ htmlHeader(blog) }
    <article>
    <h1>Archives</h1>
    <p>
    <ul>${ html }</ul>
    </p>
    </article>
    ${ htmlFooter(blog) }
    `;
}

export const htmlFooter = (blog: Blog): string => {
    const title = sanitize(blog.title);
    return `</main>
    <footer>
        <a href="${ blog.url }" title="${ title }">${ title }</a> | <a href="#">Top</a>
    </footer>
</body>
</html>`;
}

export const htmlHeader = (blog: Blog, post?: Post): string => {
    let blogTitle = sanitize(blog.title);
    let pageTitle = blogTitle;
    if (post) {
        pageTitle += ` | ${ sanitize(post.title) }`;
    }
    return  `<!DOCTYPE html>
    <html lang="en-US">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>${ pageTitle }</title>
        <link href="/css/scottandrew.css" type="text/css" rel="stylesheet" />
    </head>
    
    <body>
        <header>
            <nav>
                <a href="${ blog.url }"
                    title="${ blogTitle }">${ blogTitle }</a>
            </nav>
        </header>
        <main>
`;
}

const tagsTemplate = (tags: string) => {
    let html = [];
    tags.split(' ').forEach(tag => {
        const safeTag = slugify(tag);
        html.push(`<a href="/tag/${safeTag}/">${safeTag}</a>`);
    });
    return html.join(', ');
}
