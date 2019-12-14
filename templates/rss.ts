import { Blog, Post, Template } from '../src/types';
const df = require('user-friendly-date-formatter');

export const rssTemplate: Template = (posts: Post[], blog: Blog): string => {
    const rssHeader = rssFeedHeader(blog);
    const rssItems = rssItemsTemplate(posts, blog);
    return`${rssHeader}
    ${rssItems}
    ${rssFeedFooter}`;
}

export const rssItemsTemplate = (posts: Post[], blog: Blog): string => {
    let html = '';
    posts.forEach( post => {
        const postUrl = `${blog.url}${post.guid}`;
        html += `<item>
        <title><![CDATA[${post.title}]]></title>
        <link>${postUrl}</link>
        <pubDate>${post.date}</pubDate>
        <dc:creator><![CDATA[${post.author_uid}]]></dc:creator>
        <guid isPermaLink="false">${postUrl}</guid>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
        </item>`;
    });
    return html;
}

const rssFeedHeader = (blog: Blog) => {
    return `<rss version="2.0.1"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
>
<channel>
    <title>${blog.title}</title>
    <link>${blog.url}</link>
    <description>${blog.description}</description>
    <lastBuildDate>${ df(new Date(), '%YYYY-%MM-%DD %H:%m:%s') }</lastBuildDate>
    <language>${blog.language}</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Smarf 0.2</generator>`;
}

const rssFeedFooter = `</channel>
</rss>
`;