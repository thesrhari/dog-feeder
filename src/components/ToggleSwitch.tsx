// src/components/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Pass the full event
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  enabled,
  onChange,
  id,
}) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between cursor-pointer py-1"
    >
      <span className="text-sm font-medium text-gray-700 mr-4">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only peer" // Use peer for state detection
          checked={enabled}
          onChange={onChange}
        />
        <div className="block w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-primary transition"></div>
        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
