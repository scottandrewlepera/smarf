/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const Link = t.iface([], {
  "text": "string",
  "title": "string",
  "url": "string",
});

export const Author = t.iface([], {
  "name": "string",
  "contact": t.opt("string"),
  "urls": t.opt(t.array("Link")),
});

export const ArchiveFormat = t.union(t.lit('YearMonthDay'), t.lit('YearMonth'));

export const Blog = t.iface([], {
  "title": "string",
  "url": "string",
  "description": t.opt("string"),
  "language": t.opt("string"),
  "authors": t.opt(t.array("Author")),
  "archiveFormat": "ArchiveFormat",
  "archiveWithSlug": "boolean",
  "indexPosts": t.opt("number"),
});

export const Tag = t.iface([], {
  "name": "string",
  "text": "string",
});

export const PostStatus = t.union(t.lit('draft'), t.lit('publish'));

export const Post = t.iface([], {
  "date": "string",
  "title": "string",
  "author": "Author",
  "guid": t.opt("string"),
  "content": t.opt("string"),
  "excerpt": t.opt("string"),
  "slug": t.opt("string"),
  "tags": t.opt(t.array("Tag")),
  "thumbnail_image": t.opt("string"),
  "opengraph_image": t.opt("string"),
  "previous_link": t.opt("Link"),
  "next_link": t.opt("Link"),
  "status": "PostStatus",
});

const exportedTypeSuite: t.ITypeSuite = {
  Link,
  Author,
  ArchiveFormat,
  Blog,
  Tag,
  PostStatus,
  Post,
};
export default exportedTypeSuite;
