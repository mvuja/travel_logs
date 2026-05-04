import { ActivityPieChart } from './ActivityPieChart';
import { CountryHeatmap } from './CountryHeatmap';

interface InsightsPanelProps {
  version: number;
}

export function InsightsPanel({ version }: InsightsPanelProps) {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Insights</h2>
        <ActivityPieChart version={version} />
      </div>
      <CountryHeatmap version={version} />
    </section>
  );
}

