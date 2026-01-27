<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

$app_name = env('APP_NAME', '');

Route::prefix($app_name)->group(function () {
  Route::post("/setSession", [AuthenticationController::class, 'setSession'])->name('setSession');

  // Custom login page
  Route::get('/login', function (Request $request) {
    return Inertia::render('Auth/Login', [
      'redirect' => $request->query('redirect', route('dashboard')),
      'autoLogin' => $request->query('auto_login'),
      'username' => $request->query('username'),
    ]);
  })->middleware('guest')->name('login');


  // Login POST
  Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');

  // Logout
  Route::post('/logout', [AuthenticationController::class, 'logout'])->name('logout');


  Route::get("/unauthorized", function () {
    return Inertia::render('Unauthorized');
  })->name(name: 'unauthorized');
});
