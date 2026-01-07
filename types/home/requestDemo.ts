export interface RequestDemoTitleLine {
  text_en: string;
  text_id: string;
}

export interface RequestDemoButton {
  text_en: string;
  text_id: string;
}

export interface RequestDemoContent {
  badge_text_en: string;
  badge_text_id: string;
  title_lines: RequestDemoTitleLine[];
  cta_button: RequestDemoButton;
  background_image?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface RequestDemoSection {
  _id: string;
  name_section: string;
  type_section: 'requestDemo';
  published_at: boolean;
  request_demo_content: RequestDemoContent;
}
