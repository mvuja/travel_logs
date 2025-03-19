<?php

use App\Http\Controllers\TravelLogController;
use Illuminate\Support\Facades\Route;

Route::post('/travel-logs', [TravelLogController::class, 'store']);

Route::get('/travel-logs/{travelLog}', [TravelLogController::class, 'show']);

Route::delete('/travel-logs/{travelLog}', [TravelLogController::class, 'destroy']);