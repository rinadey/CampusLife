import React from 'react';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  GraduationCap,
  Plus,
  Settings,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';

export type NavTab = 'home' | 'schedule' | 'tasks' | 'timetable';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  pendingTasksCount: number;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenSettings,
  pendingTasksCount,
  isDark,
  onToggleDark,
}) => {
  return (
    <>
      {/* Desktop & Tablet Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE2D7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand / App Identity */}
          <div
            onClick={() => onSelectTab('schedule')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E07A5F] to-[#C45D44] text-white flex items-center justify-center shadow-xs font-serif font-black text-lg">
              C
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-[#2E2118] tracking-tight group-hover:text-[#E07A5F] transition-colors block leading-tight">
                CampusLife
              </span>
              <span className="text-3xs uppercase tracking-widest text-[#8C7A6D] font-mono font-medium block">
                University & Life Journal
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F1EAE0]/80 p-1 rounded-full border border-[#E5DDD2]">
            <button
              id="nav-home-btn"
              type="button"
              onClick={() => onSelectTab('home')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-white text-[#2E2118] shadow-xs'
                  : 'text-[#7A695C] hover:text-[#2E2118]'
              }`}
            >
              <span>✨</span>
              <span>Home</span>
            </button>

            <button
              id="nav-schedule-btn"
              type="button"
              onClick={() => onSelectTab('schedule')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'schedule'
                  ? 'bg-white text-[#2E2118] shadow-xs'
                  : 'text-[#7A695C] hover:text-[#2E2118]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>My Schedule</span>
            </button>

            <button
              id="nav-tasks-btn"
              type="button"
              onClick={() => onSelectTab('tasks')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'tasks'
                  ? 'bg-white text-[#2E2118] shadow-xs'
                  : 'text-[#7A695C] hover:text-[#2E2118]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#4C855B]" />
              <span>Tasks</span>
              {pendingTasksCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#E07A5F] text-white text-3xs font-bold">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            <button
              id="nav-timetable-btn"
              type="button"
              onClick={() => onSelectTab('timetable')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'timetable'
                  ? 'bg-white text-[#2E2118] shadow-xs'
                  : 'text-[#7A695C] hover:text-[#2E2118]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#2D5A38]" />
              <span>Courses</span>
            </button>
          </nav>

          {/* Right Controls: Add Activity & Settings */}
          <div className="flex items-center gap-2">
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={onToggleDark}
              className="p-2 rounded-full text-[#7A695C] dark:text-[#EAD8DC] hover:text-[#2E2118] dark:hover:text-white hover:bg-[#FFE3EA] dark:hover:bg-[#34242F] transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FBBF24]" /> : <Moon className="w-4 h-4 text-[#8C4A60]" />}
            </button>

            <button
              id="nav-add-btn"
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#E07A5F] hover:bg-[#D2684E] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>

            <button
              id="nav-settings-btn"
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-full text-[#7A695C] dark:text-[#EAD8DC] hover:text-[#2E2118] dark:hover:text-white hover:bg-[#EAE2D7] dark:hover:bg-[#34242F] transition-colors"
              title="Settings & Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EAE2D7] px-3 py-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1 text-2xs font-medium ${
            currentTab === 'home' ? 'text-[#E07A5F] font-bold' : 'text-[#8C7A6D]'
          }`}
        >
          <span className="text-base">✨</span>
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('schedule')}
          className={`flex flex-col items-center gap-0.5 p-1 text-2xs font-medium ${
            currentTab === 'schedule' ? 'text-[#E07A5F] font-bold' : 'text-[#8C7A6D]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Schedule</span>
        </button>

        {/* Center Quick Add Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="-mt-5 w-11 h-11 rounded-full bg-[#E07A5F] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center gap-0.5 p-1 text-2xs font-medium relative ${
            currentTab === 'tasks' ? 'text-[#E07A5F] font-bold' : 'text-[#8C7A6D]'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Tasks</span>
          {pendingTasksCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#E07A5F]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('timetable')}
          className={`flex flex-col items-center gap-0.5 p-1 text-2xs font-medium ${
            currentTab === 'timetable' ? 'text-[#E07A5F] font-bold' : 'text-[#8C7A6D]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Courses</span>
        </button>
      </nav>
    </>
  );
};
