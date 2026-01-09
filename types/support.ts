export interface SupportTitle {
  en: string;
  id: string;
}

export interface SupportIcon {
  asset?: {
    _id: string;
    url: string;
  };
}

export interface SupportBlock {
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

export interface SupportSubItem {
  _key: string;
  title_en: string;
  title_id: string;
  content_en: SupportBlock[];
  content_id: SupportBlock[];
}

export interface SupportItem {
  _id: string;
  _type: 'list_support';
  key: string;
  title: SupportTitle;
  icon?: SupportIcon;
  support_items: SupportSubItem[];
  status: 'published' | 'draft' | 'archived';
}

export interface SupportSection {
  _id: string;
  name_section: string;
  type_section: 'supportSection';
  published_at: boolean;
  support_content: {
    items: SupportItem[];
  };
}