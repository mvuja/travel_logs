<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TravelLogController;
use App\Http\Controllers\BulkUploadController;

Route::post('/travel-logs', [TravelLogController::class, 'store']);
Route::get('/travel-logs', [TravelLogController::class, 'showAll']);
Route::get('/travel-logs/{travelLog}', [TravelLogController::class, 'show']);
Route::delete('/travel-logs/{travelLog}', [TravelLogController::class, 'destroy']);

Route::post('/travel-logs/bulk-upload', [BulkUploadController::class, 'bulkUpload']);
Route::get('/queue-tasks/{id}', [BulkUploadController::class, 'checkQueueTask']);