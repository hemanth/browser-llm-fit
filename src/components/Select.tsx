import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  value,
  onChange,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="relative inline-flex items-center w-full">
      {label && <span className="text-[#707070] mr-2 text-[11px] shrink-0">{label}</span>}
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`appearance-none w-full bg-[#0A0A0A] hover:bg-[#121212] text-[#EDEDED] text-xs font-normal border border-[#262626] hover:border-[#404040] focus:border-[#4D4D4D] focus:outline-none focus:ring-2 focus:ring-[#0072F5]/30 rounded-md pl-2.5 pr-8 py-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[#0A0A0A] text-[#EDEDED] py-1"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707070]">
          <ChevronDown className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
