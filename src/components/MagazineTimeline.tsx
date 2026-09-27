import React, { useState, useMemo, useRef } from 'react';
import { EventCategory, ScheduleEvent, TimelineFilter } from '../types';
import {
  formatMagazineDateHeader,
  groupEventsByDate,
  isDateInThisWeek,
  TODAY_ISO,
} from '../utils/dateUtils';
import { EventCard } from './EventCard';
import { CATEGORY_CONFIG } from './CategoryBadge';
import {
  Calendar,
  Sparkles,
  Plus,
  Filter,
  CheckCircle,
  Coffee,
  Sun,
  Compass,
  Smile,
  BookOpen,
} from 'lucide-react';

interface MagazineTimelineProps {
  events: ScheduleEvent[];
  onToggleTask: (id: string) => void;
  onSelectEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (id: string) => void;
  onOpenAddModal: (prefillDate?: string) => void;
}

const DAY_EDITORIAL_NOTES: Record<
  string,
  { quote: string; weather: string; moodTag: string }
> = {
  '2026-09-12': {
    quote: 'Saturday mornings are for warm matcha and unhurried thoughts.',
    weather: '☀️ 74°F · Golden Campus Sun',
    moodTag: 'Weekend Bloom',
  },
  '2026-09-13': {
    quote: 'Rest, recharge, and set gentle intentions for the week ahead.',
    weather: '🌤️ 71°F · Gentle Autumn Breeze',
    moodTag: 'Recharge & Plan',
  },
  '2026-09-14': {
    quote: 'A focused Monday: early lectures, afternoon café meetups, evening creativity.',
    weather: '☀️ 76°F · Crisp & Clear',
    moodTag: 'High Momentum',
  },
  '2026-09-15': {
    quote: 'Deep algorithms in the morning, grounding yoga by sunset.',
    weather: '⛅ 70°F · Mild & Fresh',
    moodTag: 'Curious & Mindful',
  },
  '2026-09-16': {
    quote: 'Midweek milestone: stay steady, write clean code, and breathe.',
    weather: '🌧️ 68°F · Cozy Light Rain',
    moodTag: 'Deep Work',
  },
  '2026-09-17': {
    quote: 'Studio colors, design explorations, and endorphin boosts.',
    weather: '🌤️ 72°F · Partly Sunny',
    moodTag: 'Creative Flow',
  },
  '2026-09-18': {
    quote: 'Friday vibes: wrap up literature drafts and savor good ramen with friends.',
    weather: '🌅 75°F · Golden Hour Glow',
    moodTag: 'Social Celebration',
  },
  '2026-09-20': {
    quote: 'Health routines and clean slates for the coming week.',
    weather: '☀️ 73°F · Clear Blue Skies',
    moodTag: 'Self Care',
  },
};

export const MagazineTimeline: React.FC<MagazineTimelineProps> = ({
  events,
  onToggleTask,
  onSelectEvent,
  onDeleteEvent,
  onOpenAddModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter events based on time horizon and category
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // Time horizon filter
      if (activeFilter === 'today') {
        return ev.date === TODAY_ISO;
      }
      if (activeFilter === 'tomorrow') {
        return ev.date === '2026-09-13';
      }
      if (activeFilter === 'week') {
        return isDateInThisWeek(ev.date, TODAY_ISO);
      }
      if (activeFilter === 'upcoming') {
        return ev.date >= TODAY_ISO;
      }
      return true; // 'all'
    });
  }, [events, activeFilter, selectedCategory]);

  // Group filtered events by date
  const grouped = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
  const dateKeys = Object.keys(grouped);

  // Smooth scroll to a date section
  const scrollToDate = (dateStr: string) => {
    const el = dateRefs.current[dateStr];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="magazine-timeline-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Magazine Masthead & Header */}
      <div className="mb-8 pb-6 border-b border-[#E8E0D5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3ECE1] text-[#7A6657] text-xs font-semibold uppercase tracking-widest mb-2 border border-[#E5DDD2]">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Lifestyle & University Journal · Fall 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2E2118] tracking-tight">
              My Visual Schedule
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E5D50] max-w-xl font-sans leading-relaxed">
              Scroll chronologically through your lectures, coffee dates, assignments, and campus life.
            </p>
          </div>

          {/* Quick Add Action Button */}
          <button
            id="magazine-quick-add-btn"
            type="button"
            onClick={() => onOpenAddModal()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D2684E] text-white font-medium text-sm shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Schedule</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col gap-3">
          {/* Timeframe Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <span className="text-xs font-semibold text-[#8A7563] uppercase tracking-wider mr-1 shrink-0">
              Show:
            </span>
            {(
              [
                { id: 'all', label: 'All Days' },
                { id: 'today', label: 'Today (Sep 12)' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'week', label: 'This Week' },
                { id: 'upcoming', label: 'Upcoming' },
              ] as { id: TimelineFilter; label: string }[]
            ).map((filter) => (
              <button
                key={filter.id}
                id={`filter-horizon-${filter.id}`}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.id
                    ? 'bg-[#3D2E24] text-[#FAF7F2] shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#6B5A4D] border border-[#E9E1D6]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="filter-cat-all"
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#5C4A3C] text-white shadow-2xs'
                  : 'bg-white/70 hover:bg-white text-[#7A695C] border border-[#EAE3D9]'
              }`}
            >
              All Categories
            </button>

            {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-cat-${cat}`}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? `${cfg.bg} ${cfg.text} ${cfg.border} font-bold ring-2 ring-[#3D2E24]/20 shadow-2xs`
                      : 'bg-white/60 hover:bg-white text-[#6E5D50] border-[#E8DFD3]'
                  }`}
                >
                  <span>{cfg.accentEmoji}</span>
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Quick Jump Strip (if there are multiple dates) */}
        {dateKeys.length > 1 && (
          <div className="mt-4 pt-3 border-t border-[#EFE8DE] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-2xs font-semibold text-[#8C7969] uppercase tracking-wider shrink-0">
              Jump To:
            </span>
            {dateKeys.map((dateStr) => {
              const { weekday, monthDay, isToday } = formatMagazineDateHeader(dateStr);
              return (
                <button
                  key={dateStr}
                  id={`jump-date-${dateStr}`}
                  type="button"
                  onClick={() => scrollToDate(dateStr)}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-medium shrink-0 transition-colors ${
                    isToday
                      ? 'bg-[#EBF3ED] text-[#2D5A38] border border-[#BDD9C4] font-semibold'
                      : 'bg-white text-[#78675A] hover:bg-[#F3EDE5] border border-[#E9E2D8]'
                  }`}
                >
                  <span className="font-mono">{monthDay.replace('SEPTEMBER ', 'Sep ')}</span>
                  <span className="opacity-60 ml-1">({weekday.slice(0, 3)})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {dateKeys.length === 0 && (
        <div
          id="timeline-empty-state"
          className="rounded-3xl border-2 border-dashed border-[#E5DCD2] p-10 sm:p-14 text-center bg-white/50 my-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF8EE] border border-[#FBE3B8] flex items-center justify-center text-[#D97706]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3D2E24] mb-2">
            Your day is looking peaceful ✨
          </h3>
          <p className="text-sm text-[#7A695C] max-w-md mx-auto mb-6 font-sans">
            Nothing scheduled for this view. Add your university courses, study blocks, coffee dates, or to-do items.
          </p>
          <button
            type="button"
            onClick={() => onOpenAddModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3D2E24] hover:bg-[#2C211A] text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Activity</span>
          </button>
        </div>
      )}

      {/* Main Magazine Scroll Container */}
      <div className="space-y-12 sm:space-y-16">
        {dateKeys.map((dateStr) => {
          const dateEvents = grouped[dateStr];
          const { weekday, monthDay, isToday, isTomorrow, relativeBadge } =
            formatMagazineDateHeader(dateStr);
          const editorial = DAY_EDITORIAL_NOTES[dateStr];

          return (
            <section
              key={dateStr}
              ref={(el) => (dateRefs.current[dateStr] = el)}
              id={`section-date-${dateStr}`}
              className="relative scroll-mt-6"
            >
              {/* Large Magazine Date Header Banner */}
              <div className="mb-5 sm:mb-6">
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1.5">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-[#2B1F17] uppercase">
                      {weekday} <span className="text-[#C4B4A5]">·</span> {monthDay}
                    </h2>

                    {relativeBadge && (
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs ${
                          isToday
                            ? 'bg-[#4C855B] text-white'
                            : 'bg-[#E07A5F] text-white'
                        }`}
                      >
                        {relativeBadge}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAddModal(dateStr)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#8F7C6E] hover:text-[#2E2118] px-2.5 py-1 rounded-md hover:bg-black/5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to this day</span>
                  </button>
                </div>

                {/* Editorial Vignette & Weather Sticker */}
                {editorial && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#7A695C] bg-[#F4EFE6]/70 rounded-xl px-3.5 py-2 border border-[#E8E1D5] mb-4">
                    <span className="font-hand text-base sm:text-lg text-[#544336] leading-none">
                      "{editorial.quote}"
                    </span>
                    <div className="flex items-center gap-3 shrink-0 text-2xs font-semibold text-[#8C7A6D]">
                      <span className="inline-flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-md border border-[#E7E0D4]">
                        {editorial.weather}
                      </span>
                      <span className="hidden sm:inline text-[#C4B7AA]">|</span>
                      <span className="text-[#B45309] font-medium">{editorial.moodTag}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Day's Chronological Activities Grid / Magazine Stream */}
              <div className="relative pl-3 sm:pl-6 border-l-2 border-[#E7DFD4] space-y-4">
                {dateEvents.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Visual dot on the timeline track */}
                    <span
                      className="absolute -left-[19px] sm:-left-[31px] top-6 w-3 h-3 rounded-full border-2 border-[#FAF7F2] shadow-2xs"
                      style={{
                        backgroundColor:
                          CATEGORY_CONFIG[event.category]?.dotColor || '#A89787',
                      }}
                    />

                    <EventCard
                      event={event}
                      onToggleTask={onToggleTask}
                      onSelect={onSelectEvent}
                      onDelete={onDeleteEvent}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
