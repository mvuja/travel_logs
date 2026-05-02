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
        Schema::table('travel_logs', function (Blueprint $table) {
            $table->string('place_name')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('from_place_name')->nullable();
            $table->string('from_city')->nullable();
            $table->string('from_country')->nullable();
            $table->decimal('from_lat', 10, 7)->nullable();
            $table->decimal('from_lng', 10, 7)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('travel_logs', function (Blueprint $table) {
            $table->dropColumn([
                'place_name', 'city', 'country',
                'from_place_name', 'from_city', 'from_country', 'from_lat', 'from_lng',
            ]);
        });
    }
};
