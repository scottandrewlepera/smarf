import { Blog, Post, Template } from '../types';

export const htmlIndexTemplate: Template = (posts: Post[], blog: Blog): string => {
    const headerHTML = htmlHeaderTemplate(blog);
    const footerHTML = htmlFooterTemplate(blog);
    let html = '';
    posts.forEach( post => {
        html += `<article>
        <h1><a href="${post.guid}">${post.title}</a></h1>
        ${post.content}
        </article>
        `;
    });

    return `${headerHTML}
    ${html}
    ${footerHTML}`;
}

export const htmlPostTemplate: Template = (post: Post, blog: Blog): string => {
    const headerHTML = htmlHeaderTemplate(blog, post);
    const footerHTML = htmlFooterTemplate(blog);
    let html = `<article>
        <h1><a href="${post.guid}">${post.title}</a></h1>
        ${post.content}
        <hr />
        ${ post.previous_link ? `<p>Previously: <a href="${post.previous_link.url}">${post.previous_link.text}</a></p>` : ''}
        ${ post.next_link ? `<p>Next: <a href="${post.next_link.url}">${post.next_link.text}</a></p>` : ''}
        </article>
        `;

    return `${headerHTML}
    ${html}
    ${footerHTML}`;
}

export const htmlFooterTemplate = (blog: Blog): string => {
    return `</main>
    <footer>
        <a href="${blog.url}" title="${blog.title}">${blog.title}</a> | <a href="#">Top</a>
    </footer>
</body>
</html>`;
}

export const htmlHeaderTemplate = (blog: Blog, post?: Post): string => {
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
    
            p, ul {
                line-height: 1.8rem;
            }
    
            time {
                color: #ccc;
            }
    
            pre {
                background: #eee;
                padding: 1rem;
                white-space: pre-wrap;
            }
    
            p > code {
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
