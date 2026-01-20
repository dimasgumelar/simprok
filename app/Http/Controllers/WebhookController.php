<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessGpsLog;
use App\Services\GpsLogService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    protected $gpsLogService;

    public function __construct(GpsLogService $gpsLogService)
    {
        $this->gpsLogService = $gpsLogService;
    }
    
    public function create(Request $request)
    {
        if ($request->header('x-emqx-token') !== env('EMQX_SECRET')) {
            abort(401, 'Invalid token');
        }

        $data = $request->validate([
            'device_id'   => 'required|uuid',
            'latitude'    => 'required|numeric|between:-90,90',
            'longitude'   => 'required|numeric|between:-180,180',
            'speed'       => 'required|numeric|min:0',
            'recorded_at' => 'required|date',
            'trip_id'     => 'required|uuid',
        ]);
        
        $gpsLog = $this->gpsLogService->create($data);

        ProcessGpsLog::dispatch($gpsLog->id);
        
        return response()->json(['status' => 'ok']);
    }
}