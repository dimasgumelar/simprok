<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\Transmission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transmissions = Transmission::all();
        $path = database_path('seeders/inventories.csv');
        if (!file_exists($path)) {
            $this->command->error("File CSV tidak ditemukan di: $path");
            return;
        }
    
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle); // Baca baris header pertama
    
        $index = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            $code = 'INV' . date('Ymd') . str_pad(($index), 4, '0', STR_PAD_LEFT);
            $transmission_id = 1;
            foreach ($transmissions as $key => $transmission) {
                if ($transmission->name == $data['LOKASI']) {
                    $transmission_id = $transmission->id;
                }
            }
    
            Inventory::create(
                [
                    'inventory_code' => $code,
                    'name' => $data['NAMA BARANG'],
                    'brand' => $data['MERK'],
                    'category_id' => 1,
                    'transmission_id' => $transmission_id,
                    'received_at' => $data['TANGGAL DITERIMA'],
                    'condition' => 1,
                ]
            );
            $index++;
        }
    
        fclose($handle);
    }
}