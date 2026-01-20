<?php
namespace App\Services;

use App\Models\GpsLog;
use App\Repositories\DeviceRepository;
use App\Repositories\GpsLogRepository;

class GpsLogService
{
    protected $gpsLogRepo;
    protected $deviceRepo;

    public function __construct(GpsLogRepository $gpsLogRepo, DeviceRepository $deviceRepo)
    {
        $this->gpsLogRepo = $gpsLogRepo;
        $this->deviceRepo = $deviceRepo;
    }

    public function getAll($search, $perPage, $sortField, $sortDirection)
    {
        return $this->gpsLogRepo->all($search, $perPage, $sortField, $sortDirection);
    }

    public function getAllTrip($search, $perPage, $sortField, $sortDirection)
    {
        return $this->gpsLogRepo->allTrip($search, $perPage, $sortField, $sortDirection);
    }

    public function findBytripId($identifier, $tripdId, $perPage = 1000)
    {
        $device = $this->deviceRepo->findByIdentifier($identifier);
        if (!$device) {
            return $device;
        }

        return $this->gpsLogRepo->findBytripId($device->id, $tripdId, $perPage);
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
}