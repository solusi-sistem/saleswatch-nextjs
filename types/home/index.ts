export * from './storyVisionMission';
export * from './requestDemo';
export * from './faq';
export * from './testimonial';
export * from './whyItWorks';

import type { StoryVisionMissionSection } from './storyVisionMission';
import type { RequestDemoSection } from './requestDemo';
import type { FaqSection } from './faq';
import type { TestimonialSection } from './testimonial';
import type { WhyItWorksSection } from './whyItWorks';

// Union type untuk semua section types
export type HomeSection = 
  | StoryVisionMissionSection
  | RequestDemoSection
  | FaqSection
  | TestimonialSection
  | WhyItWorksSection;

export interface HomePage {
  _id: string;
  name_page: string;
  sections: HomeSection[];
}