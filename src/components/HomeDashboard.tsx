import React, { useMemo } from 'react';
import { ScheduleEvent, UserProfile } from '../types';
import { TODAY_ISO, formatMagazineDateHeader, formatTime12h, sortEventsChronologically } from '../utils/dateUtils';
import { CategoryBadge, CATEGORY_CONFIG } from './CategoryBadge';
import { MoodSticker } from './MoodSticker';
import {
  Sparkles,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Sun,
  Coffee,
  CheckCircle,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile;
  events: ScheduleEvent[];
  onOpenSchedule: () => void;
  onOpenTasks: () => void;
  onOpenAddModal: () => void;
  onSelectEvent: (event: ScheduleEvent) => void;
  onToggleTask: (id: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  events,
  onOpenSchedule,
  onOpenTasks,
  onOpenAddModal,
  onSelectEvent,
  onToggleTask,
}) => {
  const { weekday, monthDay } = formatMagazineDateHeader(TODAY_ISO);

  // Filter today's events
  const todayEvents = useMemo(() => {
    return sortEventsChronologically(events.filter((ev) => ev.date === TODAY_ISO));
  }, [events]);

  // Next upcoming event today or upcoming
  const nextUpcomingEvent = useMemo(() => {
    const upcoming = events.filter(
      (ev) => ev.date >= TODAY_ISO && !ev.completed
    );
    const sorted = sortEventsChronologically(upcoming);
    return sorted[0] || null;
  }, [events]);

  // Incomplete tasks count
  const pendingTasks = useMemo(() => {
    return events.filter((ev) => ev.isTask && !ev.completed);
  }, [events]);

  // Urgent deadlines upcoming
  const urgentDeadlines = useMemo(() => {
    return events.filter(
      (ev) => (ev.category === 'assignments' || ev.isDeadline) && !ev.completed
    );
  }, [events]);

  // Time of day greeting
  const greeting = 'Good morning';

  return (
    <div id="home-dashboard-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Masthead & Greeting */}
      <div className="mb-8 pb-6 border-b border-[#E8E0D5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7A6D] uppercase tracking-widest mb-1.5 font-mono">
              <span>{weekday}</span>
              <span>·</span>
              <span>{monthDay}, 2026</span>
              <span>·</span>
              <span className="text-[#4C855B]">{user.semester}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2E2118] tracking-tight">
              {greeting}, {user.name}! <span className="font-hand text-3xl sm:text-4xl text-[#E07A5F]">✨</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E5D50] font-sans">
              Here is your personal pulse for today at <span className="font-medium text-[#3D2E24]">{user.university}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="dashboard-add-btn"
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D2684E] text-white font-medium text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add</span>
            </button>
            <button
              type="button"
              onClick={onOpenSchedule}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F5EFE6] text-[#3D2E24] border border-[#E2D7CB] font-medium text-sm transition-all shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-[#8C7563]" />
              <span>Open Magazine</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2D7] shadow-2xs">
            <span className="text-xs font-medium text-[#7D6B5E]">Today's Activities</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#2E2118]">{todayEvents.length}</span>
              <span className="text-2xs text-[#8C7A6D]">scheduled</span>
            </div>
          </div>

          <div
            onClick={onOpenTasks}
            className="p-3.5 rounded-2xl bg-white border border-[#EAE2D7] shadow-2xs cursor-pointer hover:border-[#E07A5F] transition-colors"
          >
            <span className="text-xs font-medium text-[#7D6B5E]">Tasks Remaining</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#D96B27]">
                {pendingTasks.length}
              </span>
              <span className="text-2xs text-[#8C7A6D]">to finish</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#EAE2D7] shadow-2xs">
            <span className="text-xs font-medium text-[#7D6B5E]">Deadlines Due Soon</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#C53030]">
                {urgentDeadlines.length}
              </span>
              <span className="text-2xs text-[#8C7A6D]">upcoming</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F6FAF7] border border-[#CFE3D4] shadow-2xs">
            <span className="text-xs font-medium text-[#3A6B46]">Academic Vibe</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-base font-serif font-bold text-[#2D5A38]">On Track</span>
              <span className="text-xs">🌿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero: Next Upcoming Activity */}
      {nextUpcomingEvent && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[#8C7A6D] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Next Activity Spotlight</span>
            </h2>
            <span className="text-xs font-hand text-lg text-[#B45309]">Up Next</span>
          </div>

          <div
            id="hero-upcoming-card"
            onClick={() => onSelectEvent(nextUpcomingEvent)}
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E9] to-[#F7EFE4] border-2 border-[#E9DFD3] shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#3D2E24] text-white text-xs font-semibold shadow-2xs">
                    {formatTime12h(nextUpcomingEvent.startTime)}
                    {nextUpcomingEvent.endTime && ` – ${formatTime12h(nextUpcomingEvent.endTime)}`}
                  </span>
                  <CategoryBadge category={nextUpcomingEvent.category} size="sm" />
                  {nextUpcomingEvent.date !== TODAY_ISO && (
                    <span className="text-xs font-medium text-[#7D6B5E] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E5DDD2]">
                      Date: {nextUpcomingEvent.date}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2A1E16]">
                  {nextUpcomingEvent.title}
                </h3>

                {nextUpcomingEvent.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6F5E52]">
                    <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span className="font-medium">{nextUpcomingEvent.location}</span>
                    {nextUpcomingEvent.room && (
                      <span className="font-mono text-2xs px-1.5 py-0.5 rounded bg-black/5">
                        {nextUpcomingEvent.room}
                      </span>
                    )}
                  </div>
                )}

                {nextUpcomingEvent.notes && (
                  <p className="text-xs text-[#7A695C] italic pt-1 line-clamp-2">
                    "{nextUpcomingEvent.notes}"
                  </p>
                )}
              </div>

              <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                <span className="text-xs font-medium text-[#E07A5F] group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule Stream */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2118]">
              Today's Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[#7A695C]">
              {todayEvents.length > 0
                ? `${todayEvents.length} activities scheduled for today`
                : 'Free and open day!'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSchedule}
            className="text-xs sm:text-sm font-medium text-[#8F7C6E] hover:text-[#3D2E24] inline-flex items-center gap-1 transition-colors"
          >
            <span>View full magazine timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E3D9CD] p-8 text-center bg-white/60">
            <Sun className="w-8 h-8 mx-auto text-[#D97706] mb-2" />
            <p className="text-sm font-medium text-[#3D2E24]">Nothing else scheduled for today</p>
            <p className="text-xs text-[#7A695C] mt-1">
              Add a class, study block, or hangout with friends.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3D2E24] text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todayEvents.map((event) => {
              const isTask = Boolean(event.isTask);
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EAE2D7] hover:border-[#D5C6B7] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Time indicator */}
                    <div className="text-center min-w-[70px] sm:min-w-[85px] py-1 px-2 rounded-xl bg-[#FAF6F0] border border-[#EAE2D7]">
                      <span className="block text-xs font-bold text-[#3D2E24]">
                        {formatTime12h(event.startTime)}
                      </span>
                      {event.endTime && (
                        <span className="block text-3xs text-[#8C7A6D]">
                          to {formatTime12h(event.endTime)}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <CategoryBadge category={event.category} size="sm" />
                        {event.courseCode && (
                          <span className="text-3xs font-mono font-bold text-[#4C855B] bg-[#EBF3ED] px-1.5 py-0.5 rounded">
                            {event.courseCode}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm sm:text-base font-semibold text-[#2E2118] ${
                          event.completed ? 'line-through text-[#99887A]' : ''
                        }`}
                      >
                        {event.title}
                      </h4>
                      {event.location && (
                        <span className="text-xs text-[#7A695C] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#B39F8E]" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isTask && (
                      <button
                        type="button"
                        onClick={() => onToggleTask(event.id)}
                        className="p-1.5 rounded-full hover:bg-black/5 text-[#7A695C]"
                      >
                        {event.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#4C855B]" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#C9BCAD]" />
                        )}
                      </button>
                    )}
                    {event.moodSticker && (
                      <MoodSticker type={event.moodSticker} className="scale-75" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Editorial Mini Section: Upcoming Highlights & Mindset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next assignments card */}
        <div className="p-5 rounded-3xl bg-[#FFF8F2] border border-[#F8D2B4]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E4A19] font-mono">
              Assignments & Deadlines
            </span>
            <span className="text-xs font-medium text-[#9E4A19] bg-white/70 px-2 py-0.5 rounded-full">
              {urgentDeadlines.length} active
            </span>
          </div>
          <p className="text-xs text-[#7A5B47] mb-3">
            Keep track of course deliverables before they pile up.
          </p>
          <div className="space-y-2">
            {urgentDeadlines.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectEvent(item)}
                className="p-2.5 rounded-xl bg-white/80 border border-[#F8D2B4]/60 text-xs flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
              >
                <div className="truncate pr-2">
                  <span className="font-semibold text-[#3D2E24] block truncate">{item.title}</span>
                  <span className="text-2xs text-[#9E4A19]">Due: {item.date}</span>
                </div>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-[#FFEAE5] text-[#C53030]">
                  {item.priority || 'high'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational / Life Balance Quote Card */}
        <div className="p-5 rounded-3xl bg-[#F6FAF7] border border-[#CFE3D4] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#356341] font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Balance & Wellness</span>
            </div>
            <p className="font-hand text-xl text-[#244C2E] leading-snug mb-2">
              "Remember to take intentional breaks between problem sets. Campus life is about the journey, not just the exams."
            </p>
          </div>
          <div className="pt-3 border-t border-[#CFE3D4]/80 flex items-center justify-between text-2xs text-[#4C855B] font-medium">
            <span>Autumn Term 2026</span>
            <span>Week 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
