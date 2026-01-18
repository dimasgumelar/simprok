<?php

namespace App\Http\Controllers;

use App\Models\GpsLog;
use App\Services\DeviceService;
use App\Services\GpsLogService;
use App\Services\ExportService;
use Illuminate\Http\Request;
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

    /**
     * Display a listing of the resource.
     */
    public function speed(Request $request)
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        
        // Ambil input filter
        // $search = $request->input('search');
        // $perPage = $request->input('per_page', 10);

        // // Ambil input sorting
        // $sortField = $request->input('sort', 'id');
        // $sortDirection = $request->input('direction', 'asc');

        return Inertia::render('Gps/Speed', [
            'devices' => $devices
        ]);
        }
        
    public function map(Request $request)
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        return Inertia::render('Gps/Map', [
            'devices' => $devices
        ]);
    }

    public function tripMap(Request $request)
    {
        $devices = $this->deviceService->getAll(null, 0, null, null);
        return Inertia::render('Gps/TripMap', [
            'devices' => $devices
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(GpsLog $gpsLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GpsLog $gpsLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GpsLog $gpsLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GpsLog $gpsLog)
    {
        //
    }
}