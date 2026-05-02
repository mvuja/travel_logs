<?php

use App\Models\TravelLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a flight travel log', function () {
    $response = $this->postJson('/api/travel-logs', [
        'type'           => 'flight',
        'departureDate'  => '2025-06-01 10:00:00',
        'arrivalDate'    => '2025-06-01 14:00:00',
        'departurePlace' => 'London',
        'arrivalPlace'   => 'New York',
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('data.type', 'flight');

    $this->assertDatabaseHas('travel_logs', ['type' => 'flight']);
});

it('can create a hotel travel log', function () {
    $response = $this->postJson('/api/travel-logs', [
        'type'               => 'hotel',
        'departureDate'      => '2025-06-01 12:00:00',
        'arrivalDate'        => '2025-06-05 12:00:00',
        'accommodationPlace' => 'Hilton NYC',
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('data.type', 'hotel');
});

it('fails validation when type is invalid', function () {
    $response = $this->postJson('/api/travel-logs', [
        'type'          => 'boat',
        'departureDate' => '2025-06-01 10:00:00',
        'arrivalDate'   => '2025-06-01 14:00:00',
    ]);

    $response->assertStatus(422)
             ->assertJsonPath('message', 'Validation failed');
});

it('fails validation when flight is missing departure/arrival place', function () {
    $response = $this->postJson('/api/travel-logs', [
        'type'          => 'flight',
        'departureDate' => '2025-06-01 10:00:00',
        'arrivalDate'   => '2025-06-01 14:00:00',
    ]);

    $response->assertStatus(422)
             ->assertJsonStructure(['errors' => ['departurePlace', 'arrivalPlace']]);
});

it('fails validation when hotel is missing accommodation place', function () {
    $response = $this->postJson('/api/travel-logs', [
        'type'          => 'hotel',
        'departureDate' => '2025-06-01 12:00:00',
        'arrivalDate'   => '2025-06-05 12:00:00',
    ]);

    $response->assertStatus(422)
             ->assertJsonStructure(['errors' => ['accommodationPlace']]);
});

it('can retrieve a travel log', function () {
    $travelLog = TravelLog::create([
        'type'            => 'car',
        'departure_date'  => '2025-06-01 08:00:00',
        'arrival_date'    => '2025-06-01 12:00:00',
        'departure_place' => 'Paris',
        'arrival_place'   => 'Lyon',
    ]);

    $this->getJson('/api/travel-logs/' . $travelLog->id)
         ->assertStatus(200)
         ->assertJsonPath('data.type', 'car');
});

it('returns 404 for non-existent travel log', function () {
    $this->getJson('/api/travel-logs/non-existent-id')
         ->assertStatus(404);
});

it('can list all travel logs', function () {
    TravelLog::create([
        'type'            => 'rail',
        'departure_date'  => '2025-06-01 09:00:00',
        'arrival_date'    => '2025-06-01 13:00:00',
        'departure_place' => 'Amsterdam',
        'arrival_place'   => 'Brussels',
    ]);

    $this->getJson('/api/travel-logs')
         ->assertStatus(200)
         ->assertJsonStructure(['data' => [['type', 'departureDate', 'arrivalDate']]]);
});

it('can delete a travel log', function () {
    $travelLog = TravelLog::create([
        'type'            => 'car',
        'departure_date'  => '2025-06-01 08:00:00',
        'arrival_date'    => '2025-06-01 12:00:00',
        'departure_place' => 'Madrid',
        'arrival_place'   => 'Barcelona',
    ]);

    $this->deleteJson('/api/travel-logs/' . $travelLog->id)
         ->assertStatus(204);

    $this->assertDatabaseMissing('travel_logs', ['id' => $travelLog->id]);
});

