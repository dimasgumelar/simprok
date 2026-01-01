<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Services\DeviceService;
use App\Services\ExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DeviceController extends Controller
{
    protected $deviceService;
    protected $exportService;

    public function __construct(DeviceService $deviceService, ExportService $exportService)
    {
        $this->deviceService = $deviceService;
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

        $devices = $this->deviceService->getAll($search, $perPage, $sortField, $sortDirection);

        return Inertia::render('Devices/Index', compact('devices'));
    }

    public function export(Request $request)
    {
        // Ambil input filter
        $search = $request->input('search');
        $perPage = 0;

        // Ambil input sorting
        $sortField = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'asc');

        $devices = $this->deviceService->getAll($search, $perPage, $sortField, $sortDirection);

        $fileName = 'devices_' . now('Asia/Jakarta')->format('Ymd_His') . '.csv';
        $callback = function () use ($devices) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nama', 'Tipe', 'Identitas', 'Tanggal Ditambahkan', 'Tanggal Diperbarui']);

            foreach ($devices as $device) {
                fputcsv($handle, [
                    $device->id,
                    $device->name,
                    $device->type,
                    $device->identifier,
                    $device->created_at,
                    $device->updated_at,
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
        return Inertia::render('Devices/Form', [
            'device' => new Device(),
            'types' => config('constants.device_types'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:microcontroller',
        ]);

        $device = $this->deviceService->create($data);
        if (!$device) {
            return Redirect::back()->with('error', 'Gagal menambah data perangkat.');
        }
        
        return Redirect::route('devices.index')->with('success', 'Berhasil menambah data perangkat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Device $device)
    {
        return Inertia::render('Devices/Show', [
            'device' => $device,
        ]);
    }
    
    /**
     * Show the form for editing the specified resource.
    */
    public function edit(Device $device)
    {
        return Inertia::render('Devices/Form', [
            'device' => $device,
            'types' => config('constants.device_types'),
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Device $device)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:microcontroller',
        ]);

        $device = $this->deviceService->update($device, $data);
        if (!$device) {
            return Redirect::back()->with('error', 'Gagal mengubah data perangkat.');
        }
        
        return Redirect::route('devices.index')->with('success', 'Berhasil mengubah data perangkat.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Device $device)
    {
        $device = $this->deviceService->delete($device);
        if (!$device) {
            return Redirect::back()->with('error', 'Gagal menghapus data perangkat.');
        }

        return Redirect::route('devices.index')->with('success', 'Berhasil menghapus data perangkat.');
    }
}