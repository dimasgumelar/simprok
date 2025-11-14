<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transmission;

class TransmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transmission::create([
            'name' => 'TVRI Pusat Jatim',
            'address' => 'Jl. Mayjen Sungkono No.124, Pakis, Kec. Sawahan, Surabaya, Jawa Timur 60189',
            'latitude' => -7.288579255195847,
            'longitude' => 112.71190526530435,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Surabaya',
            'address' => 'Jl. Raya Sambikerep No.187, Sambikerep, Kec. Sambikerep, Surabaya, Jawa Timur 60217',
            'latitude' => -7.279809669215994,
            'longitude' => 112.65253886891743,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Doek',
            'address' => 'Cempoko, Cepoko, Kec. Sumber, Kabupaten Probolinggo, Jawa Timur 67263',
            'latitude' => -7.946622656570862,
            'longitude' => 113.13416411125056,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Oro-oro Ombo',
            'address' => 'Oro-Oro Ombo, Kec. Batu, Kota Batu, Jawa Timur 65316',
            'latitude' => -7.902254141797434,
            'longitude' => 112.5259262515969,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Brengik',
            'address' => 'Brukoh, Bajang, Kec. Pakong, Kabupaten Pamekasan, Jawa Timur 69352',
            'latitude' => -7.056453462047997, 
            'longitude' => 113.58401194487169,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Gending',
            'address' => 'Curah Damar, Sidomulyo, Kec. Silo, Kabupaten Jember, Jawa Timur 68184',
            'latitude' => -8.255162117502552, 
            'longitude' => 113.93996262289842,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Alas Malang',
            'address' => 'Jalan Raya alasmalang, Garit, Gambor, Singojuruh, Banyuwangi Regency, East Java 68464',
            'latitude' => -8.327083843158693, 
            'longitude' => 114.25947617000607,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Besuki',
            'address' => 'Besuki, Jugo, Kec. Mojo, Kabupaten Kediri, Jawa Timur 64162',
            'latitude' => -7.862067784343702, 
            'longitude' => 111.85416042832227,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Tuban',
            'address' => 'Banteng, Ngandong, Kec. Grabagan, Kabupaten Tuban, Jawa Timur 62371',
            'latitude' => -7.013803959900356, 
            'longitude' => 112.0158428119594,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Cemorosewu',
            'address' => 'Sampe, Ngancar, Kec. Plaosan, Kabupaten Magetan, Jawa Timur 63361',
            'latitude' => -7.66706553788914, 
            'longitude' => 111.19247808784871,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Pandan',
            'address' => 'Pohulung, Klangon, Kec. Saradan, Kabupaten Madiun, Jawa Timur 63155',
            'latitude' => -7.39798646736513, 
            'longitude' => 111.89167265704829,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Brengos',
            'address' => 'Buluh, Ngromo, Kec. Nawangan, Kabupaten Pacitan, Jawa Timur 63584',
            'latitude' => -7.954450154378121,
            'longitude' => 111.19389145543204,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Wonogondo',
            'address' => 'Pakis, Wonogondo, Kec. Kebonagung, Kabupaten Pacitan, Jawa Timur 63561',
            'latitude' => -8.180414682242219, 
            'longitude' => 111.16122764987232,
            'is_active' => true,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        // Tidak Aktif
        Transmission::create([
            'name' => 'Gn. Gebug',
            'address' => 'Gebug Utara, Gemuk Utara, Wonorejo, Kec. Lawang, Kabupaten Malang, Jawa Timur 65216',
            'latitude' => -7.807909730942596, 
            'longitude' => 112.65257202950647,
            'is_active' => false,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
        Transmission::create([
            'name' => 'Gn. Banon',
            'address' => 'Kasrepan, Demuk, Kec. Pucanglaban, Kabupaten Tulungagung, Jawa Timur 66284',
            'latitude' => -8.16799764678309,  
            'longitude' => 112.03047562367706,
            'is_active' => false,
            'is_power_out' => false,
            'description' => '',
            'transmission_type' => 'Digital',
        ]);
    }
}