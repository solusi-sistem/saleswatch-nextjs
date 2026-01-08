export interface ChecklistItem {
  text_en: string;
  text_id: string;
}

export interface CtaButton {
  text_en: string;
  text_id: string;
  link: string;
}

export interface WhyItWorksFeature {
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
  image_position: 'left' | 'right';
  checklist_items: ChecklistItem[];
  cta_button: CtaButton;
}

export interface WhyItWorksContent {
  section_title_en: string;
  section_title_id: string;
  features: WhyItWorksFeature[];
}

export interface WhyItWorksSection {
  _id: string;
  name_section: string;
  type_section: 'whyItWorks';
  published_at: boolean;
  why_it_works: WhyItWorksContent;
}