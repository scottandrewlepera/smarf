export interface Link {
    text: string;
    title: string;
    url: string;
}

export interface Author {
    name: string;
    contact?: string;
    urls?: Link[];
}

export type ArchiveFormat = 'YearMonthDay' | 'YearMonth';

export interface Blog {
    title: string;
    url: string;
    description?: string;
    language?: string;
    authors?: Author[];
    archiveFormat: ArchiveFormat;
    archiveWithSlug: boolean;
    indexPosts?: number;
}

export interface Tag {
    name: string;
    text: string;
}

export type PostStatus = 'draft' | 'publish';

export interface Post {
    date: Date;
    title: string;
    author: Author;
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

