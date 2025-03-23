<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class QueueTaskData extends Data
{
    public function __construct(
        public int $id,
        public string $status,
        public ?int $progress
    ) {}
}