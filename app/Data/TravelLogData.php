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

        // Legacy text fields (kept for backward compat)
        public ?string $departurePlace,
        public ?string $arrivalPlace,
        public ?string $accommodationPlace,

        public ?string $comment,

        // Geocoded destination / primary location
        public ?string $placeName,
        public ?string $city,
        public ?string $country,
        public ?float  $latitude,
        public ?float  $longitude,

        // Geocoded departure (flights / rail / car)
        public ?string $fromPlaceName,
        public ?string $fromCity,
        public ?string $fromCountry,
        public ?float  $fromLat,
        public ?float  $fromLng,
    ) {}

    public static function rules(): array
    {
        return [];
    }
}
