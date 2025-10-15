<?php

use App\Http\Controllers\machineList\MachineListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';



Route::get('/machines', [MachineListController::class, 'index'])->name('machine.list');
Route::post('/machines/store', [MachineListController::class, 'store'])->name('machine.store');
Route::post('/machines/update/{id}', [MachineListController::class, 'update'])->name('machine.update');
Route::delete('/machines/{id}', [MachineListController::class, 'destroy'])->name('machine.delete');





Route::fallback(function () {
    return Inertia::render('404');
})->name('404');
