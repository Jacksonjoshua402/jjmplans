export interface Pillar {
  id: string;
  number: number;
  title: string;
  emoji: string;
  description: string;
  keyVerses: string[];
  notes: string;
  isActive: boolean;
}

export const DEFAULT_PILLARS: Omit<Pillar, 'id'>[] = [
  { number: 1, title: 'Study of the Word of God', emoji: '📖', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 2, title: 'My Fellowship with the Holy Spirit and with fellow Christians', emoji: '', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 3, title: 'My Prayer Life', emoji: '🙏', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 4, title: 'Evangelism (Soul Winning)', emoji: '', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 5, title: 'Prophecy & Rhema', emoji: '🔮', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 6, title: 'Speaking in Tongues', emoji: '🗣️', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 7, title: 'My Giving', emoji: '💝', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 8, title: 'Confessions', emoji: '✨', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 9, title: 'Meditation', emoji: '', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 10, title: 'My Service to the Lord', emoji: '⛪', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 11, title: 'My Devotion (Rhapsody of Realities)', emoji: '📚', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 12, title: 'My Education & Learning', emoji: '🎓', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 13, title: 'My Time Management', emoji: '⏰', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 14, title: 'My Savings', emoji: '🏦', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 15, title: 'My Investments', emoji: '📈', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 16, title: 'My Businesses', emoji: '💼', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 17, title: 'My Day Planning & Targets', emoji: '📋', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 18, title: 'My Leaders (Parents, Pastors, Elders)', emoji: '👥', description: '', keyVerses: [], notes: '', isActive: true },
  { number: 19, title: 'My Convictions and Revelations', emoji: '💡', description: '', keyVerses: [], notes: '', isActive: true },
];
