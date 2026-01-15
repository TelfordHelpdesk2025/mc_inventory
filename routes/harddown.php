<?php

use App\Http\Controllers\Dthm\DthmListController;
use App\Http\Controllers\machineList\{
  HardDownController,
  MachineListController,
  MachineListsController,
  WriteOffController
};
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');


Route::prefix($app_name)
  ->middleware(AuthMiddleware::class)
  ->group(function () {
    // HARD DOWN ROUTES

    Route::get('/harddown/index', [HardDownController::class, 'index'])
      ->name('harddown.index');

    Route::post('/mc_inventory/harddown', [HardDownController::class, 'store'])
      ->name('harddown.store');

    Route::post('/mc_inventory/harddown/{id}', [HardDownController::class, 'update'])
      ->name('harddown.update');

    Route::put('/mc_inventory/harddown/{id}', [HardDownController::class, 'delete'])
      ->name('harddown.delete');

    Route::post('/harddown/handled', [HardDownController::class, 'handle'])
      ->name('harddown.handle');


    Route::get('/harddown/{id}/history', [HardDownController::class, 'history'])
      ->name('harddown.history');
  });
