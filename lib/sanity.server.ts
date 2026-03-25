import { createClient } from "next-sanity";

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // For server-side, FALSE is better because Vercel caches it anyway
  token: process.env.SANITY_API_TOKEN, 
});

// to do:
const MASTER_PAGE_QUERY = `
{
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
      ...
    }
  },

  "story": *[_type == "section" && type_section == "storyVisionMission" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    story_vision_mission {
      items[] { icon_type, title_en, title_id, description_en, description_id }
    }
  },

  "requestDemo": *[_type == "section" && type_section == "requestDemo" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    request_demo_content {
      badge_text_en,
      badge_text_id,
      title_lines[] { text_en, text_id },
      cta_button { text_en, text_id },
      background_image { asset-> { _id, url } }
    }
  },

  "faq": *[_type == "section" && type_section == "faq" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    faq_content {
      badge_text_en,
      badge_text_id,
      title_en,
      title_id,
      description_en,
      description_id,
      faq_items[] { question_en, question_id, answer_en, answer_id },
      side_image { asset-> { _id, url } }
    }
  },

  "testimonials": *[_type == "section" && type_section == "testimonial" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    testimonial_content {
      testimonials[] {
        title_en, title_id, quote_en, quote_id, company_en, company_id, 
        client_name, client_role_en, client_role_id, 
        company_logo { asset-> { _id, url } }
      }
    }
  },

  "whyItWorks": *[_type == "section" && type_section == "whyItWorks" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    why_it_works {
      section_title_en,
      section_title_id,
      features[] {
        title_en, title_id, description_en, description_id,
        image { asset-> { _id, url } },
        image_position,
        checklist_items[] { text_en, text_id },
        cta_button { text_en, text_id, link }
      }
    }
  },

  "supportData": *[_type == "section" && type_section == "supportSection" && published_at == true][0] {
    _id,
    "support_content": coalesce(support_content, support, content) {
      "items": coalesce(items, supportItems, list)[]-> {
        _id, _type, key, title, 
        icon { asset-> { _id, url } },
        support_items[] { _key, title_en, title_id, content_en, content_id },
        status
      }
    }
  },

  "termsData": *[_type == "section" && type_section == "termsAndConditionsSection" && published_at == true][0] {
    _id,
    "terms_and_conditions_content": coalesce(terms_and_conditions_content, terms_conditions_content, termsAndConditions, content) {
      "items": coalesce(items, termsAndConditionsItems, list)[]-> {
        _id, _type, title, icon_type { asset-> { _id, url } },
        published_at, content_en, content_id
      }
    }
  },

  "privacyData": *[_type == "section" && type_section == "privacyPolicySection" && published_at == true][0] {
    _id,
    "privacy_policy_content": coalesce(privacy_policy_content, privacy_policy, privacyPolicy, content) {
      "items": coalesce(items, privacyPolicyItems, list)[]-> {
        _id, _type, title, icon_type { asset-> { _id, url } },
        published_at, content_en, content_id
      }
    }
  }
}
`;

export async function masterServerFetch<T>(query: string, params: any = {}): Promise<T | null> {
  try {
    const data = await serverClient.fetch<T>(query, params, {
      next: { revalidate: 86400 } // Use this to bake the page for 24 hours
      // cache: 'no-store' // Use this if you want it fresh every single time
    });

    if (!data) {
      console.warn(`⚠️ Query returned no data for slug: ${params.slug || 'N/A'}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Sanity Server Fetch Critical Error:", error);
    
    // Returning null allows page.tsx to show a "Friendly" error instead of a crash
    return null;
  }
}
