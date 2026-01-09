import { client } from './sanity.realtime';
import type { PrivacyPolicySection } from '@/types/privacyPolicy';

// Updated query with multiple fallback field names
const PRIVACY_POLICY_QUERY = `
  *[_type == "section" && type_section == "privacyPolicySection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    "privacy_policy_content": coalesce(
      privacy_policy_content,
      privacy_policy,
      privacyPolicy,
      content
    ) {
      "items": coalesce(items, privacyPolicyItems, list)[]-> {
        _id,
        _type,
        title,
        icon_type {
          asset-> {
            _id,
            url
          }
        },
        published_at,
        content_en,
        content_id
      }
    }
  }
`;

// Alternative simpler query if the above doesn't work
const PRIVACY_POLICY_QUERY_SIMPLE = `
  *[_type == "section" && type_section == "privacyPolicySection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    ...,
    "privacy_policy_content": {
      "items": *[_type == "list_privacy_policy" && published_at == true] | order(_createdAt asc) {
        _id,
        _type,
        title,
        icon_type {
          asset-> {
            _id,
            url
          }
        },
        published_at,
        content_en,
        content_id
      }
    }
  }
`;

export async function getPrivacyPolicyData(): Promise<PrivacyPolicySection | null> {
  try {
    // Try the main query first
    let data = await client.fetch<PrivacyPolicySection>(PRIVACY_POLICY_QUERY);
    
    // If privacy_policy_content is null or empty, try the simple query
    if (!data?.privacy_policy_content?.items || data.privacy_policy_content.items.length === 0) {
      console.log('Trying alternative query...');
      data = await client.fetch<PrivacyPolicySection>(PRIVACY_POLICY_QUERY_SIMPLE);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Privacy Policy data:', error);
    return null;
  }
}

export function listenToPrivacyPolicyChanges(
  callback: (data: PrivacyPolicySection) => void
) {
  const subscription = client
    .listen<PrivacyPolicySection>(PRIVACY_POLICY_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Privacy Policy subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}