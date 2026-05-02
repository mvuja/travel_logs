import { useState, useRef } from 'react';
import { api } from '@/api';
import type { QueueTask } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadCloud, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

function statusBadge(status: QueueTask['status']) {
  const map: Record<QueueTask['status'], { label: string; variant: 'warning' | 'default' | 'success' | 'destructive' }> = {
    queued:  { label: 'Queued',  variant: 'warning' },
    running: { label: 'Running', variant: 'default' },
    success: { label: 'Done',    variant: 'success' },
    failure: { label: 'Failed',  variant: 'destructive' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function BulkUpload({ onSuccess, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [task, setTask] = useState<QueueTask | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function pickFile(f: File) {
    if (!f.name.endsWith('.csv')) { setError('Only CSV files are allowed.'); return; }
    setFile(f);
    setError('');
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { queueTaskId } = await api.bulkUpload(file);
      const initial = await api.getQueueTask(queueTaskId);
      setTask(initial);

      pollRef.current = setInterval(async () => {
        const updated = await api.getQueueTask(queueTaskId);
        setTask(updated);
        if (updated.status === 'success' || updated.status === 'failure') {
          clearInterval(pollRef.current!);
          if (updated.status === 'success') setTimeout(onSuccess, 1500);
        }
      }, 1000);
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const isDone = task?.status === 'success';
  const isFailed = task?.status === 'failure';

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Bulk Upload</DialogTitle>
        <DialogDescription>Upload a CSV file to import multiple travel logs at once.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        {/* Drop zone */}
        {!task && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f); }}
          >
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }} />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-blue-500" />
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <UploadCloud className="h-10 w-10" />
                <p className="text-sm">Drop a CSV file here, or click to browse</p>
              </div>
            )}
          </div>
        )}

        {/* CSV format hint */}
        {!task && (
          <p className="text-xs text-gray-400">
            Expected columns: <code className="bg-gray-100 px-1 rounded">type, departure_date, arrival_date, departure_place, arrival_place, accommodation_place, comment</code>
          </p>
        )}

        {/* Error */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Progress */}
        {task && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processing…</span>
              {statusBadge(task.status)}
            </div>
            <Progress value={task.progress ?? 0} />
            <p className="text-xs text-gray-400 text-right">{task.progress ?? 0}%</p>
            {isDone && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" /> Import completed successfully!
              </div>
            )}
            {isFailed && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <XCircle className="h-4 w-4" /> Import failed. Check your CSV format.
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={uploading}>
            {isDone ? 'Close' : 'Cancel'}
          </Button>
          {!task && (
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Uploading…</> : 'Upload'}
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

