<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SaveController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return to_route('saves.index');
    })->name('dashboard');

    Route::resource('saves', SaveController::class)->only([
        'store', 'destroy', 'show', 'index'
    ]);

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
