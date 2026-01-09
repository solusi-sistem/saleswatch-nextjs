export interface PrivacyPolicyTitle {
  en: string;
  id: string;
}

export interface PrivacyPolicyIcon {
  asset?: {
    _id: string;
    url: string;
  };
}

export interface PrivacyPolicyBlock {
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
  // For image blocks
  asset?: {
    _id: string;
    url: string;
  };
  alt?: string;
  caption?: string;
}

export interface PrivacyPolicyItem {
  _id: string;
  _type: 'list_privacy_policy';
  title: PrivacyPolicyTitle;
  icon_type?: PrivacyPolicyIcon;
  published_at: boolean;
  content_en: PrivacyPolicyBlock[];
  content_id: PrivacyPolicyBlock[];
}

export interface PrivacyPolicySection {
  _id: string;
  name_section: string;
  type_section: 'privacyPolicySection';
  published_at: boolean;
  privacy_policy_content: {
    items: PrivacyPolicyItem[];
  };
}