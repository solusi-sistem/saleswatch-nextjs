import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { LayoutData } from '@/types';

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

const LAYOUT_QUERY = `
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
      },
      social_media[] {
        platform,
        url,
        icon,
        show_social_media
      },
      footer_columns[] {
        column_title {
          title_en,
          title_id
        },
        links[] {
          label {
            label_en,
            label_id
          },
          path,
          show_link
        },
        show_column
      },
      footer_cta {
        title {
          title_en,
          title_id
        },
        show_request_demo,
        show_login
      },
      scroll_to_top {
        show_button
      }
    }
  }
`;

export async function getLayoutData(): Promise<LayoutData | null> {
  try {
    const data = await client.fetch<LayoutData>(LAYOUT_QUERY);
    return data;
  } catch (error) {
    return null;
  }
}

export function listenToLayoutChanges(callback: (data: LayoutData) => void) {
  const subscription = client.listen<LayoutData>(LAYOUT_QUERY).subscribe({
    next: (update) => {
      if (update.result) {
        callback(update.result);
      }
    },
    error: (err) => {
    },
  });

  return () => subscription.unsubscribe();
}