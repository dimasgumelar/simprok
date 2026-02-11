<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\GpsLog;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class GpsLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::all();

        foreach ($devices as $device) {
            for ($j=0; $j <8 ; $j++) { 
                $tripId = Str::uuid()->toString();
                for ($i = 0; $i < 100; $i++) {
                    GpsLog::create([
                        'trip_id'     => $tripId,
                        'device_id'   => $device->id,
                        'latitude'    => -6.200000 + rand(-10, 10) / 10000,
                        'longitude'   => 106.816666 + rand(-10, 10) / 10000,
                        'speed'       => rand(0, 100), // km/h
                        'recorded_at' => Carbon::now()->subMinutes(20 - $i),
                    ]);
                }
            }
        }
    }
}