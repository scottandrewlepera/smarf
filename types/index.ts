export type Link = {
    text: string;
    title?: string | null;
    url: string | null;
}

export type Author = {
    name: string;
    author_uid: string | null;
    contact?: string | null;
    urls?: Link[] | null;
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
    guid?: string | null;
    content?: string | null;
    excerpt?: string | null;
    slug?: string | null;
    tags?: Tag[] | null;
    thumbnail_image?: string | null;
    opengraph_image?: string | null;
    previous_link?: Link | null;
    next_link?: Link | null;
    status: PostStatus;
}

