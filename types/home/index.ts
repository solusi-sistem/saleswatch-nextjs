// types/home/index.ts
export * from './storyVisionMission';
export * from './requestDemo';
export * from './faq';

import type { StoryVisionMissionSection } from './storyVisionMission';
import type { RequestDemoSection } from './requestDemo';
import type { FaqSection } from './faq';

// Union type untuk semua section types
export type HomeSection = 
  | StoryVisionMissionSection
  | RequestDemoSection
  | FaqSection
  // | HeroSection
  // | AboutSection
  // | WhyItWorksSection
  // | BlogSection
  ;

export interface HomePage {
  _id: string;
  name_page: string;
  sections: HomeSection[];
}