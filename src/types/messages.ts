export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  type: MediaType;
  dataUrl: string; // base64 data URL
  name: string;
}

export interface MessageNote {
  id: string;
  title: string;
  speaker: string;
  date: string; // ISO date
  series?: string;
  scriptureRef: string;
  notes: string; // markdown-like text
  keyPoints: string[];
  prayerPoints: string[];
  coverImage?: MediaItem;
  gallery: MediaItem[]; // images + videos
  createdAt: string;
  tags: string[];
}
