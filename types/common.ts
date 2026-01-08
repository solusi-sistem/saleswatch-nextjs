export type LangKey = '' | 'id';

export interface Language {
  label: string;
  flag: string;
}

export type LanguageMap = Record<LangKey, Language>;