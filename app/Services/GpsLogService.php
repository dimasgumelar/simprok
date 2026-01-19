<?php
namespace App\Services;

use App\Models\GpsLog;
use App\Repositories\DeviceRepository;
use App\Repositories\GpsLogRepository;

class GpsLogService
{
    protected $gpsLogRepo;
    protected $geoService;
    protected $deviceRepo;

    public function __construct(GpsLogRepository $gpsLogRepo, GeoService $geoService, DeviceRepository $deviceRepo)
    {
        $this->gpsLogRepo = $gpsLogRepo;
        $this->geoService = $geoService;
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

    public function getAllGrouped($search, $perPage, $sortField, $sortDirection)
    {
        $points = $this->gpsLogRepo->all($search, $perPage, $sortField, $sortDirection);

        $totalDistance = 0;
        $currentKm = 1;
        $speeds = [];
        $pointIds = [];
        $results = [];

        for ($i = 1; $i < count($points); $i++) {
            $prev = $points[$i-1];
            $cur  = $points[$i];

            $dist = $this->geoService->haversine(
                $prev->latitude, $prev->longitude,
                $cur->latitude,  $cur->longitude
            );

            if ($i == 1 && empty($pointIds)) {
                $pointIds[] = $prev->id;
            }

            $pointIds[] = $cur->id;
            $totalDistance += $dist;
            $speeds[] = $cur->speed;

            if ($totalDistance >= 1000) {
                $avgSpeed = array_sum($speeds) / count($speeds);

                $results[] = [
                    'segment' => $currentKm,
                    'distance_m' => round($totalDistance, 2),
                    'avg_speed' => round($avgSpeed, 2),
                    'point_ids' => $pointIds,
                    'from' => $points[$i - count($pointIds) + 1]->recorded_at ?? $points[0]->recorded_at,
                    'to' => $cur->recorded_at
                ];

                // RESET tapi pertahankan titik terakhir sbg starting point
                $currentKm++;
                $totalDistance = 0;
                $speeds = [];
                $pointIds = [$cur->id];   // <-- PERBAIKAN DI SINI
            }
        }

        // Segment sisa (opsional)
        if ($totalDistance > 0 && count($pointIds) > 1) {
            $avgSpeed = array_sum($speeds) / count($speeds);

            $results[] = [
                'segment' => $currentKm,
                'distance_m' => round($totalDistance, 2),
                'avg_speed' => round($avgSpeed, 2),
                'point_ids' => $pointIds,
                'from' => $points[count($points) - count($pointIds)]->recorded_at ?? $points[0]->recorded_at,
                'to' => $points[count($points)-1]->recorded_at
            ];
        }

        dd($results);

        return $results;
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