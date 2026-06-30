export type BookStatus = 'want-to-read' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  category: string;
  startDate?: string;
  finishDate?: string;
  progressPages: number;
  totalPages: number;
  rating?: number;
  notes: string;
  coverImage?: string; // base64
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  duration?: string;
}

export type CourseStatus = 'enrolled' | 'in-progress' | 'completed';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  platform: string; // Udemy, Coursera, YouTube, etc.
  status: CourseStatus;
  category: string;
  lessons: Lesson[];
  progressPercent: number;
  notes: string;
  thumbnail?: string; // base64
  createdAt: string;
}

export const PLATFORMS = [
  'Udemy', 'Coursera', 'YouTube', 'Skillshare', 'LinkedIn Learning', 'Pluralsight', 'MasterClass', 'Other'
];

export const LEARNING_CATEGORIES = [
  'Spiritual', 'Leadership', 'Business', 'Technology', 'Self-Development', 'Finance', 'Health', 'Creative'
];
