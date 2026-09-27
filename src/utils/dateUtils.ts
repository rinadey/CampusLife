import { DayOfWeek, ScheduleEvent } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Reference date for initial app load: 2026-09-12 (Saturday)
export const TODAY_ISO = '2026-09-12';

export function getTodayDate(): string {
  // Use today ISO or system date formatted YYYY-MM-DD
  return TODAY_ISO;
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hoursStr, minsStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  if (isNaN(hours)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const mins = minsStr || '00';
  return `${hours12}:${mins.padStart(2, '0')} ${period}`;
}

export function formatMagazineDateHeader(dateStr: string): {
  weekday: string;
  monthDay: string;
  isToday: boolean;
  isTomorrow: boolean;
  relativeBadge?: string;
} {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const weekday = weekdays[dateObj.getDay()];
  const monthDay = `${months[dateObj.getMonth()]} ${day}`;

  const isToday = dateStr === TODAY_ISO;
  
  // Tomorrow check
  const tomorrowObj = new Date(2026, 8, 13); // Sep 13
  const isTomorrow = dateStr === '2026-09-13';

  let relativeBadge: string | undefined;
  if (isToday) relativeBadge = 'TODAY';
  else if (isTomorrow) relativeBadge = 'TOMORROW';

  return {
    weekday,
    monthDay,
    isToday,
    isTomorrow,
    relativeBadge,
  };
}

export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return DAYS_OF_WEEK[dateObj.getDay()];
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isDateInThisWeek(dateStr: string, baseDateStr: string = TODAY_ISO): boolean {
  const [baseY, baseM, baseD] = baseDateStr.split('-').map(Number);
  const base = new Date(baseY, baseM - 1, baseD);
  
  const currentDayOfWeek = base.getDay(); // 0 is Sunday, 6 is Saturday
  // Consider week window as next 7 days
  const targetTime = new Date(dateStr).getTime();
  const startTime = base.getTime() - (currentDayOfWeek * 86400000);
  const endTime = startTime + (7 * 86400000);
  
  return targetTime >= startTime && targetTime <= endTime;
}

export function sortEventsChronologically(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });
}

// Group events by date key
export function groupEventsByDate(events: ScheduleEvent[]): Record<string, ScheduleEvent[]> {
  const sorted = sortEventsChronologically(events);
  const groups: Record<string, ScheduleEvent[]> = {};

  sorted.forEach((event) => {
    if (!groups[event.date]) {
      groups[event.date] = [];
    }
    groups[event.date].push(event);
  });

  return groups;
}

// Expand recurring events for a specific date range
export function expandRecurringEvents(
  events: ScheduleEvent[],
  startDate: string,
  endDate: string
): ScheduleEvent[] {
  const result: ScheduleEvent[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  events.forEach((event) => {
    if (!event.isRecurring || !event.recurringDays || event.recurringDays.length === 0) {
      // Non-recurring event: keep as-is if within or relevant
      result.push(event);
      return;
    }

    // Expand recurring event across days between start and end
    const current = new Date(start);
    while (current <= end) {
      const dayName = DAYS_OF_WEEK[current.getDay()];
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      const curDateStr = `${y}-${m}-${d}`;

      // Check if current day name matches recurring days
      if (event.recurringDays.includes(dayName)) {
        // Also verify recurringUntil if provided
        if (!event.recurringUntil || curDateStr <= event.recurringUntil) {
          result.push({
            ...event,
            id: `${event.id}_${curDateStr}`,
            date: curDateStr,
          });
        }
      }

      current.setDate(current.getDate() + 1);
    }
  });

  return sortEventsChronologically(result);
}
