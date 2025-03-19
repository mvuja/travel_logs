<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TravelLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'travel_logs';

    protected $fillable = [
        'type',
        'departure_date',
        'arrival_date',
        'departure_place',
        'arrival_place',
        'accommodation_place',
        'comment',
    ];

    protected $casts = [
        'departure_date' => 'datetime',
        'arrival_date' => 'datetime',
    ];
}