<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $operatorRole = Role::firstOrCreate(['name' => 'operator']);

        // Buat user
        $user = User::create([
            'name' => 'Admin VeloTrack',
            'phone' => '6289514800903',
            'email' => 'admin@velotrack.com',
            'password' => Hash::make('password'),
        ]);

        // Assign role ke user
        $user->assignRole($adminRole);

        // Buat user operator
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => 'Operator VeloTrack ' . $i,
                'phone' => '6289514800903',
                'email' => 'operator' . $i . '@velotrack.com',
                'password' => Hash::make('password'),
            ]);
            // Assign role ke user
            $user->assignRole($operatorRole);
        }
    }
}