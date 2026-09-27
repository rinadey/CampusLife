import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  User,
  GraduationCap,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onResetSampleData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onResetSampleData,
  onExportData,
  onImportData,
}) => {
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.university);
  const [major, setMajor] = useState(user.major);
  const [semester, setSemester] = useState(user.semester);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim() || user.name,
      university: university.trim() || user.university,
      major: major.trim() || user.major,
      semester: semester.trim() || user.semester,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onImportData(text);
          onClose();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="settings-modal"
        className="w-full max-w-lg rounded-3xl bg-white border border-[#D5C6B7] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#E8E0D4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EBF3ED] text-[#2D5A38] flex items-center justify-center">
              ⚙️
            </span>
            <h2 className="text-xl font-serif font-bold text-[#2E2118]">
              Organizer Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8C7A6D] hover:text-[#2E2118]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6D] font-mono">
              Student Profile
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                University / College
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6E5D50] mb-1">
                  Current Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CEBF] text-sm text-[#3D2E24]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#3D2E24] hover:bg-[#2A1E16] text-white text-xs font-bold transition-colors"
              >
                Save Profile
              </button>
              {savedMessage && (
                <span className="text-xs text-[#4C855B] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
          </form>

          {/* Backup & Sample Data Actions */}
          <div className="pt-4 border-t border-[#EAE2D7] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6D] font-mono">
              Data Management
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onExportData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE0] border border-[#D8CEBF] text-xs font-medium text-[#3D2E24]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3ECE0] border border-[#D8CEBF] text-xs font-medium text-[#3D2E24] cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset schedule and timetable back to default realistic sample data?')) {
                    onResetSampleData();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#B91C1C] text-xs font-medium border border-[#FECACA]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
