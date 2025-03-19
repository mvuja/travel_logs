<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Validation\ValidationException;
use Exception;

use App\Data\TravelLogData;
use App\Models\TravelLog;
use Illuminate\Http\JsonResponse;

class TravelLogController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate data using DTO
            $data = TravelLogData::validateAndCreate($request->all());
    
            $travelLog = TravelLog::create([
                'type' => $data->type,
                'departure_date' => date('Y-m-d H:i:s', strtotime($data->departureDate)),
                'arrival_date' => date('Y-m-d H:i:s', strtotime($data->arrivalDate)),
                'departure_place' => $data->departurePlace ?? null,
                'arrival_place' => $data->arrivalPlace ?? null,
                'accommodation_place' => $data->accommodationPlace ?? null,
                'comment' => $data->comment ?? null,
            ]);

            // Convert to DTO
            $travelLogDto = TravelLogData::from($travelLog);
    
            return response()->json([
                'message' => 'Travel log created successfully!',
                'data' => $travelLogDto,
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
    
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function show($id): JsonResponse
    {
        $travelLog = TravelLog::find($id);

        if (!$travelLog) {
            return response()->json([
                'message' => 'Travel log not found.',
            ], 404);
        }

        // Convert to DTO
        $travelLogDto = TravelLogData::from($travelLog);

        return response()->json([
            'message' => 'Travel log retrieved successfully!',
            'data' => $travelLogDto,
        ]);
    }


    public function destroy($id): JsonResponse
    {
        $travelLog = TravelLog::find($id);

        if (!$travelLog) {
            return response()->json([
                'message' => 'Travel log not found.',
            ], 404);
        }
    
        $travelLog->delete();
    
        // Return a 204 No Content response
        return response()->json(null, 204);
    }
}