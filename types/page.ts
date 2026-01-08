export interface SeoTitle {
    seo_title_en?: string;
    seo_title_id?: string;
}

export interface SeoDescription {
    seo_description_en?: string;
    seo_description_id?: string;
}

export interface SeoKeyword {
    seo_keyword_en?: string;
    seo_keyword_id?: string;
}

export interface SeoIcon {
    secure_url?: string;
    url?: string;
}

export interface Section {
    _id: string;
    _type: string;
    name_section?: string;
    type_section: string;
    published_at?: string | boolean;
}

export interface PageData {
    _id: string;
    _type: string;
    name_page?: string;
    slug_page?: {
        current: string;
    };
    published_at?: string | boolean;
    seo_title?: SeoTitle;
    seo_description?: SeoDescription;
    seo_keyword?: SeoKeyword;
    seo_icon?: SeoIcon;
    section_list?: Section[];
}

export interface PageProps {
    params: Promise<{
        slug?: string[];
    }>;
}