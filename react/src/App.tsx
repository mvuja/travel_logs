import { useState, useEffect, useCallback } from 'react';
import { api } from '@/api';
import type { TravelLogFilters } from '@/api';
import type { TravelLog } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { TravelLogList, type SortField, type SortDir } from '@/components/TravelLogList';
import { FilterBar, type Filters } from '@/components/FilterBar';
import { InsightsPanel } from '@/components/InsightsPanel';
import { TravelLogForm } from '@/components/TravelLogForm';
import { BulkUpload } from '@/components/BulkUpload';

type ModalState = 'none' | 'create' | 'edit' | 'bulk' | 'clearAll';

const EMPTY_FILTERS: Filters = { type: '', country: '', dateFrom: '', dateTo: '' };

function App() {
  const [logs, setLogs]               = useState<TravelLog[]>([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [modal, setModal]             = useState<ModalState>('none');
  const [editingLog, setEditingLog]   = useState<TravelLog | null>(null);
  const [statsKey, setStatsKey]       = useState(0);
  const [sortField, setSortField]     = useState<SortField>('date');
  const [sortDir, setSortDir]         = useState<SortDir>('desc');
  const [filters, setFilters]         = useState<Filters>(EMPTY_FILTERS);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: TravelLogFilters = {
        sortBy:   sortField,
        sortDir,
        type:     filters.type     || undefined,
        country:  filters.country  || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo:   filters.dateTo   || undefined,
      };
      setLogs(await api.listTravelLogs(params));
    } finally {
      setLoading(false);
    }
  }, [sortField, sortDir, filters]);

  useEffect(() => { load(); }, [load]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d: SortDir) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'date' ? 'desc' : 'asc');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this travel log?')) return;
    setDeletingId(id);
    try {
      await api.deleteTravelLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
      setStatsKey(k => k + 1);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleClearAll() {
    setClearingAll(true);
    try {
      await api.deleteAllTravelLogs();
      setLogs([]);
      setStatsKey(k => k + 1);
      setModal('none');
    } finally {
      setClearingAll(false);
    }
  }

  function handleEdit(log: TravelLog) { setEditingLog(log); setModal('edit'); }
  function handleSuccess() { setModal('none'); setEditingLog(null); setStatsKey(k => k + 1); load(); }
  function handleCancel()  { setModal('none'); setEditingLog(null); }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        entryCount={logs.length}
        onClearAll={() => setModal('clearAll')}
        onBulkUpload={() => setModal('bulk')}
        onNewLog={() => setModal('create')}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Logs</h2>
            <FilterBar
              sortField={sortField}
              sortDir={sortDir}
              filters={filters}
              onToggleSort={toggleSort}
              onFiltersChange={setFilters}
            />
            <TravelLogList
              logs={logs}
              loading={loading}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onNewLog={() => setModal('create')}
            />
          </section>
          <InsightsPanel version={statsKey} />
        </div>
      </main>

      {/* Modals */}
      <Dialog open={modal === 'create'} onOpenChange={o => !o && handleCancel()}>
        {modal === 'create' && <TravelLogForm onSuccess={handleSuccess} onCancel={handleCancel} />}
      </Dialog>
      <Dialog open={modal === 'edit'} onOpenChange={o => !o && handleCancel()}>
        {editingLog && <TravelLogForm editLog={editingLog} onSuccess={handleSuccess} onCancel={handleCancel} />}
      </Dialog>
      <Dialog open={modal === 'bulk'} onOpenChange={o => !o && handleCancel()}>
        <BulkUpload onSuccess={handleSuccess} onCancel={handleCancel} />
      </Dialog>

      {/* Clear All confirmation */}
      {modal === 'clearAll' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={() => setModal('none')}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 text-red-600 rounded-full p-2">
                <Trash2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Clear all travel logs?</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete{' '}
              <span className="font-semibold text-gray-700">
                all {logs.length} travel {logs.length === 1 ? 'log' : 'logs'}
              </span>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setModal('none')} disabled={clearingAll}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleClearAll}
                disabled={clearingAll}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {clearingAll ? 'Deleting…' : 'Delete all'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
