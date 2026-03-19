<?php

use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\machineList\{
    NonTnrMachineController,
};

$app_name = env('APP_NAME', '');


Route::prefix($app_name)
    ->middleware(AuthMiddleware::class)
    ->group(function () {

        // Machine List ROUTES
        Route::get('/non_tnr/machines/list/index', [NonTnrMachineController::class, 'index'])
            ->name('non.tnr.machine.index');

        Route::post('/non_tnr/machines/store', [NonTnrMachineController::class, 'store'])
            ->name('non.tnr.machine.store');

        Route::put('/non_tnr/machines/update/{id}', [NonTnrMachineController::class, 'update'])
            ->name('non.tnr.machine.update');

        Route::delete('/non_tnr/machines/{id}', [NonTnrMachineController::class, 'destroy'])
            ->name('non.tnr.machine.delete');
    });
