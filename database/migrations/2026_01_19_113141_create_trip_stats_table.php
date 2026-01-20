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
        Schema::create('trip_stats', function (Blueprint $table) {
            $table->id();

            // Trip tracking
            $table->uuid('trip_id');
            $table->foreignId('device_id')->constrained()->onDelete('cascade');

            // KM tracker, starting from 0,1,2...
            $table->unsignedInteger('km');

            // Statistics for this km
            $table->float('avg_speed')->nullable();
            $table->float('min_speed')->nullable();
            $table->float('max_speed')->nullable();
            $table->float('p85_speed')->nullable();

            // Optional: how many datapoints contributed
            $table->unsignedInteger('count_logs')->default(0);

            $table->timestamps();

            // Composite index so lookup is fast
            $table->index(['device_id', 'trip_id']);   // filter utama
            $table->index(['device_id', 'avg_speed']); // cari trip terbaik
            $table->index(['trip_id', 'km']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_stats');
    }
};