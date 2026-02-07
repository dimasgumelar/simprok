<?php
namespace App\Repositories;

use App\Models\TripStat;

class TripStatRepository
{
    public function bestAvgTrips()
    {
        $bestAvgTrips = TripStat::selectRaw('device_id, trip_id, MAX(avg_speed) as peak_avg')
            ->groupBy('device_id', 'trip_id')
            ->get()
            ->groupBy('device_id')
            ->map(function ($trips) {
                return $trips->sortByDesc('peak_avg')->first();
            });

        return $bestAvgTrips;
    }

    public function bestP85Trips()
    {
        $bestP85Trips = TripStat::selectRaw('device_id, trip_id, MAX(p85_speed) as peak_p85')
            ->groupBy('device_id', 'trip_id')
            ->get()
            ->groupBy('device_id')
            ->map(function ($trips) {
                return $trips->sortByDesc('peak_p85')->first();
            });

        return $bestP85Trips;
    }

    public function findBytripId($tripId, $deviceId, $isFull = false)
    {
        $query = TripStat::where('device_id', $deviceId)
            ->where('trip_id', $tripId)
            ->orderBy('km');

        return $isFull ? $query->get() : $query->get(['km', 'avg_speed', 'p85_speed']);
    }

    public function deleteByTripId($deviceId, $tripId)
    {
        return TripStat::where('device_id', $deviceId)
            ->where('trip_id', $tripId)
            ->delete();
    }
}