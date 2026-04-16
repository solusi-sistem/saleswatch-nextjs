import { createClient } from "next-sanity";
import { proxyFetch } from "@/lib/sanityFetcher";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import type { LayoutData } from "@/types";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
  // token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source).auto('format').fit('max').withConfig({ host: 'img.saleswatch.id' });
}

// ==========================================
// MASTER QUERY
// ==========================================
// Consolidates layout, page data, and specific sections in one efficient fetch.
export const MASTER_QUERY = `{
  "layout": *[_type == "layout"][0] {
    _id,
    name_layout,
    header {
      logo_header { logo, logo_teks },
      menu_header[] {
        label_menu { label_menu_en, label_menu_id },
        path_menu,
        show_menu
      },
      cta_buttons {
        request_demo_button { text_en, text_id, show_button },
        login_button { text_en, text_id, login_url, show_button }
      },
      language_switcher { show_language_switcher }
    },
    footer {
      logo_footer { logo, logo_teks },
      desc_footer { desc_footer_en, desc_footer_id },
      social_media[] { platform, url, icon, show_social_media },
      footer_columns[] {
        column_title { title_en, title_id },
        links[] { label { label_en, label_id }, path, show_link },
        show_column
      },
      footer_cta {
        title { title_en, title_id },
        show_request_demo,
        show_login
      },
      scroll_to_top { show_button }
    }
  },

  "pageData": *[_type == "page" && slug_page.current == $slug][0] {
    _id,
    _type,
    name_page,
    slug_page,
    published_at,
    seo_title { seo_title_en, seo_title_id },
    seo_description { seo_description_en, seo_description_id },
    seo_keyword { seo_keyword_en, seo_keyword_id },
    seo_icon,
    section_list[]-> {
      _id,
      _type,
      name_section,
      type_section,
      published_at,
      hero_content {
        title_lines { text_en, text_id },
        description_lines { text_en, text_id },
        speech_bubble {
          text_lines_en, text_lines_id,
          character_image { asset->{ _id, url } }
        },
        cta_button { text_en, text_id },
        slider_images[] { asset->{ _id, url } },
        statistics[] { number, label_en, label_id },
        background_video { asset->{ _id, url } }
      },
      hero_umum_content { title_en, title_id, description_en, description_id },
      support_header_content {
        title { en, id },
        description { en, id },
        buttons[] {
          button_type, icon_type,
          button_text { en, id },
          link_url,
          file_pdf {
            file_pdf_en { asset->{ _id, url } },
            file_pdf_id { asset->{ _id, url } }
          },
          open_in_new_tab
        }
      },
      story_vision_mission {
        items[] { icon_type, title_en, title_id, description_en, description_id }
      },
      why_it_works {
        section_title_en, section_title_id,
        features[] {
          title_en, title_id, description_en, description_id,
          image { asset->{ _id, url } },
          image_position,
          checklist_items[] { text_en, text_id },
          cta_button { text_en, text_id, link }
        }
      },
      features_content {
        logo_text,
        logo_features { asset->{ _id, url } },
        logo_teks_features,
        suite_text,
        mobile_features[] {
          section_title_en, section_title_id, type_features,
          mobile_icon { asset->{ _id, url } },
          features_list[]->{
            _id, title { en, id }, description { en, id },
            icon { asset->{ _id, url }, alt{ en, id } },
            status
          }
        }
      },
      testimonial_content {
        testimonials[] {
          title_en, title_id, quote_en, quote_id, company_en, company_id,
          client_name, client_role_en, client_role_id,
          company_logo { asset->{ _id, url } }
        }
      },
      about_content {
        title_en, title_id, description_en, description_id,
        about_items[] { question_en, question_id, answer_en, answer_id },
        side_image { asset->{ _id, url } }
      },
      blog_content {
        badge_text_en, badge_text_id, title_en, title_id,
        list_blog[]->{
          _id, title { en, id }, slug { current, _type }, excerpt { en, id },
          date, category { en, id }, author,
          image { asset->{ _id, url }, alt { en, id } },
          content { en, id },
          seo { metaTitle { en, id }, metaDescription { en, id }, keywords { en, id } },
          featured, status
        }
      },
      request_demo_content {
        badge_text_en, badge_text_id,
        title_lines[] { text_en, text_id },
        cta_button { text_en, text_id },
        background_image { asset->{ _id, url } }
      },
      pricing_content {
        table_headers { no_column { en, id }, feature_column { en, id } },
        feature_rows[] { _key, feature_name { en, id }, feature_type },
        pricing_plans[]->{
          _id, order, plan_name, is_popular, price { en, id },
          setup_fee { en, id }, main_features { en, id }, flex_user { en, id },
          cta_button { text_en, text_id, link },
          styling { background_color, border_color }, status
        } | order(order asc),
        footer_note { en, id }
      },
      support_section_content {
        support_plans[]->{
          _id, key, title { en, id }, icon,
          support_items[] { _key, title_en, title_id, content_en, content_id }
        },
        bottom_cta {
          show_cta, cta_title { en, id }, cta_description { en, id },
          cta_button { button_text { en, id }, button_link }
        },
        empty_state { title { en, id }, description { en, id } }
      },
      privacy_policy_section_content {
        privacy_policy[]->{
          _id, title { en, id },
          icon_type { asset->{ _id, url } },
          content_en, content_id, published_at
        }
      },
      terms_and_conditions_section_content {
        terms_and_conditions[]->{
          _id, title { en, id },
          icon_type { asset->{ _id, url } },
          content_en, content_id, published_at
        }
      },
      faq_section_content {
        title_en, title_id, description_en, description_id,
        category_tabs[] {
          category_key, category_label { en, id },
          list_faqs[]->{ _id, question { en, id }, answer { en, id } }
        },
        footer_note { en, id }
      },
      blog_list_section_content {
        title_section { en, id },
        desc_section { en, id },
        post_per_page, tampilkan_semua,
        list_blogs[]->{
          _id, title { en, id }, slug { current, _type }, excerpt { en, id }, date,
          category->{ _id, name { en, id }, slug { current, _type }, description { en, id }, status },
          author, image { asset->{ _id, url }, alt { en, id } }, content { en, id },
          tags, seo { metaTitle { en, id }, metaDescription { en, id }, keywords { en, id } },
          featured, status
        }
      }
    }
  },

  "storyVisionMission": *[_type == "section" && type_section == "storyVisionMission" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    story_vision_mission { items[] { icon_type, title_en, title_id, description_en, description_id } }
  },

  "requestDemo": *[_type == "section" && type_section == "requestDemo" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    request_demo_content {
        badge_text_en, badge_text_id,
        title_lines[] { text_en, text_id },
        cta_button { text_en, text_id },
        background_image { asset->{ _id, url } }
    }
  },

  "faq": *[_type == "section" && type_section == "faq" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    faq_content {
        badge_text_en, badge_text_id, title_en, title_id, description_en, description_id,
        faq_items[] { question_en, question_id, answer_en, answer_id },
        side_image { asset->{ _id, url } }
    }
  },

  "testimonials": *[_type == "section" && type_section == "testimonial" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    testimonial_content {
        testimonials[] {
            title_en, title_id, quote_en, quote_id, company_en, company_id,
            client_name, client_role_en, client_role_id,
            company_logo { asset->{ _id, url } }
        }
    }
  },

  "whyItWorks": *[_type == "section" && type_section == "whyItWorks" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    why_it_works {
        section_title_en, section_title_id,
        features[] {
            title_en, title_id, description_en, description_id,
            image { asset->{ _id, url } },
            image_position,
            checklist_items[] { text_en, text_id },
            cta_button { text_en, text_id, link }
        }
    }
  },

  "supportData": *[_type == "section" && type_section == "supportSection" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    "support_content": coalesce(support_content, support, content) {
      "items": coalesce(items, supportItems, list)[]-> {
        _id, _type, key, title, icon { asset-> { _id, url } },
        support_items[] { _key, title_en, title_id, content_en, content_id },
        status
      }
    }
  },

  "termsData": *[_type == "section" && type_section == "termsAndConditionsSection" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    "terms_and_conditions_content": coalesce(terms_and_conditions_content, terms_conditions_content, termsAndConditions, content) {
      "items": coalesce(items, termsAndConditionsItems, list)[]-> {
        _id, _type, title, icon_type { asset-> { _id, url } },
        published_at, content_en, content_id
      }
    }
  },

  "privacyData": *[_type == "section" && type_section == "privacyPolicySection" && published_at == true][0] {
    _id, name_section, type_section, published_at,
    "privacy_policy_content": coalesce(privacy_policy_content, privacy_policy, privacyPolicy, content) {
      "items": coalesce(items, privacyPolicyItems, list)[]-> {
        _id, _type, title, icon_type { asset-> { _id, url } },
        published_at, content_en, content_id
      }
    }
  }
}`;

// ==========================================
// DATA FETCHING
// ==========================================

export const getLayoutData = cache(async (slug?: string): Promise<any> => {
  try {
    // If slug is provided, we fetch the full master data (layout + page + sections)
    // If not, we still fetch the master data but without a specific page slug (pageData will be null)
    const params = { slug: slug || "" };

    if (typeof window === "undefined") {
      const data = await client.fetch(MASTER_QUERY, params, {
        next: {
          revalidate: 86400,
          tags: ["layout", slug ? "page-data" : ""].filter(Boolean),
        },
      });
      // If we only need the layout (compatible with old calls), we can return it or the full data.
      // Most components expect the 'layout' property if they are updated,
      // but to maintain compatibility we could check if they only want the layout object.
      return data;
    }

    const data = await proxyFetch<any>(MASTER_QUERY, params);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
});

/**
 * @deprecated Use getLayoutData(slug) instead to fetch everything in one go.
 */
export const getMasterData = getLayoutData;

export function listenToLayoutChanges(callback: (data: LayoutData) => void) {
  // Real-time listeners are disabled
  console.log("Layout listener disabled.");
  return () => {};
}
