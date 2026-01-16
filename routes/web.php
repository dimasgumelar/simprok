<?php

use App\Http\Controllers\DeviceController;
use App\Http\Controllers\GpsLogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GpsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', [WebController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    Route::get('/devices/export', [DeviceController::class, 'export'])->name('devices.export');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/view', [UserController::class, 'show'])->name('users.view');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/delete', [UserController::class, 'destroy'])->name('users.destroy');
    
    Route::get('/devices', [DeviceController::class, 'index'])->name('devices.index');
    Route::get('/devices/export', [DeviceController::class, 'export'])->name('devices.export');
    Route::get('/devices/create', [DeviceController::class, 'create'])->name('devices.create');
    Route::post('/devices', [DeviceController::class, 'store'])->name('devices.store');
    Route::get('/devices/{device}/view', [DeviceController::class, 'show'])->name('devices.view');
    Route::get('/devices/{device}/edit', [DeviceController::class, 'edit'])->name('devices.edit');
    Route::put('/devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
    Route::post('/devices/{device}/delete', [DeviceController::class, 'destroy'])->name('devices.destroy');
    
    Route::get('/gps-log', [GpsLogController::class, 'index'])->name('gpslogs.index');
    Route::get('/gps-log/export', [GpsLogController::class, 'export'])->name('gpslogs.export');
    
    Route::get('/trip', [GpsLogController::class, 'tripIndex'])->name('trips.index');
    Route::get('/trip/export', [GpsLogController::class, 'tripExport'])->name('trips.export');
    Route::get('/trip/{tripId}/view', [GpsLogController::class, 'showTrip'])->name('trips.view');
    Route::get('/api/trip/{tripId}', [GpsLogController::class, 'fetchTripData']);

    Route::get('/speed', [GpsController::class, 'speed'])->name('gps.speed');
    Route::get('/map', [GpsController::class, 'map'])->name('gps.map');
});

require __DIR__.'/auth.php';