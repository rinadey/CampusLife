import { DayOfWeek, EventCategory, ScheduleEvent } from '../types';
import { DAYS_OF_WEEK, TODAY_ISO, addDays, getDayOfWeekFromDate } from './dateUtils';

interface ParsedItemDraft {
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  room?: string;
  instructor?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isRecurring?: boolean;
  recurringDays?: DayOfWeek[];
  isTask?: boolean;
}

// Fallback client-side rule-based natural language parser
export function parseNaturalLanguageOffline(text: string, referenceDate: string = TODAY_ISO): ParsedItemDraft[] {
  const clauses = text
    .split(/(?:,|\band\b|;|\.|\n)+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const results: ParsedItemDraft[] = [];

  for (const clause of clauses) {
    const lower = clause.toLowerCase();

    // Determine category
    let category: EventCategory = 'personal';
    if (/(?:lecture|class|lab|course|cs\d+|exam|quiz|professor|prof\b)/i.test(lower)) {
      category = 'university';
    } else if (/(?:assignment|homework|essay|submit|due|project)/i.test(lower)) {
      category = 'assignments';
    } else if (/(?:dentist|doctor|appointment|interview|clinic|advising)/i.test(lower)) {
      category = 'appointments';
    } else if (/(?:dinner|lunch|coffee|drinks|friend|friends|party|hangout|date|movie|club\b)/i.test(lower)) {
      category = 'social';
    } else if (/(?:urgent|exam|midterm|final|deadline)/i.test(lower)) {
      category = 'urgent';
    } else if (/(?:gym|run|workout|reading|groceries|laundry|walk)/i.test(lower)) {
      category = 'personal';
    }

    // Extract time (e.g. "10 AM", "5 PM", "8:30pm", "14:00")
    let startTime = '09:00';
    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

      if (meridiem === 'pm' && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;
      // Default guess if no AM/PM: 1-6 is probably PM, 7-12 is probably AM
      if (!meridiem) {
        if (h >= 1 && h <= 6) h += 12;
      }
      startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    // Check recurring days (e.g., "every Sunday and Tuesday", "every Monday")
    const isRecurring = /every\b|weekly|each\b/i.test(lower);
    const recurringDays: DayOfWeek[] = [];
    DAYS_OF_WEEK.forEach((day) => {
      if (new RegExp(`\\b${day.toLowerCase()}\\b`, 'i').test(lower)) {
        recurringDays.push(day);
      }
    });

    // Determine target date
    let targetDate = referenceDate;
    // Check specific month & day (e.g., "September 20", "Sep 20", "9/20")
    const monthMatch = lower.match(/(?:september|sep)\s*(\d{1,2})/i);
    if (monthMatch) {
      const dayNum = parseInt(monthMatch[1], 10);
      targetDate = `2026-09-${String(dayNum).padStart(2, '0')}`;
    } else if (lower.includes('tomorrow')) {
      targetDate = addDays(referenceDate, 1);
    } else if (lower.includes('today')) {
      targetDate = referenceDate;
    } else if (recurringDays.length > 0) {
      // Find the next occurrence of one of the recurring days
      for (let i = 0; i < 7; i++) {
        const candidateDate = addDays(referenceDate, i);
        const dayName = getDayOfWeekFromDate(candidateDate);
        if (recurringDays.includes(dayName)) {
          targetDate = candidateDate;
          break;
        }
      }
    } else {
      // Check if a single day of week was mentioned like "Friday"
      for (const day of DAYS_OF_WEEK) {
        if (new RegExp(`\\b${day.toLowerCase()}\\b`, 'i').test(lower)) {
          for (let i = 0; i < 7; i++) {
            const candidateDate = addDays(referenceDate, i);
            if (getDayOfWeekFromDate(candidateDate) === day) {
              targetDate = candidateDate;
              break;
            }
          }
          break;
        }
      }
    }

    // Extract location (e.g. "at Somewhere Café", "in Room 302", "at University Café")
    let location: string | undefined;
    const locMatch = clause.match(/(?:at|in)\s+([A-Z][A-Za-z0-9\s'—–-]+?)(?=\s+(?:at|every|on|with|due|and|$))/);
    if (locMatch) {
      location = locMatch[1].trim();
    }

    // Clean title
    let title = clause
      .replace(/^I have a\s+/i, '')
      .replace(/^a\s+/i, '')
      .replace(/^an\s+/i, '')
      .replace(/\s+every\s+.*$/i, '')
      .replace(/\s+on\s+.*$/i, '')
      .replace(/\s+at\s+\d+.*$/i, '')
      .trim();

    // Capitalize nicely
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = clause;
    }

    const isTask = category === 'assignments' || /submit|finish|complete|hand in/i.test(lower);

    results.push({
      title,
      category,
      date: targetDate,
      startTime,
      location,
      isRecurring: isRecurring && recurringDays.length > 0,
      recurringDays: recurringDays.length > 0 ? recurringDays : undefined,
      isTask,
      priority: category === 'urgent' ? 'urgent' : category === 'assignments' ? 'high' : 'medium',
    });
  }

  return results;
}

// Master parsing function: queries server API if available, otherwise runs offline fallback
export async function parseNaturalLanguageInput(
  text: string,
  referenceDate: string = TODAY_ISO
): Promise<{ items: ParsedItemDraft[]; usedAI: boolean }> {
  try {
    const res = await fetch('/api/parse-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, referenceDate }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        return { items: data.items, usedAI: true };
      }
    }
  } catch {
    // Network or server not configured, fallback gracefully
  }

  // Fallback to offline regex parser
  const fallbackItems = parseNaturalLanguageOffline(text, referenceDate);
  return { items: fallbackItems, usedAI: false };
}
