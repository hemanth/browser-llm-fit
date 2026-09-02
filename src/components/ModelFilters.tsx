import React from 'react';
import { Search, LayoutGrid, Table, X } from 'lucide-react';
import { Select } from './Select';

interface ModelFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedModality: string;
  onSelectModality: (m: string) => void;
  selectedFramework: string;
  onSelectFramework: (f: string) => void;
  selectedTier: string;
  onSelectTier: (t: string) => void;
  sortBy: string;
  onSortByChange: (s: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (v: 'grid' | 'table') => void;
  totalModels: number;
  filteredCount: number;
  modalities: { id: string; label: string; count: number }[];
  frameworks: string[];
}

export const ModelFilters: React.FC<ModelFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedModality,
  onSelectModality,
  selectedFramework,
  onSelectFramework,
  selectedTier,
  onSelectTier,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  totalModels,
  filteredCount,
  modalities,
  frameworks,
}) => {
  return (
    <div className="space-y-3 mb-6">
      {/* Search and Main Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#707070] pointer-events-none" />
          <input
            type="text"
            placeholder="Search models by name, architecture (e.g. Llama, Qwen, Whisper), or task..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg pl-9 pr-8 py-2 text-xs text-[#EDEDED] placeholder-[#707070] focus:outline-none focus:border-[#4D4D4D] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#707070] hover:text-[#EDEDED]"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Sort & View Mode */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-48">
            <Select
              label="Sort:"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              options={[
                { value: 'recommended', label: 'Compatibility Score' },
                { value: 'size-asc', label: 'Size (Smallest)' },
                { value: 'size-desc', label: 'Size (Largest)' },
                { value: 'params-asc', label: 'Params (Lowest)' },
                { value: 'params-desc', label: 'Params (Highest)' },
                { value: 'ram-asc', label: 'RAM (Lowest)' },
              ]}
            />
          </div>

          <div className="flex items-center bg-[#0A0A0A] border border-[#262626] rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#1F1F1F] text-[#EDEDED]'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#1F1F1F] text-[#EDEDED]'
                  : 'text-[#707070] hover:text-[#EDEDED]'
              }`}
              title="Table View"
            >
              <Table className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modality Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#1F1F1F] text-xs">
        {modalities.map((m) => {
          const isSelected = selectedModality === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModality(m.id)}
              className={`px-3 py-1.5 text-xs font-normal whitespace-nowrap transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                isSelected
                  ? 'border-[#EDEDED] text-[#EDEDED] font-medium'
                  : 'border-transparent text-[#707070] hover:text-[#A1A1A1]'
              }`}
            >
              <span>{m.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-[#1F1F1F] text-[#EDEDED]' : 'bg-[#121212] text-[#707070]'}`}>
                {m.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Indicators & Framework Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        {/* Status Dots */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#707070] text-[11px] mr-1">Status:</span>
          {[
            { id: 'all', label: 'All', dot: null },
            { id: 'smooth', label: 'Runs Smoothly', dot: 'bg-[#398E4A]' },
            { id: 'moderate', label: 'Tight Fit', dot: 'bg-[#FF990A]' },
            { id: 'incompatible', label: 'Unsupported', dot: 'bg-[#E5484D]' },
          ].map((t) => {
            const isSelected = selectedTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTier(t.id)}
                className={`h-6 px-2 rounded-md text-[11px] font-normal transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1F1F1F] text-[#EDEDED] font-medium'
                    : 'text-[#707070] hover:text-[#EDEDED] hover:bg-[#121212]'
                }`}
              >
                {t.dot && <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`}></span>}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Framework & Count */}
        <div className="flex items-center space-x-3">
          <div className="w-44">
            <Select
              label="Runtime:"
              value={selectedFramework}
              onChange={(e) => onSelectFramework(e.target.value)}
              options={[
                { value: 'all', label: 'All Runtimes' },
                ...frameworks.map((f) => ({ value: f, label: f }))
              ]}
            />
          </div>

          <span className="text-[11px] font-mono text-[#707070]">
            {filteredCount} of {totalModels} models
          </span>
        </div>
      </div>
    </div>
  );
};
