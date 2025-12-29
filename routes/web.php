<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\machineList\MachineListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

require __DIR__ . '/machine.php';

require __DIR__ . '/dthm.php';


Route::get('/maintenance', function () {
    return Inertia::render('Maintenance');
})->name('maintenance');




Route::fallback(function () {
    // For Inertia requests, just redirect back to the same URL
    return redirect()->to(request()->fullUrl());
})->name('404');
