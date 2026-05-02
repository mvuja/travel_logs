import { useState } from 'react';
import { ActivityPieChart } from './ActivityPieChart';
import { CountryHeatmap } from './CountryHeatmap';
import { BarChart2, Globe, ArrowLeft } from 'lucide-react';

type Tab = 'activity' | 'map';

interface Props {
  onBack: () => void;
}

export function DataPage({ onBack }: Props) {
  const [tab, setTab] = useState<Tab>('activity');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Back to logs"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="bg-indigo-600 text-white rounded-lg p-2">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Data Dashboard</h1>
              <p className="text-xs text-gray-400">Insights from your travel logs</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${tab === 'activity' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setTab('activity')}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Activity
            </button>
            <button
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${tab === 'map' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setTab('map')}
            >
              <Globe className="h-3.5 w-3.5" />
              Map
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'activity' ? <ActivityPieChart /> : <CountryHeatmap />}
      </main>
    </div>
  );
}

