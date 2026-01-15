<?php

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

        // WRITE OFF ROUTES
        Route::get('/writeoff/index', [WriteOffController::class, 'index'])->name('writeoff.index');
        Route::post('/writeoff/store', [WriteOffController::class, 'store'])->name('writeoff.store');
        Route::put('/writeoff/update/{id}', [WriteOffController::class, 'update'])->name('writeoff.update');
        Route::put('/writeoff/delete/{id}', [WriteOffController::class, 'delete'])->name('writeoff.delete');
    });
