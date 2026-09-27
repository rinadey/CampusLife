export type EventCategory =
  | 'university'
  | 'personal'
  | 'assignments'
  | 'social'
  | 'appointments'
  | 'urgent';

export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface ScheduleEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "08:00")
  endTime?: string; // HH:mm (e.g. "09:30")
  location?: string;
  room?: string;
  instructor?: string;
  notes?: string;
  priority?: EventPriority;
  isRecurring?: boolean;
  recurringDays?: DayOfWeek[];
  recurringUntil?: string; // YYYY-MM-DD
  reminder?: string; // e.g. "15m", "1h", "1d"
  isTask?: boolean;
  completed?: boolean;
  isDeadline?: boolean;
  courseCode?: string;
  moodSticker?: string; // playful icon/doodle e.g. 'coffee', 'book', 'palette', 'star', 'sun', 'heart', 'sparkles'
}

export interface UniversityCourse {
  id: string;
  code: string; // e.g. "CS302"
  name: string; // e.g. "Database Systems"
  instructor: string;
  room: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  color: string; // hex or badge color
  credits?: number;
  semester?: string;
}

export interface UserProfile {
  name: string;
  university: string;
  major: string;
  semester: string;
  semesterStart: string;
  semesterEnd: string;
}

export type TimelineFilter = 'all' | 'today' | 'tomorrow' | 'week' | 'upcoming';
