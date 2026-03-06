<?php

namespace App\Services;

use App\Repositories\DeviceRepository;
use App\Repositories\TripStatRepository;

class TripStatService
{
    protected $tripStatRepo;
    protected $deviceRepo;

    public function __construct(TripStatRepository $tripStatRepo, DeviceRepository $deviceRepo)
    {
        $this->tripStatRepo = $tripStatRepo;
        $this->deviceRepo = $deviceRepo;
    }
    
    public function getData($tripIds = [], $deviceIds = [], $isOptimal = false)
    {
        $tripIdsReq = $tripIds;
        $deviceIdsReq = $deviceIds;

        $avgChartData = [];
        $p85ChartData = [];
        $tripGrouppedById = $this->tripStatRepo->getTripGrouppedById();
        $tripGroupped = $tripGrouppedById->map(function ($item) {
            return [
                'device_id' => $item->device_id,
                'name' => $item->device->name ?? "Device {$item->device_id}",
                'trip_ids' => explode(',', $item->trip_ids),
            ];
        });

        $deviceNameMap = $tripGroupped->pluck('name', 'device_id');

        if ($isOptimal) {
            $bestAvgTrips = $this->tripStatRepo->bestAvgTrips($tripIdsReq, $deviceIdsReq);
            $tripIds = [];
            $deviceIds = [];
            foreach ($bestAvgTrips as $trip) {
                $tripIds[] = $trip->trip_id;
                $deviceIds[] = $trip->device_id;
            }

            $allStats = $this->tripStatRepo->findByDeviceTripPairs($tripIds, $deviceIds);
            $grouped = $allStats->groupBy(function ($item) {
                return $item->device_id.'|'.$item->trip_id;
            });

            foreach ($grouped as $key => $rows) {
                [$deviceId, $tripId] = explode('|', $key);
                $avgChartData[] = [
                    'name' => $deviceNameMap[$deviceId] . " [".$tripId."]",
                    'trip_id' => $tripId,
                    'data' => $rows->pluck('avg_speed')->values()->toArray(),
                ];
            }
            
            $tripIds = [];
            $deviceIds = [];
            $bestP85Trips = $this->tripStatRepo->bestP85Trips($tripIdsReq, $deviceIdsReq);
            foreach ($bestP85Trips as $trip) {
                $tripIds[] = $trip->trip_id;
                $deviceIds[] = $trip->device_id;
            }
            $allStats = $this->tripStatRepo->findByDeviceTripPairs($tripIds, $deviceIds);
            $grouped = $allStats->groupBy(function ($item) {
                return $item->device_id.'|'.$item->trip_id;
            });
    
            foreach ($grouped as $key => $rows) {
                [$deviceId, $tripId] = explode('|', $key);
                $p85ChartData[] = [
                    'name' => $deviceNameMap[$deviceId] . " [".$tripId."]",
                    'trip_id' => $tripId,
                    'data' => $rows->pluck('p85_speed')->values()->toArray(),
                ];
            }
        } elseif (count($tripIds) > 0) {
            $allStats = $this->tripStatRepo->findByDeviceTripPairs($tripIds, $deviceIds);
            $grouped = $allStats->groupBy(function ($item) {
                return $item->device_id.'|'.$item->trip_id;
            });
    
            foreach ($grouped as $key => $rows) {
                [$deviceId, $tripId] = explode('|', $key);
    
                $avgChartData[] = [
                    'name' => $deviceNameMap[$deviceId] . " [".$tripId."]",
                    'trip_id' => $tripId,
                    'data' => $rows->pluck('avg_speed')->values()->toArray(),
                ];
    
                $p85ChartData[] = [
                    'name' => $deviceNameMap[$deviceId] . " [".$tripId."]",
                    'trip_id' => $tripId,
                    'data' => $rows->pluck('p85_speed')->values()->toArray(),
                ];
            }
        }

        $data = [
            "filter" => $tripGroupped,
            "avg" => $avgChartData,
            "p85" => $p85ChartData,
        ];
        return $data;
    }

    public function getDataById($identifier, $tripId)
    {
        $device = $this->deviceRepo->findByIdentifier($identifier);
        if (!$device) {
            return $device;
        }

        $stats = $this->tripStatRepo->findByTripId($tripId, $device->id);
        $avgChartData[] = [
            'name' => $device->name ?? "Device {$device->id}",
            'trip_id' => $tripId,
            'data' => $stats->pluck('avg_speed')->values()->toArray(),
        ];

        $p85ChartData[] = [
            'name' => $device->name ?? "Device {$device->id}",
            'trip_id' => $tripId,
            'data' => $stats->pluck('p85_speed')->values()->toArray(),
        ];

        $data = [
            "avg" => $avgChartData,
            "p85" => $p85ChartData,
        ];
        return $data;
    }
}