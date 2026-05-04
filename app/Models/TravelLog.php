<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TravelLog extends Model
{
    use HasUuids;

    protected $table = 'travel_logs';

    protected $fillable = [
        'type',
        'departure_date',
        'arrival_date',
        'comment',
        // Geocoded destination
        'place_name',
        'city',
        'country',
        'latitude',
        'longitude',
        // Geocoded departure (flights/rail/car)
        'from_place_name',
        'from_city',
        'from_country',
        'from_lat',
        'from_lng',
    ];

    protected $casts = [
        'departure_date' => 'datetime',
        'arrival_date'   => 'datetime',
        'latitude'       => 'float',
        'longitude'      => 'float',
        'from_lat'       => 'float',
        'from_lng'       => 'float',
    ];
}
