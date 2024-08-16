export interface PostInfo {
    post: string;
    category: string;
}

export interface PostMetadata {
    title: string;
    description: string;
    tags: string[];
    create_at: Date;
    update_at: Date;
    hidden?: boolean;
    category: string
}

export interface PostListItem {
    meta: PostMetadata;
    slug: string;
}