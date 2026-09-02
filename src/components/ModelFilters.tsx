import React from 'react';
import { Search, Filter, LayoutGrid, Table, ArrowUpDown, X } from 'lucide-react';

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
    <div className="space-y-4 mb-6">
      {/* Top Search Bar & View Mode Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search models by name, architecture (e.g. Llama, Qwen, Whisper), developer, or task..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick controls: Sort & View Mode */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 mr-2" />
            <span className="text-slate-500 mr-1.5 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="recommended" className="bg-slate-900 text-slate-200">Compatibility Score (Best First)</option>
              <option value="size-asc" className="bg-slate-900 text-slate-200">Download Size (Smallest First)</option>
              <option value="size-desc" className="bg-slate-900 text-slate-200">Download Size (Largest First)</option>
              <option value="params-asc" className="bg-slate-900 text-slate-200">Parameter Count (Smallest First)</option>
              <option value="params-desc" className="bg-slate-900 text-slate-200">Parameter Count (Largest First)</option>
              <option value="ram-asc" className="bg-slate-900 text-slate-200">Min RAM (Lowest First)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Comparison Table View"
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modality Chips Carousel / Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {modalities.map((m) => {
          const isSelected = selectedModality === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectModality(m.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <span>{m.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {m.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter Row: Compatibility Tiers & Frameworks */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        {/* Compatibility Tier Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Status:
          </span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'smooth', label: '🟢 Runs Smoothly' },
            { id: 'moderate', label: '🟡 Moderate / Tight' },
            { id: 'incompatible', label: '🔴 Incompatible' },
          ].map((t) => {
            const isSelected = selectedTier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTier(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Framework Filter & Match Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Framework:</span>
            <select
              value={selectedFramework}
              onChange={(e) => onSelectFramework(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Runtimes</option>
              {frameworks.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 text-xs font-mono">
            Showing <strong className="text-white">{filteredCount}</strong> of {totalModels} models
          </span>
        </div>
      </div>
    </div>
  );
};
