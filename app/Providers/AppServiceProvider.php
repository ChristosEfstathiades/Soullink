<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use PokePHP\PokeApi;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(PokeApi::class, function ($app) {
            return new PokeApi();
        });
        $this->app->singleton(Query::class, function ($app) {
            return new Query();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
