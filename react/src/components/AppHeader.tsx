import { Plane, Trash2, UploadCloud, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  entryCount: number;
  onClearAll: () => void;
  onBulkUpload: () => void;
  onNewLog: () => void;
}

export function AppHeader({ entryCount, onClearAll, onBulkUpload, onNewLog }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white rounded-lg p-2">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Travel Logs</h1>
            <p className="text-xs text-gray-400">
              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </Button>
          <Button variant="outline" size="sm" onClick={onBulkUpload}>
            <UploadCloud className="h-4 w-4 mr-1" /> Bulk Upload
          </Button>
          <Button size="sm" onClick={onNewLog}>
            <Plus className="h-4 w-4 mr-1" /> New Log
          </Button>
        </div>
      </div>
    </header>
  );
}

