// types/list/Blog.ts
export interface LocalizedText {
    en: string;
    id: string;
}

export interface SanityImage {
    asset: {
        _id: string;
        url: string;
    };
    alt?: LocalizedText;
}

// NEW: Blog Category Type
export interface BlogCategory {
    _id: string;
    name: LocalizedText;
    slug: {
        current: string;
        _type: string;
    };
    description?: LocalizedText;
    status: 'active' | 'inactive';
}

export interface BlogItem {
    _id: string;
    title: LocalizedText;
    slug: {
        current: string;
        _type: string;
    };
    excerpt: LocalizedText;
    date: string;
    // UPDATED: Category sekarang berupa object reference
    category?: BlogCategory;
    author: string;
    image: SanityImage;
    content?: {
        en: any[];
        id: any[];
    };
    tags?: string[];
    seo?: {
        metaTitle?: LocalizedText;
        metaDescription?: LocalizedText;
        keywords?: {
            en: string[];
            id: string[];
        };
    };
    featured?: boolean;
    status?: 'draft' | 'published' | 'archived';
}