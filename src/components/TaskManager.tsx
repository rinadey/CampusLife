import React, { useState, useMemo } from 'react';
import { EventCategory, EventPriority, ScheduleEvent, UniversityCourse } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { TODAY_ISO, formatTime12h } from '../utils/dateUtils';
import {
  CheckCircle2,
  Circle,
  Plus,
  AlertCircle,
  Calendar,
  Clock,
  Filter,
  Trash2,
  Check,
  Tag,
  Star,
} from 'lucide-react';

interface TaskManagerProps {
  events: ScheduleEvent[];
  courses: UniversityCourse[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Partial<ScheduleEvent>) => void;
  onDeleteTask: (id: string) => void;
  onSelectEvent: (event: ScheduleEvent) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  events,
  courses,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSelectEvent,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed' | 'urgent'>('pending');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // Quick add form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(TODAY_ISO);
  const [newTime, setNewTime] = useState('17:00');
  const [newPriority, setNewPriority] = useState<EventPriority>('high');
  const [newCategory, setNewCategory] = useState<EventCategory>('assignments');
  const [newCourse, setNewCourse] = useState<string>('');

  // Extract all task-like events
  const tasks = useMemo(() => {
    return events.filter((e) => e.isTask || e.category === 'assignments');
  }, [events]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterMode === 'pending' && task.completed) return false;
      if (filterMode === 'completed' && !task.completed) return false;
      if (filterMode === 'urgent' && task.priority !== 'urgent' && !task.isDeadline) return false;
      if (courseFilter !== 'all' && task.courseCode !== courseFilter) return false;
      return true;
    });
  }, [tasks, filterMode, courseFilter]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      startTime: newTime,
      priority: newPriority,
      isTask: true,
      completed: false,
      isDeadline: newCategory === 'assignments',
      courseCode: newCourse || undefined,
      moodSticker: 'star',
    });

    setNewTitle('');
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div id="task-manager-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#E8E0D5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF1E6] text-[#8F4312] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#F8D2B4]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Deadlines & Action Items</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2E2118]">
              Assignments & Tasks
            </h1>
            <p className="mt-1 text-sm text-[#6E5D50]">
              {pendingCount} remaining · {completedCount} completed
            </p>
          </div>

          {/* Filter Horizon */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(
              [
                { id: 'pending', label: 'To-Do' },
                { id: 'urgent', label: '🔴 Urgent / Deadlines' },
                { id: 'completed', label: 'Completed' },
                { id: 'all', label: 'All' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterMode === f.id
                    ? 'bg-[#3D2E24] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#F5EFE6] text-[#7A695C] border border-[#E8E1D5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Task Input Card */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-[#E5DDD2] shadow-xs">
        <form onSubmit={handleQuickAdd} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Submit CS302 Assignment #2, read chapter 4..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#D2684E] disabled:opacity-50 text-white font-medium text-sm transition-colors shadow-2xs shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[#8C7A6D]">Due:</span>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#8C7A6D]">Priority:</span>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as EventPriority)}
                className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>

            {courses.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-[#8C7A6D]">Course:</span>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#D8CEBF] text-xs text-[#3D2E24]"
                >
                  <option value="">(None / General)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code} – {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Course Filter Chips if courses available */}
      {courses.length > 0 && (
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-2xs font-semibold text-[#8C7A6D] uppercase mr-1">Filter:</span>
          <button
            type="button"
            onClick={() => setCourseFilter('all')}
            className={`px-2.5 py-1 rounded-full text-2xs font-medium ${
              courseFilter === 'all'
                ? 'bg-[#3D2E24] text-white'
                : 'bg-white text-[#7A695C] border border-[#E5DDD2]'
            }`}
          >
            All Courses
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCourseFilter(courseFilter === c.code ? 'all' : c.code)}
              className={`px-2.5 py-1 rounded-full text-2xs font-mono font-medium ${
                courseFilter === c.code
                  ? 'bg-[#4C855B] text-white'
                  : 'bg-white text-[#57483C] border border-[#E5DDD2]'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-10 rounded-3xl border border-dashed border-[#E3D8CC] text-center bg-white/50">
            <Check className="w-8 h-8 text-[#4C855B] mx-auto mb-2" />
            <p className="text-base font-serif font-bold text-[#2E2118]">
              No tasks in this category
            </p>
            <p className="text-xs text-[#7A695C] mt-1">
              Add your upcoming homework, project deliverables, or study todos above.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDueToday = task.date === TODAY_ISO;
            return (
              <div
                key={task.id}
                onClick={() => onSelectEvent(task)}
                className={`group p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  task.completed
                    ? 'bg-[#F6F2EC] border-[#E8E1D5] opacity-75'
                    : task.priority === 'urgent'
                    ? 'bg-gradient-to-r from-[#FFFDFD] to-[#FFF5F2] border-[#F8C6BA] shadow-2xs'
                    : 'bg-white border-[#EAE2D7] shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className="mt-0.5 p-1 rounded-full text-[#7A695C] hover:text-[#3D2E24]"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4C855B] fill-[#EBF3ED]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#C9BCAD] hover:text-[#E07A5F]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <CategoryBadge category={task.category} size="sm" />
                      {task.courseCode && (
                        <span className="px-1.5 py-0.5 rounded bg-[#EBF3ED] text-[#2D5A38] text-2xs font-mono font-bold">
                          {task.courseCode}
                        </span>
                      )}
                      {task.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEAE5] text-[#C53030] text-2xs font-bold">
                          🔴 URGENT
                        </span>
                      )}
                      {isDueToday && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-2xs font-bold">
                          Due Today
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-semibold text-[#2E2118] ${
                        task.completed ? 'line-through text-[#99887A]' : ''
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-[#7A695C] mt-1.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[#A8988B]" />
                        {task.date}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#A8988B]" />
                        {formatTime12h(task.startTime)}
                      </span>
                      {task.location && <span>· {task.location}</span>}
                    </div>

                    {task.notes && (
                      <p className="text-xs text-[#8C7A6D] italic mt-1 line-clamp-1">
                        "{task.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-[#8C7A6D] hover:text-[#C53030] hover:bg-black/5"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
