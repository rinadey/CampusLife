import React from 'react';
import {
  Sun,
  Coffee,
  BookOpen,
  Sparkles,
  Heart,
  Palette,
  Star,
  Flame,
  Music,
  MapPin,
} from 'lucide-react';

interface MoodStickerProps {
  type?: string;
  className?: string;
}

export const MoodSticker: React.FC<MoodStickerProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'sun':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] shadow-sm border border-[#FDE68A] ${className}`}
          title="Morning / Daytime"
        >
          <Sun className="w-4 h-4" />
        </span>
      );
    case 'coffee':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F5EBE6] text-[#8C4A32] shadow-sm border border-[#E8D5CE] ${className}`}
          title="Coffee / Study Break"
        >
          <Coffee className="w-4 h-4" />
        </span>
      );
    case 'book':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#EBF3ED] text-[#2D5A38] shadow-sm border border-[#BDD9C4] ${className}`}
          title="Class / Study Session"
        >
          <BookOpen className="w-4 h-4" />
        </span>
      );
    case 'sparkles':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F3E8FF] text-[#7E22CE] shadow-sm border border-[#E9D5FF] ${className}`}
          title="Special Event"
        >
          <Sparkles className="w-4 h-4" />
        </span>
      );
    case 'heart':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FCE7F3] text-[#BE185D] shadow-sm border border-[#FBCFE8] ${className}`}
          title="Friends / Social"
        >
          <Heart className="w-4 h-4" />
        </span>
      );
    case 'palette':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFBEB] text-[#B45309] shadow-sm border border-[#FDE68A] ${className}`}
          title="Creative / Club"
        >
          <Palette className="w-4 h-4" />
        </span>
      );
    case 'star':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF2F2] text-[#DC2626] shadow-sm border border-[#FECACA] ${className}`}
          title="Important / Due"
        >
          <Star className="w-4 h-4" />
        </span>
      );
    case 'fire':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF7ED] text-[#EA580C] shadow-sm border border-[#FFEDD5] ${className}`}
        >
          <Flame className="w-4 h-4" />
        </span>
      );
    case 'music':
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#EDE9FE] text-[#6D28D9] shadow-sm border border-[#DDD6FE] ${className}`}
        >
          <Music className="w-4 h-4" />
        </span>
      );
    default:
      return null;
  }
};
