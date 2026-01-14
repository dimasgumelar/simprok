<?php

namespace App\Http\Controllers;

use App\Models\GpsLog;
use App\Services\GpsLogService;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class GpsLogController extends Controller
{
    protected $gpsLogService;
    protected $exportService;

    public function __construct(GpsLogService $gpsLogService, ExportService $exportService)
    {
        $this->gpsLogService = $gpsLogService;
        $this->exportService = $exportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        // $gpsLogs = $this->gpsLogService->getAllGrouped($search, $perPage, $sortField, $sortDirection);
        $gpsLogs = $this->gpsLogService->getAll($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('GpsLogs/Index', compact('gpsLogs'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $gpsLogs = $this->gpsLogService->getAll($search, $perPage, $sortField, $sortDirection);

        $fileName = 'gpsLogs_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($gpsLogs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nama', 'Trip', 'Latitude', 'Longitude', 'Kecepatan', 'Tanggal Direkam', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($gpsLogs as $gpsLog) {
                fputcsv($handle, [
                    $gpsLog->id,
                    $gpsLog->name,
                    $gpsLog->trip_id,
                    $gpsLog->latitude,
                    $gpsLog->longitude,
                    $gpsLog->speed,
                    $gpsLog->recorded_at,
                    $gpsLog->created_at,
                    $gpsLog->updated_at,
                ]);
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
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