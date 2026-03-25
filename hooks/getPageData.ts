import { client } from "@/lib/sanity";
import { PageData } from "@/types/page";
import { groq } from "next-sanity";
import { cache } from "react";

// Fungsi untuk fetch data page berdasarkan slug - MEMOIZED for SSR
export const getPageData = cache(async (slug: string): Promise<PageData | null> => {
    const current_slug = `${slug}`;
    const query = groq`*[_type == "page" && slug_page.current == $current_slug][0]{
        _id,
        _type,
        name_page,
        slug_page,
        published_at,

        seo_title {
            seo_title_en,
            seo_title_id
        },
        seo_description {
            seo_description_en,
            seo_description_id
        },
        seo_keyword {
            seo_keyword_en,
            seo_keyword_id
        },
        seo_icon,
        
        section_list[]->{
            ...,
            // Hero Utama Content
            hero_content {
                ...,
                speech_bubble {
                    ...,
                    character_image { asset->{_id, url} }
                },
                slider_images[] { asset->{_id, url} },
                background_video { asset->{_id, url} }
            },
            // Hero Umum Content
            hero_umum_content,
            // Support Header Content
            support_header_content {
                ...,
                buttons[] {
                    ...,
                    file_pdf {
                        file_pdf_en { asset->{_id, url} },
                        file_pdf_id { asset->{_id, url} }
                    }
                }
            },
            // Story Vision Mission Content
            story_vision_mission,
            // Why It Works Content
            why_it_works {
                ...,
                features[] {
                    ...,
                    image { asset->{_id, url} }
                }
            },
            // Features Content
            features_content {
                ...,
                logo_features { asset->{_id, url} },
                mobile_features[] {
                    ...,
                    mobile_icon { asset->{_id, url} },
                    features_list[]->{
                        ...,
                        icon { asset->{_id, url} }
                    }
                }
            },
            // Testimonial Content
            testimonial_content {
                ...,
                testimonials[] {
                    ...,
                    company_logo { asset->{_id, url} }
                }
            },
            // About/FAQ Content
            about_content {
                ...,
                side_image { asset->{_id, url} }
            },
            // Blog Content
            blog_content {
                ...,
                list_blog[]->{
                    ...,
                    category->,
                    image { asset->{_id, url} }
                }
            },
            // Request Demo Content
            request_demo_content {
                ...,
                background_image { asset->{_id, url} }
            },
            // Pricing Content
            pricing_content {
                ...,
                pricing_plans[]->
            },
            // Support Section Content
            support_section_content {
                ...,
                support_plans[]->
            },
            // Privacy Policy Section Content
            privacy_policy_section_content {
                ...,
                privacy_policy[]-> {
                    ...,
                    icon_type { asset->{_id, url} },
                    content_en[] {
                        ...,
                        _type == "image" => {
                            ...,
                            asset-> { _id, url }
                        }
                    },
                    content_id[] {
                        ...,
                        _type == "image" => {
                            ...,
                            asset-> { _id, url }
                        }
                    }
                }
            },
            // Terms and Conditions Section Content
            terms_and_conditions_section_content {
                ...,
                terms_and_conditions[]-> {
                    ...,
                    icon_type { asset->{_id, url} },
                    content_en[] {
                        ...,
                        _type == "image" => {
                            ...,
                            asset-> { _id, url }
                        }
                    },
                    content_id[] {
                        ...,
                        _type == "image" => {
                            ...,
                            asset-> { _id, url }
                        }
                    }
                }
            },
            // FAQ Section Content
            faq_section_content {
                ...,
                category_tabs[] {
                    ...,
                    list_faqs[]->
                }
            },
            // Blog List Section Content
            blog_list_section_content {
                ...,
                "list_blogs": select(
                    tampilkan_semua == true => *[_type == "list_blog" && status == "published"] | order(date desc) {
                        ...,
                        category->,
                        image { asset->{_id, url} }
                    },
                    list_blogs[]->{
                        ...,
                        category->,
                        image { asset->{_id, url} }
                    }
                )
            }
        }
    }`;

    try {
        const result = await client.fetch(
            query, 
            { current_slug },
            {
                next: {
                    revalidate: 86400,
                    tags: ['page-data']
                }
            }
        );
        return result || null;
    } catch (error) {
        console.error("Error fetching page data:", error);
        return null;
    }
});
