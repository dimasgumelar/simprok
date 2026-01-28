<?php

namespace App\Http\Controllers;

use App\Services\TripStatService;
use Illuminate\Support\Facades\Request;
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
        return Inertia::render('Stats/Index', [
        ]);
    }

    public function fetchTripStatData()
    {
        $data = $this->tripStatService->getData();
        
        return response()->json($data);
    }

    public function fetchTripStatDataById($identifier, $tripId)
    {
        $data = $this->tripStatService->getDataById($identifier, $tripId);
        
        return response()->json($data);
    }
}