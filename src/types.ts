export type SessionType = 'morning' | 'afternoon' | 'evening';
export type ActivityType = 'book' | 'practice' | 'course' | 'video' | 'bookvideo';
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Activity {
  id: string;
  title: string;
  frequency: string;
  type: ActivityType;
  session: SessionType;
  completed: boolean;
  day: DayKey;
  emoji: string;
}

export const SESSION_CONFIG: Record<SessionType, {
  label: string;
  icon: string;
  time: string;
  headerBg: string;
  headerText: string;
  borderAccent: string;
}> = {
  morning: {
    label: 'Morning Session',
    icon: '🌅',
    time: '00:00 – 13:00',
    headerBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
    headerText: 'text-white',
    borderAccent: 'border-amber-500/30',
  },
  afternoon: {
    label: 'Afternoon Session',
    icon: '☀️',
    time: '13:00 – 18:00',
    headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-700',
    headerText: 'text-white',
    borderAccent: 'border-emerald-500/30',
  },
  evening: {
    label: 'Evening Session',
    icon: '🌙',
    time: '18:00 – 00:00',
    headerBg: 'bg-gradient-to-r from-slate-700 to-slate-900',
    headerText: 'text-white',
    borderAccent: 'border-slate-500/30',
  },
};

export const ACTIVITY_TYPE_CONFIG: Record<ActivityType, {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  book: { label: 'BOOK', bg: 'bg-amber-100/90', text: 'text-amber-800', border: 'border-amber-200', icon: '📖' },
  practice: { label: 'PRACTICE', bg: 'bg-orange-100/90', text: 'text-orange-800', border: 'border-orange-200', icon: '🧘' },
  course: { label: 'COURSE', bg: 'bg-yellow-100/90', text: 'text-yellow-800', border: 'border-yellow-200', icon: '🎓' },
  video: { label: 'VIDEO', bg: 'bg-rose-100/90', text: 'text-rose-800', border: 'border-rose-200', icon: '🎬' },
  bookvideo: { label: 'BOOK/VIDEO', bg: 'bg-fuchsia-100/90', text: 'text-fuchsia-800', border: 'border-fuchsia-200', icon: '📚' },
};

export const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'MON' },
  { key: 'tue', label: 'TUE' },
  { key: 'wed', label: 'WED' },
  { key: 'thu', label: 'THU' },
  { key: 'fri', label: 'FRI' },
  { key: 'sat', label: 'SAT' },
  { key: 'sun', label: 'SUN' },
];

export const BIBLE_VERSES = [
  { text: 'Commit your works to the LORD, and your plans will be established.', ref: 'Proverbs 16:3' },
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'The LORD is my shepherd, I lack nothing.', ref: 'Psalm 23:1' },
  { text: 'Be strong and courageous. Do not be afraid.', ref: 'Joshua 1:9' },
  { text: 'Trust in the LORD with all your heart.', ref: 'Proverbs 3:5' },
  { text: 'For God so loved the world that he gave his one and only Son.', ref: 'John 3:16' },
];

export const DEFAULT_ACTIVITIES: Activity[] = [
  // Wednesday default (matching the design)
  { id: '1', title: 'The Holy Spirit and You', frequency: 'TWICE A DAY', type: 'book', session: 'morning', completed: false, day: 'wed', emoji: '📖' },
  { id: '2', title: 'Confessions', frequency: '3× A DAY', type: 'practice', session: 'morning', completed: false, day: 'wed', emoji: '🙏' },
  { id: '3', title: 'Bible Study + Message', frequency: 'TWICE A DAY', type: 'bookvideo', session: 'morning', completed: false, day: 'wed', emoji: '📖' },
  { id: '4', title: 'Rhapsody of Realities', frequency: 'TWICE A DAY', type: 'book', session: 'morning', completed: false, day: 'wed', emoji: '📖' },
  { id: '5', title: 'Data Analysis Course', frequency: '1+ Videos – Udemy/YouTube', type: 'course', session: 'morning', completed: false, day: 'wed', emoji: '💻' },
  { id: '6', title: 'Speaking in Tongues', frequency: '3× A DAY', type: 'practice', session: 'morning', completed: false, day: 'wed', emoji: '🗣️' },
  { id: '7', title: 'Satan Get Lost (optional)', frequency: '1–2 Chapters', type: 'book', session: 'afternoon', completed: false, day: 'wed', emoji: '📖' },
  { id: '8', title: 'Graphics Course', frequency: '1+ Videos', type: 'course', session: 'afternoon', completed: false, day: 'wed', emoji: '🎨' },
  { id: '9', title: 'Bible Study', frequency: '1–2 hours', type: 'book', session: 'evening', completed: false, day: 'wed', emoji: '📖' },
  { id: '10', title: 'Telegram Course', frequency: '1+ Videos', type: 'course', session: 'evening', completed: false, day: 'wed', emoji: '💻' },
  { id: '11', title: 'YouTube Course', frequency: '1+ Videos', type: 'course', session: 'evening', completed: false, day: 'wed', emoji: '💻' },
];
