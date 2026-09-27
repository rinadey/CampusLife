import React, { useState } from 'react';
import { DayOfWeek, UniversityCourse, UserProfile } from '../types';
import { DAYS_OF_WEEK, formatTime12h } from '../utils/dateUtils';
import {
  GraduationCap,
  Plus,
  Clock,
  MapPin,
  User,
  Calendar,
  BookOpen,
  Trash2,
  Edit2,
  Check,
  X,
} from 'lucide-react';

interface TimetableManagerProps {
  courses: UniversityCourse[];
  user: UserProfile;
  onAddCourse: (course: Omit<UniversityCourse, 'id'>) => void;
  onUpdateCourse: (course: UniversityCourse) => void;
  onDeleteCourse: (id: string) => void;
}

const COURSE_COLOR_PRESETS = [
  '#84A98C', // Sage
  '#E07A5F', // Terracotta
  '#F4A261', // Soft orange
  '#B5838D', // Mauve
  '#6D9DC5', // Periwinkle
  '#80CED7', // Ocean mist
  '#DDA15E', // Honey
];

export const TimetableManager: React.FC<TimetableManagerProps> = ({
  courses,
  user,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [room, setRoom] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['Monday', 'Wednesday']);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [color, setColor] = useState(COURSE_COLOR_PRESETS[0]);
  const [credits, setCredits] = useState<number>(3);

  const resetForm = () => {
    setCode('');
    setName('');
    setInstructor('');
    setRoom('');
    setSelectedDays(['Monday', 'Wednesday']);
    setStartTime('10:00');
    setEndTime('11:30');
    setColor(COURSE_COLOR_PRESETS[0]);
    setCredits(3);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingId) {
      onUpdateCourse({
        id: editingId,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        instructor: instructor.trim(),
        room: room.trim(),
        days: selectedDays,
        startTime,
        endTime,
        color,
        credits,
        semester: user.semester,
      });
    } else {
      onAddCourse({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        instructor: instructor.trim(),
        room: room.trim(),
        days: selectedDays,
        startTime,
        endTime,
        color,
        credits,
        semester: user.semester,
      });
    }
    resetForm();
  };

  const startEdit = (course: UniversityCourse) => {
    setEditingId(course.id);
    setCode(course.code);
    setName(course.name);
    setInstructor(course.instructor);
    setRoom(course.room);
    setSelectedDays(course.days);
    setStartTime(course.startTime);
    setEndTime(course.endTime);
    setColor(course.color);
    setCredits(course.credits || 3);
    setIsAdding(true);
  };

  return (
    <div id="timetable-manager-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#E8E0D5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3ED] text-[#2D5A38] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#BDD9C4]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Timetable & Courses</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2E2118]">
            Course Schedule
          </h1>
          <p className="mt-1 text-sm text-[#6E5D50]">
            {user.semester} · {user.university} · Total Credits:{' '}
            <span className="font-semibold text-[#2E2118]">
              {courses.reduce((acc, c) => acc + (c.credits || 0), 0)}
            </span>
          </p>
        </div>

        <button
          id="add-course-btn"
          type="button"
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4C855B] hover:bg-[#3D6E49] text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Add / Edit Form Modal or Inline Panel */}
      {isAdding && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-white border border-[#D5C6B7] shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE2D7]">
            <h3 className="text-lg font-serif font-bold text-[#2E2118]">
              {editingId ? 'Edit Course Details' : 'Register New University Course'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-full text-[#8C7A6D] hover:text-[#2E2118]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS302"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#4C855B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Systems"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#4C855B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Instructor / Professor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. David Vance"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#4C855B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Classroom / Building
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bldg 24 — Room 302"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#4C855B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#4C855B]"
                />
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#6E5D50] mb-1.5">
                Meeting Days * (recurring classes appear automatically on timeline)
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-[#4C855B] text-white border-[#3D6E49]'
                          : 'bg-[#FAF7F2] text-[#6E5D50] border-[#D8CEBF] hover:bg-[#F3EDE3]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time and Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {COURSE_COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-[#3D2E24]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE2D7]">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DE] text-xs font-medium text-[#6E5D50]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#4C855B] hover:bg-[#3D6E49] text-xs font-bold text-white shadow-2xs"
              >
                {editingId ? 'Update Course' : 'Save Course to Timetable'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-3xl bg-white border border-[#EAE2D7] shadow-xs hover:shadow-sm transition-all relative overflow-hidden"
          >
            {/* Top Color Accent Strip */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: course.color }}
            />

            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span
                  className="px-2 py-0.5 rounded text-2xs font-mono font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: course.color }}
                >
                  {course.code}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#2E2118] mt-1.5">
                  {course.name}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(course)}
                  className="p-1.5 rounded-lg text-[#8C7A6D] hover:text-[#2E2118] hover:bg-black/5"
                  title="Edit course"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCourse(course.id)}
                  className="p-1.5 rounded-lg text-[#8C7A6D] hover:text-[#C53030] hover:bg-black/5"
                  title="Delete course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[#6E5D50] mt-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8C7A6D]" />
                <span className="font-medium text-[#3D2E24]">
                  {course.days.join(', ')} · {formatTime12h(course.startTime)} –{' '}
                  {formatTime12h(course.endTime)}
                </span>
              </div>

              {course.room && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8C7A6D]" />
                  <span>{course.room}</span>
                </div>
              )}

              {course.instructor && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8C7A6D]" />
                  <span>{course.instructor}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Matrix Schedule Overview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE2D7] shadow-xs">
        <h3 className="text-lg font-serif font-bold text-[#2E2118] mb-1">
          Weekly Matrix Overview
        </h3>
        <p className="text-xs text-[#7A695C] mb-4">
          Visual distribution of lectures across the week.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const dayCourses = courses.filter((c) => c.days.includes(day));
            return (
              <div
                key={day}
                className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D7] min-h-[140px] flex flex-col"
              >
                <span className="text-xs font-bold font-mono text-[#3D2E24] uppercase border-b border-[#E8E0D4] pb-1 mb-2">
                  {day.slice(0, 3)}
                </span>

                <div className="space-y-1.5 flex-1">
                  {dayCourses.length === 0 ? (
                    <span className="text-3xs text-[#A8988B] italic">No classes</span>
                  ) : (
                    dayCourses.map((c) => (
                      <div
                        key={c.id}
                        className="p-1.5 rounded-lg text-white text-2xs font-medium shadow-2xs leading-tight"
                        style={{ backgroundColor: c.color }}
                      >
                        <span className="font-bold block">{c.code}</span>
                        <span className="opacity-90 block text-3xs">
                          {formatTime12h(c.startTime)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
