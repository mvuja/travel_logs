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
    public function index(): JsonResponse
    {
        $travelLogs = TravelLog::latest()->get();

        return response()->json([
            'message' => 'Travel logs retrieved successfully!',
            'data'    => TravelLogData::collect($travelLogs),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $data = TravelLogData::validateAndCreate($request->all());

            $travelLog = TravelLog::create($this->buildAttributes($data));

            return response()->json([
                'message' => 'Travel log created successfully!',
                'data'    => TravelLogData::from($travelLog),
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(TravelLog $travelLog): JsonResponse
    {
        return response()->json([
            'message' => 'Travel log retrieved successfully!',
            'data'    => TravelLogData::from($travelLog),
        ]);
    }

    public function update(Request $request, TravelLog $travelLog): JsonResponse
    {
        try {
            $data = TravelLogData::validateAndCreate($request->all());

            $travelLog->update($this->buildAttributes($data));

            return response()->json([
                'message' => 'Travel log updated successfully!',
                'data'    => TravelLogData::from($travelLog->fresh()),
            ]);

        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['message' => 'Something went wrong', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(TravelLog $travelLog): JsonResponse
    {
        $travelLog->delete();
        return response()->json(null, 204);
    }

    private function buildAttributes(TravelLogData $data): array
    {
        return [
            'type'                => $data->type,
            'departure_date'      => date('Y-m-d H:i:s', strtotime($data->departureDate)),
            'arrival_date'        => date('Y-m-d H:i:s', strtotime($data->arrivalDate)),
            'departure_place'     => $data->departurePlace,
            'arrival_place'       => $data->arrivalPlace,
            'accommodation_place' => $data->accommodationPlace,
            'comment'             => $data->comment,
            // Geocoded destination
            'place_name'          => $data->placeName,
            'city'                => $data->city,
            'country'             => $data->country,
            'latitude'            => $data->latitude,
            'longitude'           => $data->longitude,
            // Geocoded departure
            'from_place_name'     => $data->fromPlaceName,
            'from_city'           => $data->fromCity,
            'from_country'        => $data->fromCountry,
            'from_lat'            => $data->fromLat,
            'from_lng'            => $data->fromLng,
        ];
    }
}
