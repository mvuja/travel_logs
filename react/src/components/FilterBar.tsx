import { useEffect, useState } from 'react';
import { api } from '@/api';
import type { TravelLogType } from '@/types';
import type { SortField, SortDir } from './TravelLogList';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';

const SORT_LABELS: Record<SortField, string> = {
  date:    'Date',
  type:    'Type',
  country: 'Country',
};

const TYPE_OPTIONS: { value: TravelLogType; label: string }[] = [
  { value: 'flight', label: '✈️ Flight' },
  { value: 'rail',   label: '🚆 Rail' },
  { value: 'car',    label: '🚗 Car' },
  { value: 'hotel',  label: '🏨 Hotel' },
];

export interface Filters {
  type: string;
  country: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  sortField: SortField;
  sortDir: SortDir;
  filters: Filters;
  onToggleSort: (field: SortField) => void;
  onFiltersChange: (filters: Filters) => void;
}

export function FilterBar({ sortField, sortDir, filters, onToggleSort, onFiltersChange }: FilterBarProps) {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    api.listCountries().then(setCountries).catch(() => {});
  }, []);

  function set(key: keyof Filters, value: string) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onFiltersChange({ type: '', country: '', dateFrom: '', dateTo: '' });
  }

  const hasActiveFilters = filters.type || filters.country || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-3 space-y-3 shadow-sm">
      {/* Sort row */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-gray-400 mr-1 shrink-0">Sort by:</span>
        {(['date', 'type', 'country'] as SortField[]).map((field) => {
          const active = sortField === field;
          const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
          return (
            <button
              key={field}
              onClick={() => onToggleSort(field)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                ${active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
            >
              <Icon className="h-3 w-3" />
              {SORT_LABELS[field]}
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type */}
        <Select value={filters.type || '__all__'} onValueChange={(v) => set('type', v === '__all__' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country */}
        <Select value={filters.country || '__all__'} onValueChange={(v) => set('country', v === '__all__' ? '' : v)}>
          <SelectTrigger className="h-8 text-xs w-44">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date from */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 shrink-0">From</span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set('dateFrom', e.target.value)}
            className="h-8 text-xs w-36"
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 shrink-0">To</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set('dateTo', e.target.value)}
            className="h-8 text-xs w-36"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs text-gray-400 hover:text-red-500 px-2">
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}

