import { Blog, Post, Template } from '../src/types';
const df = require('user-friendly-date-formatter');

function getDisplayDate(dateTime: string) {
    return df(new Date(dateTime), '%D %fM %YYYY');
}

export const htmlIndexTemplate: Template = (posts: Post[], blog: Blog): string => {
    let html = '';
    posts.forEach( post => {
        html += `<article>
        <h1><a href="${post.guid}">${post.title}</a></h1>
        <time datetime="${post.date}">${ getDisplayDate(post.date) }</time>
        ${post.content}
        </article>
        `;
    });

    return `${ htmlHeader(blog) }
    ${html}
    ${ htmlFooter(blog) }
    `;
}

export const htmlPostTemplate: Template = (post: Post, blog: Blog): string => {
    return `${ htmlHeader(blog, post) }
        <article>
        <h1><a href="${post.guid}">${post.title}</a></h1>
        <time datetime="${post.date}">${ getDisplayDate(post.date) }</time>
        ${post.content}
        <hr />
        ${ post.previous_link ? `<p>Previously: <a href="${post.previous_link.url}">${post.previous_link.text}</a></p>` : ''}
        ${ post.next_link ? `<p>Next: <a href="${post.next_link.url}">${post.next_link.text}</a></p>` : ''}
        </article>
        ${ htmlFooter(blog) }
        `;
}

export const htmlFooter = (blog: Blog): string => {
    return `</main>
    <footer>
        <a href="${blog.url}" title="${blog.title}">${blog.title}</a> | <a href="#">Top</a>
    </footer>
</body>
</html>`;
}

export const htmlHeader = (blog: Blog, post?: Post): string => {
    let title = blog.title;
    if (post) {
        title += ` | ${post.title}`;
    }
    return  `<!DOCTYPE html>
    <html lang="en-US">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="utf-8">
        <title>${title}</title>
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
                <a href="${blog.url}" title="${blog.title}">${blog.title}</a>
            </nav>
        </header>
        <main>
`;
}
