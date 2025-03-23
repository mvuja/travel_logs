<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessBulkUpload;
use Illuminate\Http\Request;
use App\Models\QueueTask;
use App\Data\QueueTaskData;
use Illuminate\Support\Facades\Log;
use Exception;

class BulkUploadController extends Controller
{
    public function bulkUpload(Request $request)
    {
        try {
            // Validate file input
            $request->validate([
                'file' => 'required|mimes:csv|max:2048',
            ]);
    
            $file = $request->file('file');
    
            $filePath = $file->store('uploads');
    
            // Create queue task
            $queueTask = QueueTask::create([
                'status' => 'queued',
                'progress' => 0,
            ]);
    
            // Dispatch job
            ProcessBulkUpload::dispatch($queueTask->id, $filePath);
            Log::info('Job dispatched for queue task ID: ' . $queueTask->id);
    
            return response()->json(['queueTaskId' => $queueTask->id], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    public function checkQueueTask($id)
    {
        try {
            $queueTask = QueueTask::findOrFail($id);

            return response()->json(new QueueTaskData(
                $queueTask->id,
                $queueTask->status,
                $queueTask->progress
            ));
        } catch (Exception $e) {
            Log::error("Error fetching queue task: " . $e->getMessage());
            return response()->json(['error' => 'Queue task not found'], 404);
        }
    }
}