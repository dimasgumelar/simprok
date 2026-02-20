<?php

namespace Database\Seeders;

use App\Models\Device;
use Illuminate\Database\Seeder;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $listName = ['Motor', 'Mobil', 'Bus', 'Truk'];
        $listUuid = ['2c306e64-2644-4622-aa3f-5431dce06b19', '3dfd872a-90da-4047-9df1-0f8fd5888b6d', '44db3d76-b5e7-42e1-9170-ae88bcbcf005', '3ae805d9-10e5-4d65-a66b-75653042aa61'];
        for ($i=0; $i <4 ; $i++) { 
            Device::create([
                'name' => $listName[$i],
                'type' => 'microcontroller',
                'identifier' => $listUuid[$i],
            ]);
        }
    }
}