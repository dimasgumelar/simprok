<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\TripStat;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TripStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::all();

        foreach ($devices as $device) {
            for ($j=0; $j < 5; $j++) { 
                $tripId = Str::uuid()->toString();
                for ($i = 0; $i < 9; $i++) {
                    $avgSpeed = rand(30, 80);
                    $minSpeed = rand(10, $avgSpeed - 5);

                    $p85Speed = rand(
                        $avgSpeed + 5,
                        min($avgSpeed + 15, 120)
                    );

                    $maxSpeed = rand(
                        $p85Speed + 5,
                        min($p85Speed + 20, 140)
                    );

                    TripStat::create([
                        'trip_id'     => $tripId,
                        'device_id'   => $device->id,
                        'km'          => $i,
                        'avg_speed'   => $avgSpeed,
                        'min_speed'   => $minSpeed,
                        'max_speed'   => $maxSpeed,
                        'p85_speed'   => $p85Speed,
                        'count_logs'  => rand(40, 70),
                    ]);
                }
            }
        }
    }
}