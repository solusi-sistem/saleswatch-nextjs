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

export interface BlogItem {
    _id: string;
    // Title - Bilingual
    title: LocalizedText;
    // Slug
    slug: {
        current: string;
        _type: string;
    };
    // Excerpt - Bilingual
    excerpt: LocalizedText;
    // Publication Date
    date: string;
    // Category - Bilingual
    category: LocalizedText;
    // Author
    author: string;
    // Featured Image
    image: SanityImage;
    // Content - Bilingual (Portable Text)
    content?: {
        en: any[]; // Portable Text blocks
        id: any[]; // Portable Text blocks
    };
    // Tags
    tags?: string[];
    // SEO Settings
    seo?: {
        metaTitle?: LocalizedText;
        metaDescription?: LocalizedText;
        keywords?: {
            en: string[];
            id: string[];
        };
    };
    // Featured Post
    featured?: boolean;
    // Status
    status?: 'draft' | 'published' | 'archived';
}