import { client } from "@/lib/sanity";
import { Section } from "@/types/section";
import { groq } from "next-sanity";

// Fungsi untuk fetch data section berdasarkan ID
export async function getSectionData(sectionId: string): Promise<Section | null> {
    const query = groq`*[_type == "section" && _id == $sectionId][0]{
        _id,
        _type,
        name_section,
        type_section,
        published_at,

        // Hero Utama Content
        hero_content {
            title_lines {
                text_en,
                text_id
            },
            description_lines {
                text_en,
                text_id
            },
            speech_bubble {
                text_lines_en,
                text_lines_id,
                character_image {
                    asset->{
                        _id,
                        url
                    }
                }
            },
            cta_button {
                text_en,
                text_id
            },
            slider_images[] {
                asset->{
                    _id,
                    url
                }
            },
            statistics[] {
                number,
                label_en,
                label_id
            },
            background_video {
                asset->{
                    _id,
                    url
                }
            }
        },

        // Hero Umum Content
        hero_umum_content {
            title_en,
            title_id,
            description_en,
            description_id
        },

        // Support Header Content
        support_header_content {
            title {
                en,
                id
            },
            description {
                en,
                id
            },
            buttons[] {
                button_type,
                icon_type,
                button_text {
                    en,
                    id
                },
                link_url,
                file_pdf {
                    file_pdf_en {
                        asset->{
                            _id,
                            url
                        }
                    },
                    file_pdf_id {
                        asset->{
                            _id,
                            url
                        }
                    }
                },
                open_in_new_tab
            }
        },

        // Story Vision Mission Content
        story_vision_mission {
            items[] {
                icon_type,
                title_en,
                title_id,
                description_en,
                description_id
            }
        },

        // Why It Works Content
        why_it_works {
            section_title_en,
            section_title_id,
            features[] {
                title_en,
                title_id,
                description_en,
                description_id,
                image {
                    asset->{
                        _id,
                        url
                    }
                },
                image_position,
                checklist_items[] {
                    text_en,
                    text_id
                },
                cta_button {
                    text_en,
                    text_id,
                    link
                }
            }
        },

        // Features Content
        features_content {
            mobile_features[] {
                section_title_en,
                section_title_id,
                type_features,
                mobile_icon {
                    asset->{
                        _id,
                        url
                    }
                },
                features_list[]->{
                    _id,
                    feature_name {
                        en,
                        id
                    },
                    feature_description {
                        en,
                        id
                    },
                    feature_icon {
                        asset->{
                            _id,
                            url
                        }
                    }
                }
            }
        },

        // Testimonial Content
        testimonial_content {
            testimonials[] {
                title_en,
                title_id,
                quote_en,
                quote_id,
                company_en,
                company_id,
                client_name,
                client_role_en,
                client_role_id,
                company_logo {
                    asset->{
                        _id,
                        url
                    }
                }
            }
        },

        // FAQ Content
        faq_content {
            title_en,
            title_id,
            description_en,
            description_id,
            faq_items[] {
                question_en,
                question_id,
                answer_en,
                answer_id
            },
            side_image {
                asset->{
                    _id,
                    url
                }
            }
        },

        // Blog Content
        blog_content {
            badge_text_en,
            badge_text_id,
            title_en,
            title_id,
            list_blog[]->{
                _id,
                title {
                    en,
                    id
                },
                slug {
                    current,
                    _type
                },
                excerpt {
                    en,
                    id
                },
                date,
                category {
                    en,
                    id
                },
                author,
                image {
                    asset->{
                        _id,
                        url
                    },
                    alt {
                        en,
                        id
                    }
                },
                content {
                    en,
                    id
                },
                seo {
                    metaTitle {
                        en,
                        id
                    },
                    metaDescription {
                        en,
                        id
                    },
                    keywords {
                        en,
                        id
                    }
                },
                featured,
                status
            }
        },

        // Request Demo Content
        request_demo_content {
            badge_text_en,
            badge_text_id,
            title_lines {
                text_en,
                text_id
            },
            cta_button {
                text_en,
                text_id
            },
            background_image {
                asset->{
                    _id,
                    url
                }
            }
        },

        // Pricing Content
        pricing_content {
            table_headers {
                no_column {
                    en,
                    id
                },
                feature_column {
                    en,
                    id
                }
            },
            feature_rows[] {
                feature_name {
                    en,
                    id
                },
                feature_type
            },
            pricing_plans[]->{
                _id,
                plan_name {
                    en,
                    id
                },
                price_per_user,
                setup_fee,
                main_features[] {
                    en,
                    id
                },
                flex_user,
                custom_features[] {
                    feature_name {
                        en,
                        id
                    },
                    feature_value {
                        en,
                        id
                    }
                }
            },
            footer_note {
                en,
                id
            }
        },

        // Support Section Content
        support_section_content {
            support_plans[]->{
                _id,
                category_name {
                    en,
                    id
                },
                category_description {
                    en,
                    id
                },
                icon_type,
                faqs[] {
                    question {
                        en,
                        id
                    },
                    answer {
                        en,
                        id
                    }
                }
            },
            bottom_cta {
                show_cta,
                cta_title {
                    en,
                    id
                },
                cta_description {
                    en,
                    id
                },
                cta_button {
                    button_text {
                        en,
                        id
                    },
                    button_link
                }
            },
            empty_state {
                title {
                    en,
                    id
                },
                description {
                    en,
                    id
                }
            }
        },

        // Privacy Policy Section Content
        privacy_policy_section_content {
            privacy_policy->{
                _id,
                title {
                    en,
                    id
                },
                content {
                    en,
                    id
                },
                last_updated
            }
        },

        // Terms and Conditions Section Content
        terms_and_conditions_section_content {
            terms_and_conditions->{
                _id,
                title {
                    en,
                    id
                },
                content {
                    en,
                    id
                },
                last_updated
            }
        },

        // FAQ Section Content
        faq_section_content {
            category_tabs[] {
                category_key,
                category_label {
                    en,
                    id
                },
                list_faqs[]->{
                    _id,
                    question {
                        en,
                        id
                    },
                    answer {
                        en,
                        id
                    }
                }
            },
            footer_note {
                en,
                id
            }
        },

        // Blog List Section Content
        blog_list_section_content {
            title_section {
                en,
                id
            },
            desc_section {
                en,
                id
            },
            list_blog[]->{
                _id,
                title {
                    en,
                    id
                },
                slug {
                    current,
                    _type
                },
                excerpt {
                    en,
                    id
                },
                date,
                category {
                    en,
                    id
                },
                author,
                image {
                    asset->{
                        _id,
                        url
                    },
                    alt {
                        en,
                        id
                    }
                },
                content {
                    en,
                    id
                },
                seo {
                    metaTitle {
                        en,
                        id
                    },
                    metaDescription {
                        en,
                        id
                    },
                    keywords {
                        en,
                        id
                    }
                },
                featured,
                status
            }
        }
    }`;

    try {
        const result = await client.fetch(query, { sectionId }, { cache: "no-store" });
        console.log("Section data for ID " + sectionId, result);
        return result || null;
    } catch (error) {
        console.error("Error fetching section data:", error);
        return null;
    }
}
