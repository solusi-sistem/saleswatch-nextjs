import { client } from "@/lib/sanity";
import { PageData } from "@/types/page";
import { groq } from "next-sanity";

// Fungsi untuk fetch data page berdasarkan slug
export async function getPageData(slug: string): Promise<PageData | null> {
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
            _id,
            _type,
            name_section,
            type_section,
            published_at
        }
    }`;

    try {
        const result = await client.fetch(query, { current_slug }, { cache: "no-store" });
        // console.log("result slug " + current_slug, result);
        return result || null;
    } catch (error) {
        console.error("Error fetching page data:", error);
        return null;
    }
}