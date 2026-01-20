<?php

namespace App\Http\Controllers;

use App\Services\DeviceService;
use App\Services\GpsLogService;
use App\Services\ExportService;
use Inertia\Inertia;

class GpsController extends Controller
{
    protected $gpsLogService;
    protected $deviceService;
    protected $exportService;

    public function __construct(GpsLogService $gpsLogService, DeviceService $deviceService, ExportService $exportService)
    {
        $this->gpsLogService = $gpsLogService;
        $this->deviceService = $deviceService;
        $this->exportService = $exportService;
    }

    public function speed()
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        
        return Inertia::render('Gps/Speed', [
            'devices' => $devices
        ]);
    }
        
    public function map()
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        return Inertia::render('Gps/Map', [
            'devices' => $devices
        ]);
    }

    public function tripMap()
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        return Inertia::render('Gps/TripMap', [
            'devices' => $devices
        ]);
    }
}