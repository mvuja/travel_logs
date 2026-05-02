import { useState, useEffect, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, X } from 'lucide-react';

export interface LocationResult {
  placeName: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    country?: string;
  };
}

async function searchNominatim(query: string): Promise<LocationResult[]> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '5');

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'travel-log-app' },
  });

  if (!res.ok) throw new Error('Nominatim request failed');

  const data: NominatimResult[] = await res.json();

  return data.map((item) => ({
    placeName: item.display_name,
    city:
      item.address.city ??
      item.address.town ??
      item.address.village ??
      item.address.county ??
      '',
    country: item.address.country ?? '',
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}

interface Props {
  label: string;
  placeholder?: string;
  value: LocationResult | null;
  onChange: (result: LocationResult | null) => void;
  error?: string;
  required?: boolean;
}

export function LocationSearchInput({
  label,
  placeholder = 'Search city or place…',
  value,
  onChange,
  error,
  required,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const found = await searchNominatim(q);
      setResults(found);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  function handleSelect(result: LocationResult) {
    onChange(result);
    setQuery('');
    setOpen(false);
    setResults([]);
  }

  function handleClear() {
    onChange(null);
    setQuery('');
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>

      {/* Selected value pill */}
      {value ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-blue-800 truncate">{value.city || value.placeName}</p>
            <p className="text-xs text-blue-500">{value.country}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-blue-400 hover:text-blue-700 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative flex items-center">
            {loading ? (
              <Loader2 className="absolute left-3 h-3.5 w-3.5 text-gray-400 animate-spin" />
            ) : (
              <MapPin className="absolute left-3 h-3.5 w-3.5 text-gray-400" />
            )}
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              autoComplete="off"
            />
          </div>

          {/* Dropdown */}
          {open && (
            <ul className="absolute z-[1003] left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-auto">
              {results.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">No results found</li>
              ) : (
                results.map((r, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-start gap-2"
                    onMouseDown={() => handleSelect(r)}
                  >
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{r.city || r.placeName.split(',')[0]}</p>
                      <p className="text-xs text-gray-400 truncate">{r.placeName}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

