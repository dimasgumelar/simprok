<?php
namespace App\Services;

use App\Models\GpsLog;
use App\Repositories\DeviceRepository;
use App\Repositories\GpsLogRepository;
use App\Repositories\TripStatRepository;

class GpsLogService
{
    protected $gpsLogRepo;
    protected $deviceRepo;
    protected $tripStatRepo;

    public function __construct(GpsLogRepository $gpsLogRepo, DeviceRepository $deviceRepo, TripStatRepository $tripStatRepo)
    {
        $this->gpsLogRepo = $gpsLogRepo;
        $this->deviceRepo = $deviceRepo;
        $this->tripStatRepo = $tripStatRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->gpsLogRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getAllTrip($search, $perPage, $sortField, $sortDirection)
    {
        return $this->gpsLogRepo->allTrip($search, $perPage, $sortField, $sortDirection);
    }

    public function findBytripId($identifier, $tripId, $perPage = 1000)
    {
        $device = $this->deviceRepo->findByIdentifier($identifier);
        if (!$device) {
            return $device;
        }

        return $this->gpsLogRepo->findBytripId($device->id, $tripId, $perPage);
    }

    public function getById($id)
    {
        return $this->gpsLogRepo->find($id);
    }

    public function create($data)
    {
        $device = $this->deviceRepo->findByIdentifier($data['device_id']);
        if (!$device) {
            return $device;
        }
        $data['device_id'] = $device->id;
        $gpsLog = $this->gpsLogRepo->create($data);
        return $gpsLog;
    }

    public function update($gpsLog, $data)
    {
        $gpsLogUpdated = $this->gpsLogRepo->update($gpsLog, $data);
        if (!$gpsLogUpdated) {
            return null;
        }
        
        return $gpsLogUpdated;
    }

    public function delete($gpsLog)
    {
        return $this->gpsLogRepo->delete($gpsLog);
    }
    
    public function tripExportById($type, $identifier, $tripId)
    {
        if ($type == "raw") {
            $device = $this->deviceRepo->findByIdentifier($identifier);
            if (!$device) {
                return $device;
            }
            $trips = $this->gpsLogRepo->findBytripId($device->id, $tripId, null);
            $callback = function () use ($trips, $device) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['ID', 'Nama', 'Trip', 'Latitude', 'Longitude', 'Kecepatan', 'Tanggal Direkam', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);
    
                foreach ($trips as $trip) {
                    fputcsv($handle, [
                        $trip->id,
                        $device->name,
                        $trip->trip_id,
                        $trip->latitude,
                        $trip->longitude,
                        $trip->speed,
                        $trip->recorded_at,
                        $trip->created_at,
                        $trip->updated_at,
                    ]);
                }
                fclose($handle);
            };
            return $callback;
        } elseif ($type == "stats") {
            $device = $this->deviceRepo->findByIdentifier($identifier);
            if (!$device) {
                return $device;
            }
            $stats = $this->tripStatRepo->findByTripId($tripId, $device->id, true);
            $callback = function () use ($stats) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['Km', 'Kecepatan Minimal', 'Kecepatan Maksimal', 'Kecepatan P85', 'Kecepatan Rata Rata', 'Titik Data']);
    
                foreach ($stats as $stat) {
                    fputcsv($handle, [
                        $stat->km,
                        $stat->min_speed,
                        $stat->max_speed,
                        $stat->p85_speed,
                        $stat->avg_speed,
                        $stat->count_logs,
                    ]);
                }
                fclose($handle);
            };
            return $callback;
        } else {
            return null;
        }
    }
}