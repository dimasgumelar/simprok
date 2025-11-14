<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $maintenances = [
            ['inventory_id' => 1, 'transmission_id' => 1, 'user_id' => 1, 'status' => 0, 'description' => 'Initial maintenance check', 'inprogress_at' => null, 'completed_at' => null, 'scheduled_at' => now()->addDays(1), 'feedback' => "Sudah Pak", "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 2, 'transmission_id' => 2, 'user_id' => 2, 'status' => 1, 'description' => 'Routine maintenance in progress', 'inprogress_at' => now(), 'completed_at' => null, 'scheduled_at' => now()->addDays(2), 'feedback' => "", "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 3, 'transmission_id' => 2, 'user_id' => 3, 'status' => 2, 'description' => 'Maintenance completed successfully', 'inprogress_at' => now()->subDays(2), 'completed_at' => now()->subDays(1), 'scheduled_at' => now()->subDays(3), 'feedback' => "", "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 5, 'transmission_id' => 3, 'user_id' => 4, 'status' => 0, 'description' => 'Scheduled maintenance pending', 'inprogress_at' => null, 'completed_at' => null, 'scheduled_at' => now()->addDays(4), 'feedback' => "", "schedule_response" => "json", "created_by" => 1],
        ];

        foreach ($maintenances as $maintenance) {
            Maintenance::create($maintenance);
        }
    }
}