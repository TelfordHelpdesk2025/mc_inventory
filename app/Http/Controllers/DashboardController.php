<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $empData = session('emp_data');
        // dd($empData);
        $totalMachines = DB::connection('server25')->table('machine_list')->count();

        $consignedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereRaw("TRIM(LOWER(ownership)) = 'consigned'")
            ->count();

        $ownedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereRaw("TRIM(LOWER(ownership)) = 'TSPI-OWNED'")
            ->count();

        return Inertia::render('Dashboard', [
            'totalMachines' => $totalMachines,
            'consignedMachines' => $consignedMachines,
            'ownedMachines' => $ownedMachines,
            'emp_data' => session('emp_data') ?? [],
        ]);
    }
}
