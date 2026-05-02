<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TravelLogController;
use App\Http\Controllers\BulkUploadController;
use App\Http\Controllers\StatsController;

// Static routes before dynamic ones
Route::post('/travel-logs/bulk-upload', [BulkUploadController::class, 'bulkUpload']);
Route::get('/queue-tasks/{id}', [BulkUploadController::class, 'checkQueueTask']);

Route::get('/travel-logs', [TravelLogController::class, 'index']);
Route::post('/travel-logs', [TravelLogController::class, 'store']);
Route::get('/travel-logs/{travelLog}', [TravelLogController::class, 'show']);
Route::put('/travel-logs/{travelLog}', [TravelLogController::class, 'update']);
Route::delete('/travel-logs/{travelLog}', [TravelLogController::class, 'destroy']);

Route::get('/stats/types', [StatsController::class, 'types']);
Route::get('/stats/countries', [StatsController::class, 'countries']);

