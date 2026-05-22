<?php

namespace App\Http\Controllers;

use App\Services\GpsLogService;
use App\Services\TripStatService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TripStatController extends Controller
{
    protected $tripStatService;

    public function __construct(TripStatService $tripStatService)
    {
        $this->tripStatService = $tripStatService;
    }
    
    public function index()
    {
        return Inertia::render('Stats/Index');
    }

    public function fetchTripStatData(Request $request)
    {
        $tripIds = $request->input('trip_id', []); 
        $deviceIds = $request->input('device_id', []); 
        $isOptimal = $request->boolean('is_optimal'); 

        if (count($tripIds) !== count($deviceIds)) {
            return response()->json([
                'message' => 'Jumlah trip_id dan device_id tidak sama'
            ], 422);
        }

        $data = $this->tripStatService->getData($tripIds, $deviceIds, $isOptimal);
        
        return response()->json($data);
    }

    public function fetchTripStatDataById($identifier, $tripId)
    {
        $data = $this->tripStatService->getDataById($identifier, $tripId);
        
        return response()->json($data);
    }

    public function fetchTripStatDataMulti(Request $request)
    {
        $tripIds = $request->input('trip_ids', []);

        $data = $this->tripStatService->getDataMulti($tripIds);

        return response()->json($data);
    }
}