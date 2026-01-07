export interface FaqItem {
  question_en: string;
  question_id: string;
  answer_en: string;
  answer_id: string;
}

export interface FaqContent {
  badge_text_en: string;
  badge_text_id: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  faq_items: FaqItem[];
  side_image?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface FaqSection {
  _id: string;
  name_section: string;
  type_section: 'faq';
  published_at: boolean;
  faq_content: FaqContent;
}