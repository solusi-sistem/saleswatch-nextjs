import { client } from './sanity.realtime';
import type { TermsConditionsSection } from '@/types/termsConditions';

const TERMS_CONDITIONS_QUERY = `
  *[_type == "section" && type_section == "termsAndConditionsSection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    "terms_and_conditions_content": coalesce(
      terms_and_conditions_content,
      terms_conditions_content,
      termsAndConditions,
      content
    ) {
      "items": coalesce(items, termsAndConditionsItems, list)[]-> {
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

const TERMS_CONDITIONS_QUERY_SIMPLE = `
  *[_type == "section" && type_section == "termsAndConditionsSection" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    ...,
    "terms_and_conditions_content": {
      "items": *[_type == "list_terms_and_conditions" && published_at == true] | order(_createdAt asc) {
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

export async function getTermsConditionsData(): Promise<TermsConditionsSection | null> {
  try {
    let data = await client.fetch<TermsConditionsSection>(TERMS_CONDITIONS_QUERY);
    
    if (!data?.terms_and_conditions_content?.items || data.terms_and_conditions_content.items.length === 0) {
      console.log('Trying alternative query...');
      data = await client.fetch<TermsConditionsSection>(TERMS_CONDITIONS_QUERY_SIMPLE);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Terms and Conditions data:', error);
    return null;
  }
}

export function listenToTermsConditionsChanges(
  callback: (data: TermsConditionsSection) => void
) {
  const subscription = client
    .listen<TermsConditionsSection>(TERMS_CONDITIONS_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Terms and Conditions subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}