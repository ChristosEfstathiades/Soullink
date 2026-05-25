<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // On Windows/XAMPP, PHP's cURL has no CA bundle by default and SSL
        // verification fails for external HTTPS requests. Set CURL_VERIFY_SSL=false
        // in your local .env as a stopgap, and fix the root cause by configuring
        // curl.cainfo in php.ini (see README or docs).
        Http::globalOptions([
            'verify' => env('CURL_VERIFY_SSL', true),
        ]);
    }
}
