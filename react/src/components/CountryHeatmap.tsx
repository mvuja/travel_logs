import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { api } from '@/api';
import 'leaflet/dist/leaflet.css';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

function getColor(count: number): string {
  return count > 5 ? '#08306b'
    : count > 3   ? '#2171b5'
    : count > 1   ? '#6baed6'
    : count > 0   ? '#c6dbef'
    :               '#f8fafc';
}

const LEGEND_ITEMS = [
  { label: '0 visits',  color: '#f8fafc' },
  { label: '1 visit',   color: '#c6dbef' },
  { label: '2–3',       color: '#6baed6' },
  { label: '4–5',       color: '#2171b5' },
  { label: '6+',        color: '#08306b' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoJsonData = any;

export function CountryHeatmap({ version = 0 }: { version?: number }) {
  const [geoJson, setGeoJson]     = useState<GeoJsonData | null>(null);
  const [stats, setStats]         = useState<Record<string, number>>({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [tooltip, setTooltip]     = useState<{ name: string; count: number; x: number; y: number } | null>(null);
  const statsKey = JSON.stringify(stats);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(GEOJSON_URL).then((r) => r.json()),
      api.getCountryStats(),
    ])
      .then(([geo, s]) => { if (!cancelled) { setGeoJson(geo); setStats(s); setError(null); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError('Failed to load map data'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [version]);

  const onEachFeature = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any, layer: L.Layer) => {
      const name: string = feature.properties?.ADMIN ?? feature.properties?.name ?? '';
      const count = stats[name] ?? 0;

      (layer as L.Path).setStyle({
        fillColor: getColor(count),
        fillOpacity: 0.85,
        color: '#94a3b8',
        weight: 0.6,
      });

      layer.on({
        mousemove(e: L.LeafletMouseEvent) {
          (layer as L.Path).setStyle({ weight: 2, color: '#1e40af' });
          setTooltip({ name, count, x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        },
        mouseout() {
          (layer as L.Path).setStyle({ weight: 0.6, color: '#94a3b8' });
          setTooltip(null);
        },
      });
    },
    [stats],
  );

  if (loading) {
    return <div className="flex justify-center py-20 text-gray-400 text-sm">Loading map…</div>;
  }
  if (error) {
    return <div className="flex justify-center py-20 text-red-400 text-sm">{error}</div>;
  }

  const visitedCount = Object.keys(stats).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Country Travel Heatmap</h2>
      <p className="text-xs text-gray-400 mb-4">
        {visitedCount === 0
          ? 'No countries logged yet'
          : `${visitedCount} countr${visitedCount === 1 ? 'y' : 'ies'} visited`}
      </p>

      <div className="relative rounded-lg overflow-hidden" style={{ height: 440 }}>
        <MapContainer
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          maxZoom={6}
          className="w-full h-full"
          zoomControl={true}
          attributionControl={false}
          worldCopyJump={false}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
        >
          {/* Minimal base layer — just borders, no labels that clash with colours */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {geoJson && (
            <GeoJSON key={statsKey} data={geoJson} onEachFeature={onEachFeature} />
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-[800] bg-white/90 backdrop-blur-sm rounded-lg shadow px-3 py-2.5 text-xs">
          <p className="font-semibold text-gray-600 mb-1.5">Visits</p>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-4 h-3 rounded-sm border border-gray-200 shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating tooltip follows cursor */}
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <span className="font-medium">{tooltip.name}</span>
          {' — '}
          <span>{tooltip.count} visit{tooltip.count !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}


