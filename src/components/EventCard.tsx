import React from 'react';
import { ScheduleEvent } from '../types';
import { formatTime12h } from '../utils/dateUtils';
import { CategoryBadge, CATEGORY_CONFIG } from './CategoryBadge';
import { MoodSticker } from './MoodSticker';
import {
  MapPin,
  Clock,
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  Repeat,
  Sparkles,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
} from 'lucide-react';

interface EventCardProps {
  event: ScheduleEvent;
  onToggleTask?: (id: string) => void;
  onSelect?: (event: ScheduleEvent) => void;
  onDelete?: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onToggleTask,
  onSelect,
  onDelete,
}) => {
  const categoryConfig = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.personal;
  const isTask = Boolean(event.isTask);
  const isCompleted = Boolean(event.completed);

  // Different layout style depending on category archetype
  const isSocial = event.category === 'social';
  const isUniversity = event.category === 'university';
  const isDeadline = event.category === 'assignments' || event.isDeadline;
  const isAppointment = event.category === 'appointments';

  return (
    <div
      id={`event-card-${event.id}`}
      onClick={() => onSelect?.(event)}
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border hover:shadow-md ${
        isCompleted
          ? 'bg-[#F5F2EC] border-[#E8E2D8] opacity-75'
          : isSocial
          ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FEF9EE] to-[#FFF5E6] border-[#F6E3B8] shadow-xs'
          : isDeadline
          ? 'bg-gradient-to-br from-[#FFFDFD] via-[#FFF8F2] to-[#FDF1E6] border-[#F8D2B4] shadow-xs'
          : isUniversity
          ? 'bg-gradient-to-br from-[#FCFDFB] via-[#F6FAF7] to-[#EEF6F0] border-[#CFE3D4] shadow-xs'
          : isAppointment
          ? 'bg-gradient-to-br from-[#FDFEFE] via-[#F6F9FD] to-[#EDF4FC] border-[#CFE0F5] shadow-xs'
          : 'bg-white border-[#EFE9E0] shadow-xs'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-[#3D2E24] text-xs font-semibold shadow-2xs border border-[#EBE3D7]">
            <Clock className="w-3 h-3 text-[#8A7563]" />
            <span>{formatTime12h(event.startTime)}</span>
            {event.endTime && (
              <span className="text-[#8A7563] font-normal">
                – {formatTime12h(event.endTime)}
              </span>
            )}
          </div>

          <CategoryBadge category={event.category} size="sm" />

          {event.courseCode && (
            <span className="px-2 py-0.5 rounded-full bg-[#E5ECE7] text-[#244E30] text-2xs font-bold uppercase tracking-wider">
              {event.courseCode}
            </span>
          )}

          {event.isRecurring && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3EDE3] text-[#6E5A4B] text-2xs font-medium">
              <Repeat className="w-2.5 h-2.5" />
              <span>Weekly</span>
            </span>
          )}
        </div>

        {/* Right stickers / Task checkbox / actions */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isTask && (
            <button
              id={`task-toggle-${event.id}`}
              type="button"
              onClick={() => onToggleTask?.(event.id)}
              className="p-1 rounded-full text-[#7A695C] hover:text-[#3D2E24] transition-colors"
              title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#4C855B] fill-[#EBF3ED]" />
              ) : (
                <Circle className="w-5 h-5 text-[#C4B7A6] hover:text-[#E07A5F]" />
              )}
            </button>
          )}

          {event.moodSticker && (
            <MoodSticker type={event.moodSticker} className="scale-90" />
          )}

          <button
            type="button"
            onClick={() => onDelete?.(event.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#A8988B] hover:text-[#C53030] hover:bg-black/5 transition-opacity"
            title="Delete activity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title & Editorial Headline */}
      <div className="mb-2">
        <h4
          className={`text-base sm:text-lg font-serif font-semibold tracking-tight text-[#2B2018] leading-snug ${
            isCompleted ? 'line-through text-[#8F8174]' : ''
          }`}
        >
          {event.title}
        </h4>
      </div>

      {/* Special Category Highlights */}
      {isDeadline && !isCompleted && (
        <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-lg bg-[#FFE6E6] text-[#B91C1C] text-xs font-semibold border border-[#FCA5A5]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>🔴 Due today · High Priority</span>
        </div>
      )}

      {isSocial && (
        <div className="flex items-center gap-1 text-xs font-hand text-[#B45309] text-sm mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Downtime to look forward to!</span>
        </div>
      )}

      {/* Subtext & Details (Location, Room, Instructor, Notes) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6F5F53] mt-2">
        {event.location && (
          <div className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#A38F7E] shrink-0" />
            <span className="font-medium text-[#4D3F35]">{event.location}</span>
          </div>
        )}

        {event.room && event.room !== event.location && (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/5 text-[#52443A] font-mono text-2xs">
            {event.room}
          </div>
        )}

        {event.instructor && (
          <div className="inline-flex items-center gap-1 text-[#78675A]">
            <User className="w-3 h-3 text-[#A38F7E]" />
            <span>{event.instructor}</span>
          </div>
        )}
      </div>

      {/* Notes / Pull-quote style excerpt */}
      {event.notes && (
        <div className="mt-2.5 pt-2 border-t border-black/[0.06] text-xs text-[#7A6A5E] leading-relaxed line-clamp-2 italic font-sans">
          "{event.notes}"
        </div>
      )}
    </div>
  );
};
