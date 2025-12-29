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
    Route::get('/dthm/index', [DthmListController::class, 'index'])
      ->name('dthm.index');

    Route::post('/dthm/store', [DthmListController::class, 'store'])
      ->name('dthm.store');

    Route::post('/dthm/update/{id}', [DthmListController::class, 'update'])
      ->name('dthm.update');

    Route::delete('/dthm/{id}', [DthmListController::class, 'destroy'])
      ->name('dthm.delete');
  });
