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

        // Machine List ROUTES
        Route::get('/machines/list/index', [MachineListsController::class, 'index'])
            ->name('machine.list.index');

        Route::post('/machines/store', [MachineListController::class, 'store'])
            ->name('machine.store');

        Route::post('/machines/update/{id}', [MachineListController::class, 'update'])
            ->name('machine.update');

        Route::delete('/machines/{id}', [MachineListController::class, 'destroy'])
            ->name('machine.delete');
    });
