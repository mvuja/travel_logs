import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { TravelLog } from '@/types';

import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLORS: Record<string, string> = {
  flight: '#0284c7',
  rail:   '#7c3aed',
  car:    '#d97706',
  hotel:  '#059669',
};

const TYPE_EMOJI: Record<string, string> = {
  flight: '✈️',
  rail:   '🚆',
  car:    '🚗',
  hotel:  '🏨',
};

function makeIcon(type: string) {
  const color = TYPE_COLORS[type] ?? '#64748b';
  const emoji = TYPE_EMOJI[type] ?? '📍';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="12" fill="white" opacity="0.9"/>
      <text x="18" y="23" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
    className: '',
  });
}

interface Props {
  logs: TravelLog[];
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export function MapView({ logs }: Props) {
  const logsWithCoords = logs.filter((l) => l.latitude != null && l.longitude != null);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[48.5, 15]}
        zoom={4}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {logsWithCoords.map((log) => (
          <Marker
            key={log.id}
            position={[log.latitude!, log.longitude!]}
            icon={makeIcon(log.type)}
          >
            <Popup>
              <div className="min-w-[160px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-semibold capitalize">{TYPE_EMOJI[log.type]} {log.type}</span>
                </div>
                {log.departurePlace && log.arrivalPlace && (
                  <p className="text-xs text-gray-700">{log.departurePlace} → {log.arrivalPlace}</p>
                )}
                {log.accommodationPlace && (
                  <p className="text-xs text-gray-700">🏨 {log.accommodationPlace}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(log.departureDate)} – {formatDate(log.arrivalDate)}
                </p>
                {log.comment && (
                  <p className="text-xs text-gray-400 mt-1 italic">{log.comment}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {logsWithCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 text-center shadow">
            <p className="text-sm font-medium text-gray-600">No logs with coordinates yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Add lat/lng when creating a log to pin it here</p>
          </div>
        </div>
      )}
    </div>
  );
}
