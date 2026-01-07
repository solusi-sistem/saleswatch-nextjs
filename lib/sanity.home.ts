import { client } from './sanity.realtime';
import type { StoryVisionMissionSection, RequestDemoSection, FaqSection } from '@/types/home';

// ==========================================
// STORY VISION MISSION
// ==========================================
const STORY_VISION_MISSION_QUERY = `
  *[_type == "section" && type_section == "storyVisionMission" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    story_vision_mission {
      items[] {
        icon_type,
        title_en,
        title_id,
        description_en,
        description_id
      }
    }
  }
`;

export async function getStoryVisionMissionData(): Promise<StoryVisionMissionSection | null> {
  try {
    const data = await client.fetch<StoryVisionMissionSection>(STORY_VISION_MISSION_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching Story Vision Mission data:', error);
    return null;
  }
}

export function listenToStoryVisionMissionChanges(
  callback: (data: StoryVisionMissionSection) => void
) {
  const subscription = client
    .listen<StoryVisionMissionSection>(STORY_VISION_MISSION_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Story Vision Mission subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}

// ==========================================
// REQUEST DEMO
// ==========================================
const REQUEST_DEMO_QUERY = `
  *[_type == "section" && type_section == "requestDemo" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    request_demo_content {
      badge_text_en,
      badge_text_id,
      title_lines[] {
        text_en,
        text_id
      },
      cta_button {
        text_en,
        text_id
      },
      background_image {
        asset-> {
          _id,
          url
        }
      }
    }
  }
`;

export async function getRequestDemoData(): Promise<RequestDemoSection | null> {
  try {
    const data = await client.fetch<RequestDemoSection>(REQUEST_DEMO_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching Request Demo data:', error);
    return null;
  }
}

export function listenToRequestDemoChanges(
  callback: (data: RequestDemoSection) => void
) {
  const subscription = client
    .listen<RequestDemoSection>(REQUEST_DEMO_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Request Demo subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}

// ==========================================
// FAQ
// ==========================================
const FAQ_QUERY = `
  *[_type == "section" && type_section == "faq" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    faq_content {
      badge_text_en,
      badge_text_id,
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
        asset-> {
          _id,
          url
        }
      }
    }
  }
`;

export async function getFaqData(): Promise<FaqSection | null> {
  try {
    const data = await client.fetch<FaqSection>(FAQ_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    return null;
  }
}

export function listenToFaqChanges(
  callback: (data: FaqSection) => void
) {
  const subscription = client
    .listen<FaqSection>(FAQ_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('FAQ subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}