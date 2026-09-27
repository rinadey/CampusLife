import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScheduleEvent, UniversityCourse, UserProfile } from './types';
import {
  INITIAL_EVENTS,
  INITIAL_COURSES,
  INITIAL_USER_PROFILE,
} from './sampleData';
import { Navigation, NavTab } from './components/Navigation';
import { MagazineTimeline } from './components/MagazineTimeline';
import { HomeDashboard } from './components/HomeDashboard';
import { TimetableManager } from './components/TimetableManager';
import { TaskManager } from './components/TaskManager';
import { AddActivityModal } from './components/AddActivityModal';
import { EventDetailModal } from './components/EventDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { expandRecurringEvents, sortEventsChronologically } from './utils/dateUtils';
import { Check, Sparkles } from 'lucide-react';

const STORAGE_KEY_EVENTS = 'campuslife_events_v1';
const STORAGE_KEY_COURSES = 'campuslife_courses_v1';
const STORAGE_KEY_PROFILE = 'campuslife_profile_v1';

export default function App() {
  // Navigation tab state - default to 'schedule' as specified in requirements
  const [currentTab, setCurrentTab] = useState<NavTab>('schedule');

  // Core Data State
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [courses, setCourses] = useState<UniversityCourse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('campuslife_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('campuslife_dark_mode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to persist events to localStorage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to persist courses to localStorage', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist profile to localStorage', e);
    }
  }, [user]);

  // Event Handlers
  const handleToggleTask = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          return { ...ev, completed: !ev.completed };
        }
        return ev;
      })
    );
  };

  const handleAddEvents = (newItems: Omit<ScheduleEvent, 'id'>[]) => {
    const timestamp = Date.now();
    const created: ScheduleEvent[] = newItems.map((item, index) => ({
      ...item,
      id: `ev_${timestamp}_${index}`,
    }));

    setEvents((prev) => sortEventsChronologically([...prev, ...created]));
    showToast(
      created.length === 1
        ? `Added "${created[0].title}" to your schedule!`
        : `Added ${created.length} activities to your schedule!`
    );
  };

  const handleUpdateEvent = (updated: ScheduleEvent) => {
    setEvents((prev) =>
      sortEventsChronologically(
        prev.map((ev) => (ev.id === updated.id ? updated : ev))
      )
    );
    showToast(`Updated "${updated.title}"`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    showToast('Activity removed from schedule');
  };

  // Course Handlers
  const handleAddCourse = (newCourse: Omit<UniversityCourse, 'id'>) => {
    const courseId = `course_${Date.now()}`;
    const fullCourse: UniversityCourse = { ...newCourse, id: courseId };
    setCourses((prev) => [...prev, fullCourse]);

    // Also auto-generate recurring classes for the semester
    const newEvents: ScheduleEvent[] = [
      {
        id: `ev_course_${courseId}`,
        title: fullCourse.name,
        category: 'university',
        date: '2026-09-14',
        startTime: fullCourse.startTime,
        endTime: fullCourse.endTime,
        location: fullCourse.room,
        room: fullCourse.room,
        instructor: fullCourse.instructor,
        courseCode: fullCourse.code,
        priority: 'high',
        isRecurring: true,
        recurringDays: fullCourse.days,
        moodSticker: 'book',
        notes: `Registered lecture for ${fullCourse.code}`,
      },
    ];

    setEvents((prev) => sortEventsChronologically([...prev, ...newEvents]));
    showToast(`Registered ${fullCourse.code} and linked to your weekly schedule!`);
  };

  const handleUpdateCourse = (updatedCourse: UniversityCourse) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
    // Also update existing course events
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.courseCode === updatedCourse.code) {
          return {
            ...ev,
            title: updatedCourse.name,
            startTime: updatedCourse.startTime,
            endTime: updatedCourse.endTime,
            location: updatedCourse.room,
            room: updatedCourse.room,
            instructor: updatedCourse.instructor,
            recurringDays: updatedCourse.days,
          };
        }
        return ev;
      })
    );
    showToast(`Updated ${updatedCourse.code} schedule`);
  };

  const handleDeleteCourse = (id: string) => {
    const target = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      setEvents((prev) => prev.filter((ev) => ev.courseCode !== target.code));
    }
    showToast('Course removed from timetable');
  };

  // Reset to initial realistic sample data
  const handleResetSampleData = () => {
    localStorage.removeItem(STORAGE_KEY_EVENTS);
    localStorage.removeItem(STORAGE_KEY_COURSES);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    setEvents(INITIAL_EVENTS);
    setCourses(INITIAL_COURSES);
    setUser(INITIAL_USER_PROFILE);
    showToast('Reset back to default semester schedule!');
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      user,
      courses,
      events,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusLife_Backup_${user.name.toLowerCase()}_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported backup file successfully!');
  };

  // Import JSON backup
  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.events && Array.isArray(parsed.events)) {
        setEvents(parsed.events);
      }
      if (parsed.courses && Array.isArray(parsed.courses)) {
        setCourses(parsed.courses);
      }
      if (parsed.user) {
        setUser(parsed.user);
      }
      showToast('Successfully imported your schedule data!');
    } catch {
      showToast('Error: Invalid backup file format.');
    }
  };

  const pendingTasksCount = useMemo(() => {
    return events.filter((e) => (e.isTask || e.category === 'assignments') && !e.completed)
      .length;
  }, [events]);

  const openAddWithDate = (date?: string) => {
    setPrefillDate(date);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-10">
      {/* Editorial Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => openAddWithDate()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        pendingTasksCount={pendingTasksCount}
        isDark={isDark}
        onToggleDark={() => setIsDark((prev: boolean) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'schedule' && (
          <MagazineTimeline
            events={events}
            onToggleTask={handleToggleTask}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            onDeleteEvent={handleDeleteEvent}
            onOpenAddModal={openAddWithDate}
          />
        )}

        {currentTab === 'home' && (
          <HomeDashboard
            user={user}
            events={events}
            onOpenSchedule={() => setCurrentTab('schedule')}
            onOpenTasks={() => setCurrentTab('tasks')}
            onOpenAddModal={() => openAddWithDate()}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            onToggleTask={handleToggleTask}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskManager
            events={events}
            courses={courses}
            onToggleTask={handleToggleTask}
            onAddTask={(task) => handleAddEvents([task as Omit<ScheduleEvent, 'id'>])}
            onDeleteTask={handleDeleteEvent}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
          />
        )}

        {currentTab === 'timetable' && (
          <TimetableManager
            courses={courses}
            user={user}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
      </main>

      {/* Add Activity Modal (Natural language + structured form) */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPrefillDate(undefined);
        }}
        onAddEvents={handleAddEvents}
        courses={courses}
        defaultDate={prefillDate}
      />

      {/* Event Details & Edit Modal */}
      <EventDetailModal
        isOpen={Boolean(selectedEvent)}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onUpdateUser={setUser}
        onResetSampleData={handleResetSampleData}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div
          id="app-toast-message"
          className="fixed bottom-20 md:bottom-8 right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#3D2E24] text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
