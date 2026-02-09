import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function getLayoutData() {
  try {
    // console.log('🔍 Fetching layout data from Sanity...');

    const data = await client.fetch(`
      *[_type == "layout"][0] {
        _id,
        name_layout,
        header {
          logo,
          menu_header[] {
            label_menu {
              label_menu_en,
              label_menu_id
            },
            path_menu,
            show_menu
          },
          cta_buttons {
            request_demo_button {
              text_en,
              text_id,
              show_button
            },
            login_button {
              text_en,
              text_id,
              login_url,
              show_button
            }
          },
          language_switcher {
            show_language_switcher
          }
        },
        footer {
          logo_footer,
          desc_footer {
            desc_footer_en,
            desc_footer_id
          }
        }
      }
    `);

    // console.log('✅ Layout data fetched:', data);
    // console.log('📸 Header Logo data:', data?.header?.logo);
    // console.log('🖼️ Footer Logo data:', data?.footer?.logo_footer);

    return data;
  } catch (error) {
    // console.error('❌ Error fetching layout data:', error);
    return null;
  }
}
