export interface TermsConditionsTitle {
  en: string;
  id: string;
}

export interface TermsConditionsIcon {
  asset?: {
    _id: string;
    url: string;
  };
}

export interface TermsConditionsBlock {
  _type: 'block' | 'image';
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
  listItem?: string;
  level?: number;
  asset?: {
    _id: string;
    url: string;
  };
  alt?: string;
  caption?: string;
}

export interface TermsConditionsItem {
  _id: string;
  _type: 'list_terms_and_conditions';
  title: TermsConditionsTitle;
  icon_type?: TermsConditionsIcon;
  published_at: boolean;
  content_en: TermsConditionsBlock[];
  content_id: TermsConditionsBlock[];
}

export interface TermsConditionsSection {
  _id: string;
  name_section: string;
  type_section: 'termsAndConditionsSection';
  published_at: boolean;
  terms_and_conditions_content: {
    items: TermsConditionsItem[];
  };
}