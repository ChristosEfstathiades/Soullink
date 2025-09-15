<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tracker', function () {
        return Inertia::render('tracker');
    })->name('tracker');

    Route::resource('saves', SaveController::class)->only([
        'store', 'destroy', 'show'
    ]);
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
