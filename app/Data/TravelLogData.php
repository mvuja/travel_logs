<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\WithoutValidation;

class TravelLogData extends Data
{
    public function __construct(
        #[WithoutValidation]
        public ?string $id,

        #[In(['flight', 'rail', 'car', 'hotel'])]
        public string $type,

        #[Date]
        public string $departureDate,

        #[Date]
        public string $arrivalDate,

        public ?string $comment,

        // Geocoded destination / primary location
        public ?string $placeName,
        public string  $city,
        public string  $country,
        public float   $latitude,
        public float   $longitude,

        // Geocoded departure (flights / rail / car)
        public ?string $fromPlaceName,
        public ?string $fromCity,
        public ?string $fromCountry,
        public ?float  $fromLat,
        public ?float  $fromLng,
    ) {}

    public static function rules(): array
    {
        return [
            'city'      => ['required', 'string'],
            'country'   => ['required', 'string'],
            'latitude'  => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
        ];
    }
}
