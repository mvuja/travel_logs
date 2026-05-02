<?php

namespace App\Http\Controllers;

use App\Models\TravelLog;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function types(): JsonResponse
    {
        $counts = TravelLog::selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type');

        return response()->json([
            'flights' => (int) ($counts['flight'] ?? 0),
            'hotels'  => (int) ($counts['hotel'] ?? 0),
            'cars'    => (int) ($counts['car'] ?? 0),
            'rail'    => (int) ($counts['rail'] ?? 0),
        ]);
    }

    public function countries(): JsonResponse
    {
        $counts = [];

        TravelLog::select('country', 'from_country')->get()->each(function ($log) use (&$counts) {
            // Count the destination country
            if ($log->country) {
                $counts[$log->country] = ($counts[$log->country] ?? 0) + 1;
            }
            // Count the departure country if different from destination
            if ($log->from_country && $log->from_country !== $log->country) {
                $counts[$log->from_country] = ($counts[$log->from_country] ?? 0) + 1;
            }
        });

        arsort($counts);

        return response()->json($counts);
    }
}

