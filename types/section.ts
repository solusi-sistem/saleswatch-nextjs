// ==========================================
// BASE INTERFACES
// ==========================================
import { BlogItem } from "./list/Blog";

export interface LocalizedText {
    en: string;
    id: string;
}

export interface SanityImage {
    asset: {
        _id: string;
        url: string;
    };
}

export interface SanityFile {
    asset: {
        _id: string;
        url: string;
    };
}

export interface SectionProps {
    id?: string;
}

// ==========================================
// FAQ INTERFACE
// ==========================================
export interface FaqItem {
    _id: string;
    question: LocalizedText;
    answer: {
        en: any; // Rich text / Portable Text
        id: any; // Rich text / Portable Text
    };
}

// ==========================================
// PRICING INTERFACE
// ==========================================
export interface PricingPlan {
    _id: string;
    plan_name: LocalizedText;
    price_per_user: string;
    setup_fee: string;
    main_features: LocalizedText[];
    flex_user: string;
    custom_features?: {
        feature_name: LocalizedText;
        feature_value: LocalizedText;
    }[];
}

// ==========================================
// FEATURE INTERFACE
// ==========================================
export interface FeatureItem {
    _id: string;
    feature_name: LocalizedText;
    feature_description: LocalizedText;
    feature_icon?: SanityImage;
}

// ==========================================
// SUPPORT INTERFACE
// ==========================================
export interface SupportPlan {
    _id: string;
    key: string;
    title: LocalizedText;
    icon: SanityImage;
    support_items: {
        _key: string;
        title_en: string;
        title_id: string;
        content_en: any; // Rich text / Portable Text
        content_id: any; // Rich text / Portable Text
    }[];
}

// ==========================================
// HERO UTAMA CONTENT
// ==========================================
export interface HeroUtamaContent {
    title_lines?: {
        text_en: string;
        text_id: string;
    };
    description_lines?: {
        text_en: string;
        text_id: string;
    };
    speech_bubble?: {
        text_lines_en: string;
        text_lines_id: string;
        character_image?: SanityImage;
    };
    cta_button?: {
        text_en: string;
        text_id: string;
    };
    slider_images?: SanityImage[];
    statistics?: {
        number: string;
        label_en: string;
        label_id: string;
    }[];
    background_video?: SanityFile;
}

// ==========================================
// HERO UMUM CONTENT
// ==========================================
export interface HeroUmumContent {
    title_en: string;
    title_id: string;
    description_en: string;
    description_id: string;
}

// ==========================================
// SUPPORT HEADER CONTENT
// ==========================================
export interface SupportHeaderContent {
    title: LocalizedText;
    description: LocalizedText;
    buttons?: {
        button_type: 'pdf_download' | 'video_tutorial' | 'external_link' | 'internal_link';
        icon_type: 'download' | 'youtube' | 'book' | 'play' | 'external';
        button_text: LocalizedText;
        link_url?: string;
        file_pdf?: {
            file_pdf_en: SanityFile;
            file_pdf_id: SanityFile;
        };
        open_in_new_tab: boolean;
    }[];
}

// ==========================================
// STORY VISION MISSION CONTENT
// ==========================================
export interface StoryVisionMissionContent {
    items?: {
        icon_type: 'cross' | 'circle' | 'plus';
        title_en: string;
        title_id: string;
        description_en: string;
        description_id: string;
    }[];
}

// ==========================================
// WHY IT WORKS CONTENT
// ==========================================
export interface WhyItWorksContent {
    section_title_en: string;
    section_title_id: string;
    features?: {
        title_en: string;
        title_id: string;
        description_en: string;
        description_id: string;
        image?: SanityImage;
        image_position: 'left' | 'right';
        checklist_items?: {
            text_en: string;
            text_id: string;
        }[];
        cta_button?: {
            text_en: string;
            text_id: string;
            link: string;
        };
    }[];
}

// ==========================================
// FEATURES CONTENT
// ==========================================
export interface FeaturesContent {
    mobile_features?: {
        section_title_en: string;
        section_title_id: string;
        type_features: 'fiturUtama' | 'fiturSuite';
        mobile_icon?: SanityImage;
        features_list?: FeatureItem[];
    }[];
}

// ==========================================
// TESTIMONIAL CONTENT
// ==========================================
export interface TestimonialContent {
    testimonials?: {
        title_en: string;
        title_id: string;
        quote_en: string;
        quote_id: string;
        company_en: string;
        company_id: string;
        client_name: string;
        client_role_en: string;
        client_role_id: string;
        company_logo?: {
            asset?: {
                _id: string;
                url: string;
            };
        };
    }[];
}

// ==========================================
// FAQ CONTENT
// ==========================================
export interface FaqContent {
    title_en: string;
    title_id: string;
    description_en?: string;
    description_id?: string;
    faq_items?: {
        question_en: string;
        question_id: string;
        answer_en: string;
        answer_id: string;
    }[];
    side_image?: SanityImage;
}

// ==========================================
// BLOG CONTENT
// ==========================================
export interface BlogContent {
    badge_text_en?: string;
    badge_text_id?: string;
    title_en: string;
    title_id: string;
    list_blog?: BlogItem[];
}

// ==========================================
// REQUEST DEMO CONTENT
// ==========================================
export interface RequestDemoContent {
    badge_text_en?: string;
    badge_text_id?: string;
    title_lines?: {
        text_en: string;
        text_id: string;
    };
    cta_button?: {
        text_en: string;
        text_id: string;
    };
    background_image?: SanityImage;
}

// ==========================================
// PRICING CONTENT
// ==========================================
export interface PricingContent {
    table_headers?: {
        no_column: LocalizedText;
        feature_column: LocalizedText;
    };
    feature_rows?: {
        feature_name: LocalizedText;
        feature_type: 'price' | 'setup_fee' | 'main_features' | 'flex_user' | 'custom';
    }[];
    pricing_plans?: PricingPlan[];
    footer_note?: LocalizedText;
}

// ==========================================
// SUPPORT SECTION CONTENT
// ==========================================
export interface SupportSectionContent {
    support_plans?: SupportPlan[];
    bottom_cta?: {
        show_cta: boolean;
        cta_title: LocalizedText;
        cta_description: LocalizedText;
        cta_button: {
            button_text: LocalizedText;
            button_link: string;
        };
    };
    empty_state?: {
        title: LocalizedText;
        description: LocalizedText;
    };
}

// ==========================================
// PRIVACY POLICY ITEM INTERFACE
// ==========================================
export interface PrivacyPolicyItem {
    _id: string;
    title: LocalizedText;
    icon_type?: SanityImage;
    content_en: any; // Portable Text
    content_id: any; // Portable Text
    published_at?: boolean;
}

// ==========================================
// PRIVACY POLICY CONTENT
// ==========================================
export interface PrivacyPolicyContent {
    privacy_policy?: PrivacyPolicyItem[];
}

// ==========================================
// TERMS AND CONDITIONS CONTENT
// ==========================================
export interface TermsAndConditionsContent {
    terms_and_conditions?: PrivacyPolicyItem[]; // Menggunakan interface yang sama
}

// ==========================================
// FAQ SECTION CONTENT
// ==========================================
export interface FaqSectionContent {
    title_en: string;
    title_id: string;
    description_en?: string;
    description_id?: string;
    category_tabs?: {
        category_key: string;
        category_label: LocalizedText;
        list_faqs?: FaqItem[];
    }[];
    footer_note?: {
        en: any; // Rich text / Portable Text
        id: any; // Rich text / Portable Text
    };
}

// ==========================================
// BLOG LIST SECTION CONTENT
// ==========================================
export interface BlogListSectionContent {
    title_section?: LocalizedText;
    desc_section?: LocalizedText;
    list_blogs?: BlogItem[];
}

// ==========================================
// MAIN SECTION INTERFACE
// ==========================================
export interface Section {
    _id: string;
    _type: string;
    name_section?: string;
    type_section: string;
    published_at?: string | boolean;

    // Content fields based on type_section
    hero_content?: HeroUtamaContent;
    hero_umum_content?: HeroUmumContent;
    support_header_content?: SupportHeaderContent;
    story_vision_mission?: StoryVisionMissionContent;
    why_it_works?: WhyItWorksContent;
    features_content?: FeaturesContent;
    testimonial_content?: TestimonialContent;
    faq_content?: FaqContent;
    blog_content?: BlogContent;
    request_demo_content?: RequestDemoContent;
    pricing_content?: PricingContent;
    support_section_content?: SupportSectionContent;
    privacy_policy_section_content?: PrivacyPolicyContent;
    terms_and_conditions_section_content?: TermsAndConditionsContent;
    faq_section_content?: FaqSectionContent;
    blog_list_section_content?: BlogListSectionContent;
}