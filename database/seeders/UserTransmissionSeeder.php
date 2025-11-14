<?php

namespace Database\Seeders;

use App\Models\UserTransmission;
use App\Models\Transmission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;

class UserTransmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
   {
      $transmissions = Transmission::all();
      $path = database_path('seeders/users.csv');
      if (!file_exists($path)) {
         $this->command->error("File CSV tidak ditemukan di: $path");
         return;
      }

      $handle = fopen($path, 'r');
      $header = fgetcsv($handle); // Baca baris header pertama

      $index = 2;
      while (($row = fgetcsv($handle)) !== false) {
         $data = array_combine($header, $row);
         foreach ($transmissions as $key => $transmission) {
            if ($transmission->name == $data['Penempatan']) {
               UserTransmission::create(
                  [
                     'user_id' => $index,
                     'transmission_id' => $transmission->id,
                  ],
               );
            }
         }
         $index++;
      }

      fclose($handle);

      // foreach ($transmissions as $transmission) {
      //    // ketua tim
      //    UserTransmission::create(
      //       [
      //          'user_id' => 2,
      //          'transmission_id' => $transmission->id,
      //       ],
      //    );
      //    // teknisi all
      //    UserTransmission::create(
      //       [
      //          'user_id' => 3,
      //          'transmission_id' => $transmission->id,
      //       ],
      //    );
      // }
      // // teknisi
      // for ($i = 4; $i <= 7; $i++) {
      //    UserTransmission::create(
      //       [
      //             'user_id' => $i,
      //             'transmission_id' => $i-3,
      //       ],
      //    );
      // }
      // // operator
      // for ($i = 8; $i <= 107; $i++) {
      //    UserTransmission::create(
      //       [
      //             'user_id' => $i,
      //             'transmission_id' => (($i-8)%12)+1,
      //       ],
      //    );
      // }
   }
}