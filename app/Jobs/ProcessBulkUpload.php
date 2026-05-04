<?php

namespace App\Jobs;

use App\Models\QueueTask;
use App\Models\TravelLog;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;


class ProcessBulkUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $queueTaskId,
        public string $filePath
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Processing queue task ID: " . $this->queueTaskId);

        $queueTask = QueueTask::find($this->queueTaskId);
        if (!$queueTask) {
            Log::error("Queue task not found: " . $this->queueTaskId);
            return;
        }

        $queueTask->update(['status' => 'running', 'progress' => 0]);
        Log::info("Queue task updated to 'running'");

        $file = Storage::path($this->filePath);
        if (!file_exists($file)) {
            Log::error("File not found: " . $file);
            $queueTask->update(['status' => 'failure']);
            return;
        }

        Log::info("Reading file: " . $file);
        $rows = array_map('str_getcsv', file($file));

        if (empty($rows)) {
            Log::error("CSV file is empty");
            $queueTask->update(['status' => 'failure']);
            return;
        }

        // Remove headers if present
        if ($rows && isset($rows[0]) && $rows[0][0] === 'type') {
            array_shift($rows);
        }

        $totalRows = count($rows);
        $chunkSize = max(1, ceil($totalRows / 10));
        Log::info("Total rows: " . $totalRows);

        foreach ($rows as $index => $row) {
            try {

                $row = array_map(fn($value) => $value !== '' ? $value : null, $row);

                TravelLog::create([
                    'type'            => $row[0],
                    'departure_date'  => $row[1],
                    'arrival_date'    => $row[2],
                    'comment'         => $row[3]  ?? null,
                    'city'            => $row[4]  ?? null,
                    'country'         => $row[5]  ?? null,
                    'place_name'      => $row[6]  ?? null,
                    'latitude'        => isset($row[7])  ? (float) $row[7]  : null,
                    'longitude'       => isset($row[8])  ? (float) $row[8]  : null,
                    'from_city'       => $row[9]  ?? null,
                    'from_country'    => $row[10] ?? null,
                    'from_place_name' => $row[11] ?? null,
                    'from_lat'        => isset($row[12]) ? (float) $row[12] : null,
                    'from_lng'        => isset($row[13]) ? (float) $row[13] : null,
                ]);

                Log::info("Inserted row: " . json_encode($row));

                if (($index + 1) % $chunkSize === 0) {
                    $queueTask->update(['progress' => intval((($index + 1) / $totalRows) * 100)]);
                }
            } catch (\Exception $e) {
                Log::error("Error inserting row: " . json_encode($row) . " - " . $e->getMessage());
            }
        }

        $queueTask->update(['status' => 'success', 'progress' => 100]);
        Log::info("Queue task completed: " . $this->queueTaskId);

        // Clean up uploaded file after processing
        Storage::delete($this->filePath);
    }
}
