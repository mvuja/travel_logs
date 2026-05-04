import type { TravelLog, TravelLogType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Train, Car, Hotel, Trash2, Pencil, Plus, MapPin, Calendar } from 'lucide-react';

export type SortField = 'date' | 'type' | 'country';
export type SortDir   = 'asc'  | 'desc';

const TYPE_ICONS: Record<TravelLogType, React.ReactNode> = {
  flight: <Plane  className="h-4 w-4" />,
  rail:   <Train  className="h-4 w-4" />,
  car:    <Car    className="h-4 w-4" />,
  hotel:  <Hotel  className="h-4 w-4" />,
};

const TYPE_COLORS: Record<TravelLogType, string> = {
  flight: 'bg-sky-100 text-sky-700',
  rail:   'bg-purple-100 text-purple-700',
  car:    'bg-amber-100 text-amber-700',
  hotel:  'bg-emerald-100 text-emerald-700',
};

function formatDate(d: string) {
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

interface TravelLogListProps {
  logs: TravelLog[];
  loading: boolean;
  deletingId: string | null;
  onEdit: (log: TravelLog) => void;
  onDelete: (id: string) => void;
  onNewLog: () => void;
}

export function TravelLogList({ logs, loading, deletingId, onEdit, onDelete, onNewLog }: TravelLogListProps) {
  return (
    <section>

      {loading && logs.length === 0 ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
          <Plane className="h-12 w-12 opacity-30" />
          <p className="text-sm">No travel logs yet. Create one or bulk upload a CSV.</p>
          <Button onClick={onNewLog}>
            <Plus className="h-4 w-4 mr-1" /> New Log
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
          {logs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`rounded-lg p-2 mt-0.5 shrink-0 ${TYPE_COLORS[log.type]}`}>
                      {TYPE_ICONS[log.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${TYPE_COLORS[log.type]}`}>
                          {log.type}
                        </span>
                        {log.fromCity && log.city && (
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-800">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {log.fromCity}
                            <span className="text-gray-300 mx-0.5">→</span>
                            {log.city}
                          </span>
                        )}
                        {!log.fromCity && log.city && (
                          <span className="flex items-center gap-1 text-sm font-medium text-gray-800">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {log.city}
                          </span>
                        )}
                        {log.country && (
                          <span className="text-xs text-gray-400">{log.country}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(log.departureDate)}</span>
                        <span className="text-gray-300">–</span>
                        <span>{formatDate(log.arrivalDate)}</span>
                      </div>

                      {log.comment && (
                        <p className="mt-1.5 text-xs text-gray-400 truncate">{log.comment}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost" size="icon"
                      className="text-gray-300 hover:text-blue-500"
                      onClick={() => onEdit(log)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="text-gray-300 hover:text-red-500"
                      onClick={() => onDelete(log.id)}
                      disabled={deletingId === log.id}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
