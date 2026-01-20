<?php

namespace App\Http\Controllers;

use App\Services\TripStatService;
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
}