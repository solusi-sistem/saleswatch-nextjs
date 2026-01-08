export interface TestimonialItem {
  title_en: string;
  title_id: string;
  quote_en: string;
  quote_id: string;
  company_en: string;
  company_id: string;
  client_name: string;
  client_role_en: string;
  client_role_id: string;
  company_logo?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface TestimonialContent {
  testimonials: TestimonialItem[];
}

export interface TestimonialSection {
  _id: string;
  name_section: string;
  type_section: 'testimonial';
  published_at: boolean;
  testimonial_content: TestimonialContent;
}