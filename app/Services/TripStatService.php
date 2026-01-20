<?php

namespace App\Services;

use App\Repositories\TripStatRepository;

class TripStatService
{
    protected $tripStatRepo;
    protected $deviceRepo;

    public function __construct(TripStatRepository $tripStatRepo)
    {
        $this->tripStatRepo = $tripStatRepo;
    }
    
    public function getData()
    {
        $avgChartData = [];
        $bestAvgTrips = $this->tripStatRepo->bestAvgTrips();
        foreach ($bestAvgTrips as $deviceId => $trip) {
            $stats = $this->tripStatRepo->findByTripId($trip->trip_id, $deviceId);
            $avgChartData[] = [
                'name' => $trip->device->name ?? "Device {$deviceId}",
                'trip_id' => $trip->trip_id,
                'data' => $stats->pluck('avg_speed')->values()->toArray(),
            ];
        }

        $p85ChartData = [];
        $bestP85Trips = $this->tripStatRepo->bestP85Trips();
        foreach ($bestP85Trips as $deviceId => $trip) {
            $stats = $this->tripStatRepo->findByTripId($trip->trip_id, $deviceId);
            $p85ChartData[] = [
                'name' => $trip->device->name ?? "Device {$deviceId}",
                'trip_id' => $trip->trip_id,
                'data' => $stats->pluck('p85_speed')->values()->toArray(),
            ];
        }

        $data = [
            "avg" => $avgChartData,
            "p85" => $p85ChartData,
        ];
        return $data;
    }
}