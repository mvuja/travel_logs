<?php

namespace App\Data;

use Spatie\LaravelData\Data;

use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Attributes\Validation\Date;

class TravelLogData extends Data
{
    public function __construct(
        #[In(['flight', 'rail', 'car', 'hotel'])]
        public string $type,

        #[Date]
        public string $departureDate,

        #[Date]
        public string $arrivalDate,

        #[RequiredIf('type', 'car', 'rail')]
        public ?string $departurePlace,

        #[RequiredIf('type', 'car', 'rail')]
        public ?string $arrivalPlace,

        #[RequiredIf('type', 'hotel')]
        public ?string $accommodationPlace,

        public ?string $comment
    ) {}
}