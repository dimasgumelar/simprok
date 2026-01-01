<?php

namespace Database\Seeders;

use App\Models\Device;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i=1; $i <=4 ; $i++) { 
            Device::create([
                'name' => 'Alat '.$i,
                'type' => 'microcontroller',
                'identifier' => (string) Str::uuid(),
            ]);
        }
    }
}