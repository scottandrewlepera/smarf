import { Blog, Post, Template } from '../src/types';
import { sanitizeHTML } from '../src/';
const df = require('user-friendly-date-formatter');

function getDisplayDate(dateTime: string) {
    return df(new Date(dateTime), '%D %fM %YYYY');
}

export const htmlIndexTemplate: Template = (posts: Post[], blog: Blog): string => {
    let html = '';
    posts.forEach( post => {
        const title = sanitizeHTML(post.title);
        html += `<article>
        <h1><a href="${ post.guid }" title="${ title }">${ title }</a></h1>
        <time datetime="${ post.date }">${ getDisplayDate(post.date) }</time>
        ${ post.content }
        </article>
        `;
    });

    return `${ htmlHeader(blog) }
    ${ html }
    ${ htmlFooter(blog) }
    `;
}

export const htmlPostTemplate: Template = (post: Post, blog: Blog): string => {
    const title = sanitizeHTML(post.title);
    return `${ htmlHeader(blog, post) }
        <article>
        <h1><a href="${ post.guid }">${ title }</a></h1>
        <time datetime="${ post.date }">${ getDisplayDate(post.date) }</time>
        ${ post.content }
        <hr />
        ${ post.previous_link ? `<p>Previously: <a href="${ post.previous_link.url }">${ sanitizeHTML(post.previous_link.text) }</a></p>` : ''}
        ${ post.next_link ? `<p>Next: <a href="${ post.next_link.url }">${ sanitizeHTML(post.next_link.text) }</a></p>` : ''}
        </article>
        ${ htmlFooter(blog) }
        `;
}

export const htmlFooter = (blog: Blog): string => {
    const title = sanitizeHTML(blog.title);
    return `</main>
    <footer>
        <a href="${ blog.url }" title="${ title }">${ title }</a> | <a href="#">Top</a>
    </footer>
</body>
</html>`;
}

export const htmlHeader = (blog: Blog, post?: Post): string => {
    let blogTitle = sanitizeHTML(blog.title);
    let pageTitle = blogTitle;
    if (post) {
        pageTitle += ` | ${ sanitizeHTML(post.title) }`;
    }
    return  `<!DOCTYPE html>
    <html lang="en-US">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>${ pageTitle }</title>
        <style>
            html {
                font-size: 18px;
                font-family: sans-serif;
            }
    
            header, footer, main {
                max-width: 960px;
                margin: auto;
            }
    
            article {
                margin-bottom: 6em;
            }
    
            p, ul, ol {
                line-height: 1.8rem;
            }
    
            time {
                color: #aaaaaa;
            }
    
            pre {
                background: #eee;
                padding: 1rem;
                white-space: pre-wrap;
            }
    
            *:not(pre) > code {
                background-color: #ffe5e9;
                font-weight: bold;
                padding: 4px;
            }
        </style>
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
