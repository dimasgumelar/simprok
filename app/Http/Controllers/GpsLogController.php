<?php

namespace App\Http\Controllers;

use App\Services\GpsLogService;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

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
     * Display a listing of the resource.
     */
    public function tripIndex(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        // Ambil input sorting
        $sortField = $request->input('sort', 'recorded_at');
        $sortDirection = $request->input('direction', 'desc');

        $trips = $this->gpsLogService->getAllTrip($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('Trips/Index', compact('trips'));
    }

    public function tripExport(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $gpsLogs = $this->gpsLogService->getAllTrip($search, $perPage, $sortField, $sortDirection);

        $fileName = 'trips_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($gpsLogs) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['No', 'Nama', 'Trip']);

            $counter = 1;
            foreach ($gpsLogs as $gpsLog) {
                fputcsv($handle, [
                    $counter,
                    $gpsLog->name,
                    $gpsLog->trip_id,
                ]);
                $counter++;
            }
            fclose($handle);
        };

        return $this->exportService->export($fileName, $callback);
    }

    public function tripExportById($type, $identifier, $tripId)
    {
        $fileName = 'trip_'. $type . "_" . $tripId . "-" . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = $this->gpsLogService->tripExportById($type, $identifier, $tripId);
        if (!$callback) {
            return response()->json([
                'message' => 'Tipe export tidak valid',
            ], 400);
        }
        return $this->exportService->export($fileName, $callback);
    }

    /**
     * Display the specified resource.
     */
    public function showTrip($identifier, $tripId)
    {
        return Inertia::render('Trips/TripsView', [
            'identifier' => $identifier,
            'tripId' => $tripId,
        ]);
    }

    public function fetchTripData($identifier, $tripId)
    {
        $trips = $this->gpsLogService->findByTripId($identifier, $tripId, 1000); // per page 1.000

        return response()->json($trips);
    }

    public function destroy($identifier, $tripId)
    {
        $tripDeleted = $this->gpsLogService->deleteByTripId($identifier, $tripId);
        if (!$tripDeleted) {
            return Redirect::back()->with('error', 'Gagal menghapus data trip.');
        }

        return Redirect::route('trips.index')->with('success', 'Berhasil menghapus data trip.');
    }
}