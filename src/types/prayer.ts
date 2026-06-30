export type PrayerSession = 'morning' | 'afternoon' | 'evening';

export interface PrayerPoint {
  id: string;
  text: string;
  completed: boolean;
  period: 'day' | 'week' | 'custom';
  startDate: string;
  endDate: string;
}

export interface HourlyPrayer {
  hour: number; // 0-23
  completed: boolean;
  duration: 6 | 10;
  date: string;
}

export interface PrayerState {
  points: PrayerPoint[];
  hourlyPlan: HourlyPrayer[];
  activeDuration: 6 | 10;
}
