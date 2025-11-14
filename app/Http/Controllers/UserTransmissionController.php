<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserTransmission;
use App\Services\UserTransmissionService;
use Inertia\Inertia; 
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

class UserTransmissionController extends Controller
{
    protected $userTransmissionService;

    public function __construct(UserTransmissionService $userTransmissionService)
    {
        $this->userTransmissionService = $userTransmissionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function userTransmissions(User $user, Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sortField = $request->sort;
        $sortDirection = $request->direction;

        $userSelected = $user;
        $userTransmissions = $this->userTransmissionService->getAllByUserId($user->id, $perPage, $sortField, $sortDirection);

        return Inertia::render('Users/Transmissions', compact( 'userSelected', 'userTransmissions'));

    }

    /**
     * Show the form for creating a new resource.
     */
    public function userTransmissionsCreate(User $user)
    {
        $userSelected = $user;
        $transmissions = $this->userTransmissionService->getTransmissionAvailableForUser($user->id, 0, "name", "ASC");
        if (count($transmissions) < 1) {
            return Redirect::back()->with('error', 'Tidak ada transmisi yang dapat ditambahkan');
        }
        return Inertia::render('Users/TransmissionForm', compact( 'userSelected', 'transmissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(User $user, Request $request)
    {
        $request->validate([
            'user_id' => 'required|min:0',
            'transmission_id' => 'required|min:0',
        ]);

        $userTransmission = $this->userTransmissionService->create($request->user_id, $request->transmission_id);
        if (!$userTransmission) {
            return Redirect::back()->with('error', 'Gagal menambah transmisi.');
        }
        
        return Redirect::route('users.transmissions', $user->id)->with('success', 'Berhasil menambah data transmisi pengguna.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UserTransmission $userTransmission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserTransmission $userTransmission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserTransmission $userTransmission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, Request $request)
    {
        $userTransmissionDeleted = $this->userTransmissionService->delete($request->id);
        if (!$userTransmissionDeleted) {
            return Redirect::back()->with('error', 'Gagal menghapus data transmisi pengguna.');
        }

        return Redirect::route('users.transmissions', $user->id)->with('success', 'Berhasil menghapus data transmisi pengguna.');
    }
}