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
        $listName = ['Motor', 'Mobil', 'Bus', 'Truk'];
        for ($i=0; $i <4 ; $i++) { 
            Device::create([
                'name' => $listName[$i],
                'type' => 'microcontroller',
                'identifier' => (string) Str::uuid(),
            ]);
        }
    }
}