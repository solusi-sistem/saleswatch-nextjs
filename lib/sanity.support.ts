import { client } from './sanity.realtime';
import type { SupportSection } from '@/types/support';

const SUPPORT_QUERY = `
  *[_type == "section" && type_section == "supportSection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    "support_content": coalesce(
      support_content,
      support,
      content
    ) {
      "items": coalesce(items, supportItems, list)[]-> {
        _id,
        _type,
        key,
        title,
        icon {
          asset-> {
            _id,
            url
          }
        },
        support_items[] {
          _key,
          title_en,
          title_id,
          content_en,
          content_id
        },
        status
      }
    }
  }
`;

const SUPPORT_QUERY_SIMPLE = `
  *[_type == "section" && type_section == "supportSection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    ...,
    "support_content": {
      "items": *[_type == "list_support" && status == "published"] | order(_createdAt asc) {
        _id,
        _type,
        key,
        title,
        icon {
          asset-> {
            _id,
            url
          }
        },
        support_items[] {
          _key,
          title_en,
          title_id,
          content_en,
          content_id
        },
        status
      }
    }
  }
`;

export async function getSupportData(): Promise<SupportSection | null> {
  try {
    let data = await client.fetch<SupportSection>(SUPPORT_QUERY);
    
    if (!data?.support_content?.items || data.support_content.items.length === 0) {
      data = await client.fetch<SupportSection>(SUPPORT_QUERY_SIMPLE);
    }
    
    return data;
  } catch (error) {
    return null;
  }
}

export function listenToSupportChanges(
  callback: (data: SupportSection) => void
) {
  const subscription = client
    .listen<SupportSection>(SUPPORT_QUERY)
    .subscribe({
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