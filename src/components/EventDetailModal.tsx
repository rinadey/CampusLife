import React, { useState } from 'react';
import { ScheduleEvent } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { formatTime12h } from '../utils/dateUtils';
import { MoodSticker } from './MoodSticker';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Trash2,
  CheckCircle2,
  Circle,
  Repeat,
  AlertCircle,
  Edit2,
  Save,
} from 'lucide-react';

interface EventDetailModalProps {
  event: ScheduleEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (updated: ScheduleEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (!isOpen || !event) return null;

  const handleStartEdit = () => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setEditStartTime(event.startTime);
    setEditEndTime(event.endTime || '');
    setEditLocation(event.location || '');
    setEditRoom(event.room || '');
    setEditNotes(event.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateEvent({
      ...event,
      title: editTitle.trim() || event.title,
      date: editDate || event.date,
      startTime: editStartTime || event.startTime,
      endTime: editEndTime || undefined,
      location: editLocation || undefined,
      room: editRoom || undefined,
      notes: editNotes || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div
      id="event-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="event-detail-modal"
        className="w-full max-w-lg rounded-3xl bg-white border border-[#D5C6B7] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8E0D4] flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={event.category} size="md" />
            {event.courseCode && (
              <span className="px-2 py-0.5 rounded bg-[#EBF3ED] text-[#2D5A38] text-2xs font-mono font-bold">
                {event.courseCode}
              </span>
            )}
            {event.isRecurring && (
              <span className="inline-flex items-center gap-1 text-2xs text-[#7A695C] bg-white px-2 py-0.5 rounded-full border border-[#E5DDD2]">
                <Repeat className="w-3 h-3" />
                <span>Weekly</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8C7A6D] hover:text-[#2E2118]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2118] leading-tight">
                  {event.title}
                </h3>
                {event.moodSticker && <MoodSticker type={event.moodSticker} />}
              </div>

              {event.isDeadline && (
                <div className="p-3 rounded-2xl bg-[#FFEFEF] border border-[#FCA5A5] flex items-center gap-2 text-xs font-semibold text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>University Deadline / Submission Requirement</span>
                </div>
              )}

              <div className="space-y-2.5 text-xs text-[#6F5E52] py-2 border-y border-[#EFE8DE]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8C7A6D]" />
                  <span className="font-semibold text-[#3D2E24]">{event.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C7A6D]" />
                  <span className="font-medium text-[#3D2E24]">
                    {formatTime12h(event.startTime)}
                    {event.endTime && ` – ${formatTime12h(event.endTime)}`}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8C7A6D]" />
                    <span>{event.location}</span>
                    {event.room && (
                      <span className="font-mono text-2xs px-1.5 py-0.5 rounded bg-black/5">
                        {event.room}
                      </span>
                    )}
                  </div>
                )}

                {event.instructor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8C7A6D]" />
                    <span>Instructor: {event.instructor}</span>
                  </div>
                )}
              </div>

              {event.notes && (
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] text-xs text-[#6E5D50] leading-relaxed">
                  <span className="font-semibold block text-[#3D2E24] mb-1">Notes:</span>
                  {event.notes}
                </div>
              )}
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EAE2D7]">
            <button
              type="button"
              onClick={() => {
                onDeleteEvent(event.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C53030] hover:bg-[#FEE2E2] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#6E5D50] bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#4C855B] hover:bg-[#3D6E49]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#3D2E24] bg-[#FAF7F2] hover:bg-[#F0EAE0] border border-[#D8CEBF]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
