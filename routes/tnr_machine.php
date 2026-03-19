<?php

use App\Http\Controllers\machineList\{
    IonizerListsController,
    TnrMachineController,
};
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');


Route::prefix($app_name)
    ->middleware(AuthMiddleware::class)
    ->group(function () {

        // Machine List ROUTES
        Route::get('/tnr/machines/index', [TnrMachineController::class, 'index'])
            ->name('tnr.machine.index');

        Route::post('/tnr/machines/store', [TnrMachineController::class, 'store'])
            ->name('tnr.machine.store');

        Route::post('/tnr/machines/update/{id}', [TnrMachineController::class, 'update'])
            ->name('tnr.machine.update');

        Route::delete('/tnr/machines/{id}', [TnrMachineController::class, 'destroy'])
            ->name('tnr.machine.delete');
    });

Route::get('/ionizer/list/index', [IonizerListsController::class, 'index'])
    ->name('ionizer.list.index');
