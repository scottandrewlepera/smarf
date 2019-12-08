import { Blog, Post } from '../types';

export const rssItemTemplate = (post: Post, blog: Blog): string =>{
    const postUrl = `${blog.url}${post.guid}`;
    return `<item>
    <title><![CDATA[${post.title}]]></title>
    <link>${postUrl}</link>
    <pubDate>${post.date}</pubDate>
    <dc:creator><![CDATA[${post.author_uid}]]></dc:creator>
    <guid isPermaLink="false">${postUrl}</guid>
    <content:encoded><![CDATA[${post.content}]]></content:encoded>
</item>`;
}

export const rssFeedTemplate = (blog: Blog, items: string[]) => {
    const allItems = items.join(`\n`);
    return `${rssFeedHeader}
<channel>
    <title>${blog.title}</title>
    <link>${blog.url}</link>
    <description>${blog.description}</description>
    <lastBuildDate>${ new Date() }</lastBuildDate>
    <language>${blog.language}</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Smarf 0.1</generator>
${allItems}
</channel>
${rssFeedFooter}`;
}

const rssFeedHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0.1"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>`;

const rssFeedFooter = `</rss>
`;