<?php
namespace App\Repositories;

use App\Models\GpsLog;

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

       $gpsLogs = $perPage == 0
            ? $query->get()
            : $query->paginate($perPage)->withQueryString()->onEachSide(0);

        return $gpsLogs;
    }

    public function find($id)
    {
        return GpsLog::find($id);
    }

    public function create($data): GpsLog
    {
        return GpsLog::create($data);
    }

    public function update($device, $data)
    {
        $device->update($data);

        return $device;
    }

    public function delete($device)
    {
        return $device->delete();
    }
}