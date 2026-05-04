<?php

use App\Models\TravelLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── helpers ─────────────────────────────────────────────────────────────────

function flightPayload(array $overrides = []): array
{
    return array_merge([
        'type'          => 'flight',
        'departureDate' => '2025-06-01 10:00:00',
        'arrivalDate'   => '2025-06-01 14:00:00',
        'city'          => 'New York',
        'country'       => 'United States',
        'placeName'     => 'New York, United States',
        'latitude'      => 40.7128,
        'longitude'     => -74.0060,
        'fromCity'      => 'London',
        'fromCountry'   => 'United Kingdom',
        'fromPlaceName' => 'London, United Kingdom',
        'fromLat'       => 51.5074,
        'fromLng'       => -0.1278,
    ], $overrides);
}

function hotelPayload(array $overrides = []): array
{
    return array_merge([
        'type'               => 'hotel',
        'departureDate'      => '2025-06-01 12:00:00',
        'arrivalDate'        => '2025-06-05 12:00:00',
        'accommodationPlace' => 'Hilton NYC',
        'city'               => 'New York',
        'country'            => 'United States',
        'placeName'          => 'New York, United States',
        'latitude'           => 40.7128,
        'longitude'          => -74.0060,
    ], $overrides);
}

function baseModel(array $overrides = []): array
{
    return array_merge([
        'type'           => 'car',
        'departure_date' => '2025-06-01 08:00:00',
        'arrival_date'   => '2025-06-01 12:00:00',
        'city'           => 'Paris',
        'country'        => 'France',
        'latitude'       => 48.8566,
        'longitude'      => 2.3522,
    ], $overrides);
}

// ── create ───────────────────────────────────────────────────────────────────

it('can create a flight travel log', function () {
    $response = $this->postJson('/api/travel-logs', flightPayload());

    $response->assertStatus(201)
             ->assertJsonPath('data.type', 'flight');

    $this->assertDatabaseHas('travel_logs', ['type' => 'flight', 'city' => 'New York']);
});

it('can create a hotel travel log', function () {
    $response = $this->postJson('/api/travel-logs', hotelPayload());

    $response->assertStatus(201)
             ->assertJsonPath('data.type', 'hotel');

    $this->assertDatabaseHas('travel_logs', ['type' => 'hotel', 'city' => 'New York']);
});

// ── validation ───────────────────────────────────────────────────────────────

it('fails validation when type is invalid', function () {
    $response = $this->postJson('/api/travel-logs', flightPayload(['type' => 'boat']));

    $response->assertStatus(422)
             ->assertJsonPath('message', 'Validation failed');
});

it('fails validation when city is missing', function () {
    $response = $this->postJson('/api/travel-logs', flightPayload(['city' => null]));

    $response->assertStatus(422)
             ->assertJsonStructure(['errors' => ['city']]);
});

it('fails validation when country is missing', function () {
    $response = $this->postJson('/api/travel-logs', flightPayload(['country' => null]));

    $response->assertStatus(422)
             ->assertJsonStructure(['errors' => ['country']]);
});

it('fails validation when coordinates are missing', function () {
    $response = $this->postJson('/api/travel-logs', flightPayload([
        'latitude'  => null,
        'longitude' => null,
    ]));

    $response->assertStatus(422)
             ->assertJsonStructure(['errors' => ['latitude', 'longitude']]);
});

// ── read ─────────────────────────────────────────────────────────────────────

it('can retrieve a travel log', function () {
    $travelLog = TravelLog::create(baseModel());

    $this->getJson('/api/travel-logs/' . $travelLog->id)
         ->assertStatus(200)
         ->assertJsonPath('data.type', 'car');
});

it('returns 404 for non-existent travel log', function () {
    $this->getJson('/api/travel-logs/non-existent-id')
         ->assertStatus(404);
});

it('can list all travel logs', function () {
    TravelLog::create(baseModel(['type' => 'rail']));

    $this->getJson('/api/travel-logs')
         ->assertStatus(200)
         ->assertJsonStructure(['data' => [['type', 'departureDate', 'arrivalDate']]]);
});

// ── delete ───────────────────────────────────────────────────────────────────

it('can delete a travel log', function () {
    $travelLog = TravelLog::create(baseModel());

    $this->deleteJson('/api/travel-logs/' . $travelLog->id)
         ->assertStatus(204);

    $this->assertDatabaseMissing('travel_logs', ['id' => $travelLog->id]);
});

