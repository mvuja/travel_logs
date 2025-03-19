<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('travel_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->dateTime('departure_date');
            $table->dateTime('arrival_date');
            $table->string('departure_place')->nullable();
            $table->string('arrival_place')->nullable();
            $table->string('accommodation_place')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_logs');
    }
};