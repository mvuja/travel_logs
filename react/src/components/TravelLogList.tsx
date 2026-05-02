import { useState, useEffect, useCallback } from 'react';
import { api } from '@/api';
import type { TravelLog, TravelLogType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { TravelLogForm } from './TravelLogForm';
import { BulkUpload } from './BulkUpload';
import { ActivityPieChart } from './ActivityPieChart';
import { CountryHeatmap } from './CountryHeatmap';
import { Plane, Train, Car, Hotel, Trash2, Pencil, Plus, UploadCloud, RefreshCw, MapPin, Calendar } from 'lucide-react';

const TYPE_ICONS: Record<TravelLogType, React.ReactNode> = {
  flight: <Plane className="h-4 w-4" />,
  rail:   <Train className="h-4 w-4" />,
  car:    <Car className="h-4 w-4" />,
  hotel:  <Hotel className="h-4 w-4" />,
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

type ModalState = 'none' | 'create' | 'edit' | 'bulk';

export function TravelLogList() {
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>('none');
  const [editingLog, setEditingLog] = useState<TravelLog | null>(null);
  const [statsKey, setStatsKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLogs(await api.listTravelLogs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this travel log?')) return;
    setDeletingId(id);
    try {
      await api.deleteTravelLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      setStatsKey(k => k + 1);
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(log: TravelLog) { setEditingLog(log); setModal('edit'); }
  function handleSuccess() { setModal('none'); setEditingLog(null); setStatsKey(k => k + 1); load(); }
  function handleCancel()  { setModal('none'); setEditingLog(null); }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-lg p-2">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Travel Logs</h1>
              <p className="text-xs text-gray-400">{logs.length} {logs.length === 1 ? 'entry' : 'entries'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setModal('bulk')}>
              <UploadCloud className="h-4 w-4 mr-1" /> Bulk Upload
            </Button>
            <Button size="sm" onClick={() => setModal('create')}>
              <Plus className="h-4 w-4 mr-1" /> New Log
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">

        {/* ── SECTION 1: Travel Logs ── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Logs</h2>
          {loading && logs.length === 0 ? (
            <div className="flex justify-center py-16 text-gray-400 text-sm">Loading…</div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
              <Plane className="h-12 w-12 opacity-30" />
              <p className="text-sm">No travel logs yet. Create one or bulk upload a CSV.</p>
              <Button onClick={() => setModal('create')}><Plus className="h-4 w-4 mr-1" /> New Log</Button>
            </div>
          ) : (
            <div className="grid gap-3">
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
                            {/* Geocoded locations */}
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
                        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-blue-500" onClick={() => handleEdit(log)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-500" onClick={() => handleDelete(log.id)} disabled={deletingId === log.id} title="Delete">
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

        {/* ── SECTION 2 & 3: Activity + Map side by side ── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityPieChart version={statsKey} />
            <CountryHeatmap version={statsKey} />
          </div>
        </section>

      </main>

      {/* Modals */}
      <Dialog open={modal === 'create'} onOpenChange={(o) => !o && handleCancel()}>
        {modal === 'create' && <TravelLogForm onSuccess={handleSuccess} onCancel={handleCancel} />}
      </Dialog>
      <Dialog open={modal === 'edit'} onOpenChange={(o) => !o && handleCancel()}>
        {editingLog && <TravelLogForm editLog={editingLog} onSuccess={handleSuccess} onCancel={handleCancel} />}
      </Dialog>
      <Dialog open={modal === 'bulk'} onOpenChange={(o) => !o && handleCancel()}>
        <BulkUpload onSuccess={handleSuccess} onCancel={handleCancel} />
      </Dialog>
    </div>
  );
}
