<?php

namespace App\Jobs;

use App\Models\GpsLog;
use App\Models\TripStat;
use App\Repositories\GpsLogRepository;
use App\Services\GeoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessGpsLog implements ShouldQueue
{
    use Queueable;

    protected $logId;
    /**
     * Create a new job instance.
     */
    public function __construct($logId)
    {
        $this->logId = $logId;
    }

    /**
     * Execute the job.
     */
    public function handle(GeoService $geo, GpsLogRepository $gpsLogRepo): void
    {
        $log = $gpsLogRepo->find($this->logId);
        if (!$log) return;

        $tripId = $log->trip_id;
        $deviceId = $log->device_id;

        // ambil log sebelumnya berdasarkan waktu
        $prevLog = GpsLog::where('trip_id', $tripId)
            ->where('id', '<', $log->id)
            ->orderBy('id', 'desc')
            ->first();

        $distanceKm = 0;
        
        if ($prevLog) {
            // haversine distance
            $distanceKm = $geo->haversine(
                $prevLog->latitude,
                $prevLog->longitude,
                $log->latitude,
                $log->longitude
            ) / 1000;
                
            // jumlahkan ke total km sebelumnya
            $log->total_distance_km = ($prevLog->total_distance_km + $distanceKm);
        } else {
            // log pertama mulai dari nol
            $log->total_distance_km = 0;
        }

        $log->save();

        // tentukan KM ke berapa (integer)
        $km = floor($log->total_distance_km);

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