export interface LayoutData {
  _id?: string;
  name_layout?: string;
  header?: HeaderData;
  footer?: FooterData;
}

export interface HeaderData {
  logo?: any;
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
  logo_footer?: any;
  desc_footer?: {
    desc_footer_en?: string;
    desc_footer_id?: string;
  };
  copyright?: string;
  links?: any[];
}