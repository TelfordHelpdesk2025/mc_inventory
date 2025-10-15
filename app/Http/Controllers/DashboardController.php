<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalMachines = DB::connection('server25')->table('machine_list')->count();

        $consignedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereRaw("TRIM(LOWER(consigned)) = 'consigned'")
            ->count();

        $ownedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereRaw("TRIM(LOWER(consigned)) = 'owned'")
            ->count();

        // 🔹 Group by Machine Type
        $machineTypeData = DB::connection('server25')
            ->table('machine_list')
            ->select('machine_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('machine_type')
            ->where('machine_type', '!=', '')
            ->groupBy('machine_type')
            ->pluck('count', 'machine_type');

        // 🔹 Group by Machine Platform
        $machinePlatformData = DB::connection('server25')
            ->table('machine_list')
            ->select('machine_platform', DB::raw('COUNT(*) as count'))
            ->whereNotNull('machine_platform')
            ->whereNotNull('machine_num')
            ->where('machine_num', '!=', '')
            ->where('machine_platform', '!=', '')
            ->where('machine_platform', '!=', 'N/A')
            ->groupBy('machine_platform')
            ->pluck('count', 'machine_platform');

        // 🔹 Machine Type per Platform (stacked bar)
        $machineTypePlatformRaw = DB::connection('server25')
            ->table('machine_list')
            ->select('machine_platform', 'machine_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('machine_platform')
            ->whereNotNull('machine_type')
            ->where('machine_type', '!=', '')
            ->whereNotNull('machine_num')
            ->where('machine_num', '!=', '')
            ->groupBy('machine_platform', 'machine_type')
            ->get();

        $machineTypePlatformData = [];
        foreach ($machineTypePlatformRaw as $row) {
            $platform = $row->machine_platform;
            $type = $row->machine_type;
            $machineTypePlatformData[$platform][$type] = $row->count;
        }

        return Inertia::render('Dashboard', [
            'totalMachines' => $totalMachines,
            'consignedMachines' => $consignedMachines,
            'ownedMachines' => $ownedMachines,
            'machineTypeData' => $machineTypeData,
            'machinePlatformData' => $machinePlatformData,
            'machineTypePlatformData' => $machineTypePlatformData,
            'emp_data' => session('emp_data') ?? [],
        ]);
    }
}
