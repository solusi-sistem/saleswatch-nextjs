export interface HeaderData {
  logo_header?: {
    logo?: any;
    logo_teks?: any;
  };
  menu_header?: MenuHeaderItem[];
  cta_buttons?: CTAButtons;
  language_switcher?: LanguageSwitcher;
}

export interface MenuHeaderItem {
  label_menu?: {
    label_menu_en?: string;
    label_menu_id?: string;
  };
  path_menu?: string;
  show_menu?: boolean;
}

export interface CTAButtons {
  request_demo_button?: ButtonConfig;
  login_button?: LoginButtonConfig;
}

export interface ButtonConfig {
  text_en?: string;
  text_id?: string;
  show_button?: boolean;
}

export interface LoginButtonConfig extends ButtonConfig {
  login_url?: string;
}

export interface LanguageSwitcher {
  show_language_switcher?: boolean;
}

export interface FooterData {
  logo_footer?: {
    logo?: any;
    logo_teks?: any;
  };
  desc_footer?: {
    desc_footer_en?: string;
    desc_footer_id?: string;
  };
  social_media?: SocialMediaItem[];
  footer_columns?: FooterColumn[];
  footer_cta?: FooterCTA;
  scroll_to_top?: ScrollToTop;
  copyright?: string;
}

export interface SocialMediaItem {
  platform?: string;
  url?: string;
  icon?: any;
  show_social_media?: boolean;
}

export interface FooterColumn {
  column_title?: {
    title_en?: string;
    title_id?: string;
  };
  links?: FooterLink[];
  show_column?: boolean;
}

export interface FooterLink {
  label?: {
    label_en?: string;
    label_id?: string;
  };
  path?: string;
  show_link?: boolean;
}

export interface FooterCTA {
  title?: {
    title_en?: string;
    title_id?: string;
  };
  show_request_demo?: boolean;
  show_login?: boolean;
}

export interface ScrollToTop {
  show_button?: boolean;
}

// Main LayoutData interface
export interface LayoutData {
  _id?: string;
  name_layout?: string;
  header?: HeaderData;
  footer?: FooterData;
}