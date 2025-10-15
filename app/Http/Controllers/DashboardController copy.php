<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereNotNull('machine_num')
            ->where('machine_num', '!=', '')
            ->count();

        $consignedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereNotNull('consigned')
            ->where('consigned', '!=', '')
            ->whereRaw("TRIM(LOWER(consigned)) = 'consigned'")
            ->count();


        $ownedMachines = $totalMachines - $consignedMachines;

        return Inertia::render('Dashboard', [
            'totalMachines' => $totalMachines,        // ✅ match name
            'consignedMachines' => $consignedMachines, // ✅ match name
            'ownedMachines' => $ownedMachines,        // ✅ match name
            'emp_data' => session('emp_data') ?? [],
        ]);
    }
}
