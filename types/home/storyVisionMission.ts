export interface StoryVisionMissionItem {
  icon_type: 'cross' | 'circle' | 'plus';
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
}

export interface StoryVisionMissionContent {
  items: StoryVisionMissionItem[];
}

export interface StoryVisionMissionSection {
  _id: string;
  name_section: string;
  type_section: 'storyVisionMission';
  published_at: boolean;
  story_vision_mission: StoryVisionMissionContent;
}