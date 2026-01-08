export interface TitleLine {
  text_en: string;
  text_id: string;
}

export interface DescriptionLine {
  text_en: string;
  text_id: string;
}

export interface SpeechBubble {
  text_lines_en: string[];
  text_lines_id: string[];
  character_image?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface CtaButton {
  text_en: string;
  text_id: string;
}

export interface Statistic {
  number: string;
  label_en: string;
  label_id: string;
}

export interface HeroContent {
  title_lines: TitleLine;
  description_lines: DescriptionLine;
  speech_bubble: SpeechBubble;
  cta_button: CtaButton;
  slider_images: Array<{
    asset?: {
      _id: string;
      url: string;
    };
  }>;
  statistics: Statistic[];
  background_video?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
}

export interface HeroSection {
  _id: string;
  name_section: string;
  type_section: 'heroUtama';
  published_at: boolean;
  hero_content: HeroContent;
}