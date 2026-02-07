<?php
namespace App\Repositories;

use App\Models\GpsLog;
use Illuminate\Support\Facades\DB;

class GpsLogRepository
{
    public function all($search, $perPage, $sortField, $sortDirection)
    {
        $query = GpsLog::query()->select('gps_logs.*', 'devices.name');
        if ($search) {
            $query->where('devices.name', 'like', "%{$search}%");
            $query->orWhere('gps_logs.trip_id', 'like', "%{$search}%");
        }

        $query->join('devices', 'gps_logs.device_id', '=', 'devices.id');

        if ($sortField && in_array($sortField, ['id', 'device_id', 'latitude', 'longitude', 'speed', 'recorded_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        if ($sortField == "name") {
            $query->orderBy("devices.name", $sortDirection);
        }

        $gpsLogs = $perPage == 0
            ? $query->get()
            : $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $gpsLogs;
    }

    public function allTrip($search, $perPage, $sortField, $sortDirection)
    {
        $query = GpsLog::query()
            ->select('gps_logs.trip_id', 'devices.name', DB::raw('MIN(devices.identifier) as identifier'), DB::raw('MIN(gps_logs.recorded_at) as recorded_at'))
            ->join('devices', 'gps_logs.device_id', '=', 'devices.id');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('devices.name', 'like', "%{$search}%")
                ->orWhere('gps_logs.trip_id', 'like', "%{$search}%");
            });
        }

        $query->groupBy('gps_logs.trip_id', 'devices.name');

        if ($sortField && in_array($sortField, ['trip_id', 'recorded_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        if ($sortField == "name") {
            $query->orderBy("devices.name", $sortDirection);
        }

        $gpsLogs = $perPage == 0
            ? $query->get()
            : $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $gpsLogs;
    }

    public function findBytripId($deviceId, $tripId, $perPage)
    {
        $query = GpsLog::where('device_id', '=', $deviceId)->where('trip_id', '=', $tripId)->orderBy('recorded_at', 'asc');
        $data = $perPage ? $query->paginate($perPage)->withQueryString()->onEachSide(0) : $query->get();
        return $data;
    }

    public function find($id)
    {
        return GpsLog::find($id);
    }

    public function create($data): GpsLog
    {
        return GpsLog::create($data);
    }

    public function update($gpsLog, $data)
    {
        $gpsLog->update($data);

        return $gpsLog;
    }

    public function delete($device)
    {
        return $device->delete();
    }

    public function deleteByTripId($deviceId, $tripId)
    {
        return GpsLog::where('device_id', $deviceId)
            ->where('trip_id', $tripId)
            ->delete();
    }
}