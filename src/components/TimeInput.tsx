import React from 'react';

interface TimeInputProps {
  label: string;
  minutes: number;
  seconds: number;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
  disabled?: boolean;
}

export function TimeInput({
  label,
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange,
  disabled = false,
}: TimeInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => onMinutesChange(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            disabled={disabled}
            className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <span className="text-xs text-gray-500 mt-1">Minutes</span>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => onSecondsChange(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            disabled={disabled}
            className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <span className="text-xs text-gray-500 mt-1">Seconds</span>
        </div>
      </div>
    </div>
  );
}