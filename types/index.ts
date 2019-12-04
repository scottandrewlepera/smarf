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
}

export interface Tag {
    name: string;
    text: string;
}

export interface Post {
    guid: string;
    date: Date;
    title: string;
    author: Author;
    content?: string;
    excerpt?: string;
    slug?: string;
    tags?: Tag[];
    thumbnail_image?: string;
    opengraph_image?: string;
}

