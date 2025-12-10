<?php

use App\Http\Controllers\machineList\HardDownController;
use App\Http\Controllers\machineList\MachineListController;
use App\Http\Controllers\machineList\MachineListsController;
use App\Http\Controllers\machineList\WriteOffController;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::get('/machines/list/index', [MachineListsController::class, 'index'])->name('machine.list.index');


Route::get('/machines/list', [MachineListController::class, 'index'])->name('machine.list');
Route::post('/machines/store', [MachineListController::class, 'store'])->name('machine.store');
Route::post('/machines/update/{id}', [MachineListController::class, 'update'])->name('machine.update');
Route::delete('/machines/{id}', [MachineListController::class, 'destroy'])->name('machine.delete');

Route::get("mc_inventory/harddown", [HardDownController::class, 'index'])->name('harddown.index');
Route::post('/harddown/store', [HardDownController::class, 'store'])->name('harddown.store');
Route::put('/harddown/update/{id}', [HardDownController::class, 'update'])->name('harddown.update');
Route::delete('/harddown/delete/{id}', [HardDownController::class, 'destroy'])->name('harddown.delete');

Route::get("mc_inventory/writeoff", [WriteOffController::class, 'index'])->name('writeoff.index');
Route::post('/writeoff/store', [WriteOffController::class, 'store'])->name('writeoff.store');
Route::put('/writeoff/update/{id}', [WriteOffController::class, 'update'])->name('writeoff.update');
Route::delete('/writeoff/delete/{id}', [WriteOffController::class, 'destroy'])->name('writeoff.delete');
