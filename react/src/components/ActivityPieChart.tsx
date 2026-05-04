import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api, type TypeStats } from '@/api';
import {Plane} from "lucide-react";

const COLORS: Record<string, string> = {
  Flights: '#0284c7',
  Rail:    '#7c3aed',
  Cars:    '#d97706',
  Hotels:  '#059669',
};

const EMOJI: Record<string, string> = {
  Flights: '✈️',
  Rail:    '🚆',
  Cars:    '🚗',
  Hotels:  '🏨',
};

interface ChartEntry { name: string; value: number }

function buildEntries(stats: TypeStats): ChartEntry[] {
  return [
    { name: 'Flights', value: stats.flights },
    { name: 'Rail',    value: stats.rail },
    { name: 'Cars',    value: stats.cars },
    { name: 'Hotels',  value: stats.hotels },
  ].filter((e) => e.value > 0);
}

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: ChartEntry }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <span className="font-medium">{EMOJI[name]} {name}</span>
      <span className="ml-2 text-gray-500">{value} log{value !== 1 ? 's' : ''}</span>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  if (!payload) return null;
  return (
    <ul className="flex flex-col gap-1.5 justify-center text-sm">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-gray-600">{EMOJI[entry.value]} {entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function ActivityPieChart({ version = 0 }: { version?: number }) {
  const [stats, setStats] = useState<TypeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getTypeStats()
      .then((data) => { if (!cancelled) { setStats(data); setError(null); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError('Failed to load stats'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [version]);

  if (loading) {
    return <div className="flex justify-center py-20 text-gray-400 text-sm">Loading…</div>;
  }
  if (error) {
    return <div className="flex justify-center py-20 text-red-400 text-sm">{error}</div>;
  }

  const entries = buildEntries(stats!);
  const total = entries.reduce((s, e) => s + e.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-2 text-gray-400">
          <Plane className="h-12 w-12 opacity-30" />
        <p className="text-sm">No travel logs yet to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Activity Breakdown</h2>
      <p className="text-xs text-gray-400 mb-6">{total} total log{total !== 1 ? 's' : ''}</p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={entries}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={0}
            dataKey="value"
          >
            {entries.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} stroke="white" strokeWidth={4} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-100">
        {[
          { label: 'Flights', value: stats!.flights, color: COLORS.Flights, emoji: '✈️' },
          { label: 'Rail',    value: stats!.rail,    color: COLORS.Rail,    emoji: '🚆' },
          { label: 'Cars',    value: stats!.cars,    color: COLORS.Cars,    emoji: '🚗' },
          { label: 'Hotels',  value: stats!.hotels,  color: COLORS.Hotels,  emoji: '🏨' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <span className="text-xl">{item.emoji}</span>
            <span className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</span>
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


