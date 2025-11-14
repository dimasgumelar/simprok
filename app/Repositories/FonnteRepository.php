<?php
namespace App\Repositories;

use Illuminate\Support\Facades\Http;

class FonnteRepository
{
    public function send($number, $message = "", $schedule = 0, $countryCode = 62)
    {
        $response = Http::withHeaders([
            'Authorization' => config('services.fonnte.api_key'),
        ])->asForm()->post(config('services.fonnte.url'), [
            'target'      => $number,
            'message'     => $message,
            'schedule'    => $schedule,
            'countryCode' => $countryCode,
        ]);

        // if ($response->successful()) {
        //     dd($response->json());
        // } else {
        //     dd($response->status(), $response->body());
        // }

        return $response;
    }
}