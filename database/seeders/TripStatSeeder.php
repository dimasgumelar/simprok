<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\GpsLog;
use App\Models\TripStat;
use App\Services\GeoService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TripStatSeeder extends Seeder
{
    protected $geo;

    public function __construct(
        GeoService $geo
    ) {
        $this->geo = $geo;
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gpsLogs = GpsLog::all();

        foreach ($gpsLogs as $gpsLog) {
            $tripId = $gpsLog->trip_id;
            $deviceId = $gpsLog->device_id;
            $prevLog = GpsLog::where('trip_id', $tripId)
                ->where('id', '<', $gpsLog->id)
                ->orderBy('id', 'desc')
                ->first();

            $distanceKm = 0;
            
            if ($prevLog) {
                // haversine distance
                $distanceKm = $this->geo->haversine(
                    $prevLog->latitude,
                    $prevLog->longitude,
                    $gpsLog->latitude,
                    $gpsLog->longitude
                ) / 1000;
                    
                // jumlahkan ke total km sebelumnya
                $gpsLog->total_distance_km = ($prevLog->total_distance_km + $distanceKm);
            } else {
                // log pertama mulai dari nol
                $gpsLog->total_distance_km = 0;
            }

            $gpsLog->save();

            // tentukan KM ke berapa (integer)
            $km = floor($gpsLog->total_distance_km);

            // ambil semua speed di KM tsb
            $speeds = GpsLog::where('trip_id', $tripId)
                ->where('total_distance_km', '>=', $km)
                ->where('total_distance_km', '<', $km + 1)
                ->pluck('speed')
                ->sort()
                ->values();

            $count = $speeds->count();
            if ($count === 0) return;

            // hitung p85
            $index = floor(0.85 * ($count - 1));
            $p85 = $speeds[$index];

            TripStat::updateOrCreate(
                ['trip_id' => $tripId, 'km' => $km],
                [
                    'avg_speed' => $speeds->avg(),
                    'min_speed' => $speeds->min(),
                    'max_speed' => $speeds->max(),
                    'p85_speed' => $p85,
                    'count_logs' => $count,
                    'device_id' => $deviceId,
                ]
            );
        }
    }
}