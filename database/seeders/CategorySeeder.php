<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Uncategorized', 'description' => ''],
            ['name' => 'Monitor', 'description' => 'Transmission monitor for video display'],
            ['name' => 'Audio', 'description' => 'Transmission monitor for audio signals'],
            ['name' => 'Data', 'description' => 'Transmission monitor for data signals'],
            ['name' => 'Power', 'description' => 'Transmission monitor for power systems'],
            ['name' => 'Environmental', 'description' => 'Transmission monitor for environmental conditions'],
            ['name' => 'Security', 'description' => 'Transmission monitor for security systems'],
            ['name' => 'Communication', 'description' => 'Transmission monitor for communication networks'],
            ['name' => 'Emergency', 'description' => 'Transmission monitor for emergency systems'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}