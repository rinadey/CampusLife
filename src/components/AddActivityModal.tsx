import React, { useState, useEffect } from 'react';
import {
  DayOfWeek,
  EventCategory,
  EventPriority,
  ScheduleEvent,
  UniversityCourse,
} from '../types';
import { CATEGORY_CONFIG } from './CategoryBadge';
import { DAYS_OF_WEEK, TODAY_ISO } from '../utils/dateUtils';
import { parseNaturalLanguageInput } from '../utils/naturalLanguageParser';
import {
  Sparkles,
  PenLine,
  X,
  Plus,
  Clock,
  Calendar,
  MapPin,
  User,
  Repeat,
  AlertCircle,
  Check,
  Loader2,
  Wand2,
} from 'lucide-react';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvents: (events: Omit<ScheduleEvent, 'id'>[]) => void;
  courses: UniversityCourse[];
  defaultDate?: string;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAddEvents,
  courses,
  defaultDate,
}) => {
  const [activeTab, setActiveTab] = useState<'magic' | 'manual'>('magic');

  // Magic NLP State
  const [naturalText, setNaturalText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedDrafts, setParsedDrafts] = useState<Omit<ScheduleEvent, 'id'>[]>([]);
  const [usedAIBadge, setUsedAIBadge] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Manual Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('university');
  const [date, setDate] = useState(defaultDate || TODAY_ISO);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [location, setLocation] = useState('');
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<DayOfWeek[]>(['Monday']);
  const [isTask, setIsTask] = useState(false);
  const [reminder, setReminder] = useState('15m');
  const [moodSticker, setMoodSticker] = useState<string>('book');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  if (!isOpen) return null;

  const handleMagicParse = async (textToParse?: string) => {
    const query = textToParse || naturalText;
    if (!query.trim()) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseNaturalLanguageInput(query, defaultDate || TODAY_ISO);
      if (result.items.length === 0) {
        setParseError('No specific activities or times recognized. Try adding a time or day!');
      } else {
        const mapped: Omit<ScheduleEvent, 'id'>[] = result.items.map((item) => ({
          title: item.title,
          category: item.category,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          location: item.location,
          room: item.room,
          instructor: item.instructor,
          notes: item.notes,
          priority: item.priority || 'medium',
          isRecurring: item.isRecurring,
          recurringDays: item.recurringDays,
          isTask: item.isTask,
          completed: false,
          isDeadline: item.category === 'assignments',
          moodSticker:
            item.category === 'university'
              ? 'book'
              : item.category === 'social'
              ? 'heart'
              : item.category === 'assignments'
              ? 'star'
              : 'sparkles',
        }));
        setParsedDrafts(mapped);
        setUsedAIBadge(result.usedAI);
      }
    } catch {
      setParseError('Failed to parse input. Please try again or use the manual form.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveDrafts = () => {
    if (parsedDrafts.length > 0) {
      onAddEvents(parsedDrafts);
      onClose();
      setParsedDrafts([]);
      setNaturalText('');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: Omit<ScheduleEvent, 'id'> = {
      title: title.trim(),
      category,
      date,
      startTime,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      room: room.trim() || undefined,
      instructor: instructor.trim() || undefined,
      notes: notes.trim() || undefined,
      priority,
      isRecurring,
      recurringDays: isRecurring ? recurringDays : undefined,
      isTask: isTask || category === 'assignments',
      completed: false,
      isDeadline: category === 'assignments',
      courseCode: selectedCourseCode || undefined,
      reminder,
      moodSticker,
    };

    onAddEvents([newEvent]);
    onClose();
  };

  const toggleRecurringDay = (day: DayOfWeek) => {
    if (recurringDays.includes(day)) {
      if (recurringDays.length > 1) {
        setRecurringDays(recurringDays.filter((d) => d !== day));
      }
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  return (
    <div
      id="add-activity-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="add-activity-modal"
        className="w-full max-w-2xl rounded-3xl bg-white border border-[#D5C6B7] shadow-xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8E0D4] flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2118]">
              Add to Your Life Organizer
            </h2>
            <p className="text-xs sm:text-sm text-[#7A695C] mt-0.5">
              Classes, assignments, coffee hangs, doctor visits, or quick reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C7A6D] hover:text-[#2E2118] hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE2D7] bg-white px-5 sm:px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('magic')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'magic'
                ? 'border-[#E07A5F] text-[#E07A5F]'
                : 'border-transparent text-[#7A695C] hover:text-[#2E2118]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>Smart Natural Input ✨</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'manual'
                ? 'border-[#E07A5F] text-[#E07A5F]'
                : 'border-transparent text-[#7A695C] hover:text-[#2E2118]'
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span>Structured Form 📝</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'magic' ? (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-[#6E5D50]">
                Type or paste whatever you need to remember in natural speech:
              </label>

              <textarea
                rows={3}
                placeholder="e.g. I have a Java lecture every Sunday and Tuesday at 10 AM, a dentist appointment on September 20 at 5 PM, and dinner with my friends Friday at 8 PM."
                value={naturalText}
                onChange={(e) => setNaturalText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] placeholder:text-[#A8988B]"
              />

              {/* Sample Prompts for Quick Testing */}
              <div className="text-2xs text-[#8C7A6D] flex flex-wrap items-center gap-1.5">
                <span className="font-semibold">Try sample:</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'I have a Java lecture every Sunday and Tuesday at 10 AM, a dentist appointment on September 20 at 5 PM, and dinner with my friends Friday at 8 PM.';
                    setNaturalText(sample);
                    handleMagicParse(sample);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#FAF4ED] hover:bg-[#F3E8DB] text-[#7A6250] border border-[#E8DFD3]"
                >
                  Prompt Example (3 Events)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sample =
                      'Art Club pottery workshop on Monday at 7 PM in Fine Arts Pavilion Studio B';
                    setNaturalText(sample);
                    handleMagicParse(sample);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#FAF4ED] hover:bg-[#F3E8DB] text-[#7A6250] border border-[#E8DFD3]"
                >
                  Art Club on Monday 7pm
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleMagicParse()}
                  disabled={isParsing || !naturalText.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E07A5F] hover:bg-[#D2684E] disabled:opacity-50 text-white text-sm font-bold shadow-2xs transition-all"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Understanding your life...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Parse & Structure</span>
                    </>
                  )}
                </button>

                {usedAIBadge && (
                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-[#4C855B] bg-[#EBF3ED] px-2.5 py-1 rounded-full border border-[#BDD9C4]">
                    <Sparkles className="w-3 h-3" />
                    <span>Gemini AI Processed</span>
                  </span>
                )}
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#B91C1C] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Parsed Previews */}
              {parsedDrafts.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#EAE2D7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3D2E24] font-mono">
                      Recognized ({parsedDrafts.length} activities):
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveDrafts}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4C855B] text-white text-xs font-bold shadow-2xs hover:bg-[#3D6E49]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Add All to Schedule</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {parsedDrafts.map((draft, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between text-xs gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#2E2118] text-sm">
                              {draft.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white text-[#6E5D50] text-3xs font-semibold border border-[#E8DFD3]">
                              {draft.category}
                            </span>
                          </div>
                          <div className="text-2xs text-[#7A695C] flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>📅 {draft.date}</span>
                            <span>⏰ {draft.startTime}</span>
                            {draft.location && <span>📍 {draft.location}</span>}
                            {draft.isRecurring && (
                              <span className="text-[#B45309] font-medium">
                                🔄 Weekly ({draft.recurringDays?.join(', ')})
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setParsedDrafts(parsedDrafts.filter((_, i) => i !== idx));
                          }}
                          className="text-[#A8988B] hover:text-[#C53030] p-1"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Systems Lecture, Dinner with Sara, Dentist..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                />
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1.5">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          if (cat === 'assignments') setIsTask(true);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? `${cfg.bg} ${cfg.text} ${cfg.border} font-bold ring-2 ring-[#3D2E24]/20 shadow-2xs`
                            : 'bg-[#FAF7F2] text-[#6E5D50] border-[#E5DDD2] hover:bg-[#F3EDE3]'
                        }`}
                      >
                        <span>{cfg.accentEmoji}</span>
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    End Time (optional)
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>
              </div>

              {/* Location & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. University Café, Building 24"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Room / Suite
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 302"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  />
                </div>
              </div>

              {/* Course link (optional) */}
              {courses.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Link to Course (optional)
                  </label>
                  <select
                    value={selectedCourseCode}
                    onChange={(e) => setSelectedCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  >
                    <option value="">(None)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} – {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recurring Switch */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#3D2E24] flex items-center gap-1.5 cursor-pointer">
                    <Repeat className="w-3.5 h-3.5 text-[#8C7A6D]" />
                    <span>Recurring Event / Class</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-[#E07A5F] rounded"
                  />
                </div>

                {isRecurring && (
                  <div className="pt-2 border-t border-[#E8DFD3]">
                    <span className="text-2xs text-[#7A695C] block mb-1.5 font-medium">
                      Repeats on days:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {DAYS_OF_WEEK.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleRecurringDay(d)}
                          className={`px-2.5 py-1 rounded-lg text-2xs font-medium border ${
                            recurringDays.includes(d)
                              ? 'bg-[#4C855B] text-white border-[#3D6E49]'
                              : 'bg-white text-[#6E5D50] border-[#D8CEBF]'
                          }`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Priority & Mood Sticker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as EventPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">🔴 Urgent / Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                    Vibe Sticker
                  </label>
                  <select
                    value={moodSticker}
                    onChange={(e) => setMoodSticker(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                  >
                    <option value="book">📚 Study / Class</option>
                    <option value="coffee">☕ Coffee / Relax</option>
                    <option value="heart">💗 Social / Friends</option>
                    <option value="sun">☀️ Daytime / Fresh</option>
                    <option value="palette">🎨 Creative / Club</option>
                    <option value="sparkles">✨ Special Event</option>
                    <option value="star">⭐ Important / Deadline</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Read chapters 4-5 beforehand, bring sketchbook, wear comfortable shoes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE2D7]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] text-xs font-medium text-[#6E5D50]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E07A5F] hover:bg-[#D2684E] text-xs font-bold text-white shadow-2xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
