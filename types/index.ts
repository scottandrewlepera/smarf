export type Link = {
    text: string;
    title?: string;
    url: string;
}

export type Author = {
    name: string;
    author_uid: string;
    contact?: string;
    urls?: Link[];
}

export type ArchiveFormat = 'YearMonthDay' | 'YearMonth';

export type Blog = {
    title: string;
    url: string;
    root: string;
    description?: string;
    language?: string;
    authors?: Author[];
    archive_format: ArchiveFormat;
    archive_with_slug: boolean;
    index_posts?: number;
    default_opengraph_image?: string;
}

export type Tag = {
    name: string;
    text: string;
}

export type PostStatus = 'draft' | 'publish';

export type Post = {
    date: string;
    title: string;
    author_uid: string;
    guid?: string;
    content?: string;
    excerpt?: string;
    slug?: string;
    tags?: Tag[];
    thumbnail_image?: string;
    opengraph_image?: string;
    previous_link?: Link;
    next_link?: Link;
    status: PostStatus;
}

