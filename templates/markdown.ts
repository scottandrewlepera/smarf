import { Post } from '../src/types';

export function markdownPostTemplate(post: Post): string {

return `---
title: "${post.title}"
date: "${post.date}"
filename: "${post.filename}"
status: ${post.status}
author_uid: ${post.author_uid}
slug: ${post.slug}
guid: ${post.guid}
thumbnail_image: ${post.thumbnail_image || '' }
opengraph_image: ${post.opengraph_image || '' }
tags: ${post.tags || '' }
excerpt: "${post.excerpt || '' }"

---

${post.content || 'Write a blog post here'}

`;
}