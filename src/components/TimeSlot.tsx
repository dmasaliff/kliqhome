"use client";

import { LucideIcon } from "lucide-react";

interface TimeSlotProps {
  icon: LucideIcon;
  label: string;
  time: string;
  isActive: boolean;
  onSelect: () => void;
}

export function TimeSlot({ icon: Icon, label, time, isActive, onSelect }: TimeSlotProps) {
  return (
    <button 
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 w-full cursor-pointer
        ${isActive 
          ? 'border-blue-600 bg-blue-600 text-white shadow-md scale-105' 
          : 'border-blue-100 bg-white text-gray-700 hover:border-blue-300'}`}
    >
      <Icon className={isActive ? 'text-white' : 'text-blue-500'} size={24} />
      <span className="font-bold text-[12px] mt-1">{label}</span>
      <span className="text-[10px] ${isActive ? 'text-blue-100' : 'text-gray-400'}">{time}</span>
    </button>
  );
}