import React from 'react';
import { EventCategory } from '../types';
import {
  GraduationCap,
  Heart,
  FileCheck,
  Users,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: EventCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CATEGORY_CONFIG: Record<
  EventCategory,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    text: string;
    border: string;
    dotColor: string;
    tagLabel: string;
    accentEmoji: string;
  }
> = {
  university: {
    label: 'University',
    icon: GraduationCap,
    bg: 'bg-[#EBF3ED]',
    text: 'text-[#2D5A38]',
    border: 'border-[#BDD9C4]',
    dotColor: '#4C855B',
    tagLabel: 'Academic',
    accentEmoji: '🟢',
  },
  personal: {
    label: 'Personal',
    icon: Heart,
    bg: 'bg-[#FBECEB]',
    text: 'text-[#8A3A4A]',
    border: 'border-[#F4C5C7]',
    dotColor: '#C45E71',
    tagLabel: 'Lifestyle',
    accentEmoji: '🩷',
  },
  assignments: {
    label: 'Assignments',
    icon: FileCheck,
    bg: 'bg-[#FDF1E6]',
    text: 'text-[#8F4312]',
    border: 'border-[#F8D2B4]',
    dotColor: '#D96B27',
    tagLabel: 'Deadline',
    accentEmoji: '🟠',
  },
  social: {
    label: 'Social',
    icon: Users,
    bg: 'bg-[#FEF9E7]',
    text: 'text-[#7D6314]',
    border: 'border-[#FBE8A6]',
    dotColor: '#E0AC18',
    tagLabel: 'Hangout',
    accentEmoji: '🟡',
  },
  appointments: {
    label: 'Appointments',
    icon: CalendarCheck,
    bg: 'bg-[#EBF3FB]',
    text: 'text-[#25527A]',
    border: 'border-[#BFDAF4]',
    dotColor: '#3B82F6',
    tagLabel: 'Booking',
    accentEmoji: '🔵',
  },
  urgent: {
    label: 'Important',
    icon: AlertCircle,
    bg: 'bg-[#FDECEB]',
    text: 'text-[#942621]',
    border: 'border-[#F8BDBA]',
    dotColor: '#E03131',
    tagLabel: 'Priority',
    accentEmoji: '🔴',
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
}) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.personal;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
