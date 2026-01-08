import { client } from './sanity.realtime';
import type { 
  StoryVisionMissionSection, 
  RequestDemoSection, 
  FaqSection, 
  TestimonialSection,
  WhyItWorksSection 
} from '@/types/home';

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

// ==========================================
// TESTIMONIAL
// ==========================================
const TESTIMONIAL_QUERY = `
  *[_type == "section" && type_section == "testimonial" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
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
          asset-> {
            _id,
            url
          }
        }
      }
    }
  }
`;

export async function getTestimonialData(): Promise<TestimonialSection | null> {
  try {
    const data = await client.fetch<TestimonialSection>(TESTIMONIAL_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching Testimonial data:', error);
    return null;
  }
}

export function listenToTestimonialChanges(
  callback: (data: TestimonialSection) => void
) {
  const subscription = client
    .listen<TestimonialSection>(TESTIMONIAL_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Testimonial subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}

// ==========================================
// WHY IT WORKS
// ==========================================
const WHY_IT_WORKS_QUERY = `
  *[_type == "section" && type_section == "whyItWorks" && published_at == true][0] {
    _id,
    name_section,
    type_section,
    published_at,
    why_it_works {
      section_title_en,
      section_title_id,
      features[] {
        title_en,
        title_id,
        description_en,
        description_id,
        image {
          asset-> {
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
    }
  }
`;

export async function getWhyItWorksData(): Promise<WhyItWorksSection | null> {
  try {
    const data = await client.fetch<WhyItWorksSection>(WHY_IT_WORKS_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching Why It Works data:', error);
    return null;
  }
}

export function listenToWhyItWorksChanges(
  callback: (data: WhyItWorksSection) => void
) {
  const subscription = client
    .listen<WhyItWorksSection>(WHY_IT_WORKS_QUERY)
    .subscribe({
      next: (update) => {
        if (update.result) {
          callback(update.result);
        }
      },
      error: (err) => {
        console.error('Why It Works subscription error:', err);
      },
    });

  return () => subscription.unsubscribe();
}