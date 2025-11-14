<?php
namespace App\Services;

class ExportService
{
    public function export($fileName = "data.csv", $callback)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        return response()->stream($callback, 200, $headers);
    }
}