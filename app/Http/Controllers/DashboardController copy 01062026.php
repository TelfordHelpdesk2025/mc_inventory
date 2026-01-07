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
            ->whereRaw("TRIM(LOWER(consigned)) = 'consigned'")
            ->count();

        $ownedMachines = DB::connection('server25')
            ->table('machine_list')
            ->whereRaw("TRIM(LOWER(consigned)) = 'owned'")
            ->count();

        // Machine Type Summary
        $machineTypeData = DB::connection('server25')
            ->table('machine_list')
            ->select('machine_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('machine_type')
            ->where('machine_type', '!=', '')
            ->groupBy('machine_type')
            ->pluck('count', 'machine_type');

        // Type per Platform (stacked bar)
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

        // Machines 16+ per OEM
        $oemRaw = DB::connection('server25')
            ->table('machine_list')
            ->select('oem', 'machine_type', DB::raw('COUNT(*) as count'))
            ->where('age', '>=', 16)
            ->whereNotNull('oem')
            ->where('oem', '!=', '')
            ->whereNotNull('machine_type')
            ->where('machine_type', '!=', '')
            ->groupBy('oem', 'machine_type')
            ->get();

        $machineOEM16Table = [];
        foreach ($oemRaw as $row) {
            $machineOEM16Table[$row->oem][$row->machine_type] = $row->count;
        }

        $grandTotalOEM16 = 0;
        foreach ($machineOEM16Table as $oem => $types) {
            $machineOEM16Table[$oem]['total'] = array_sum($types);
            $grandTotalOEM16 += $machineOEM16Table[$oem]['total'];
        }

        // Machines 16+ per Location
        $locRaw = DB::connection('server25')
            ->table('machine_list')
            ->select('location', 'machine_type', DB::raw('COUNT(*) as count'))
            ->where('age', '>=', 16)
            ->whereNotNull('location')
            ->where('location', '!=', '')
            ->whereNotNull('machine_type')
            ->where('machine_type', '!=', '')
            ->groupBy('location', 'machine_type')
            ->get();

        $machines16LocationTable = [];
        foreach ($locRaw as $row) {
            $machines16LocationTable[$row->location][$row->machine_type] = $row->count;
        }

        $grandTotalLocation16 = 0;
        foreach ($machines16LocationTable as $loc => $types) {
            $machines16LocationTable[$loc]['total'] = array_sum($types);
            $grandTotalLocation16 += $machines16LocationTable[$loc]['total'];
        }





        // 🔹 Dynamic Consigned Types
        $allConsignedTypes = DB::connection('server25')
            ->table('machine_list')
            ->select('consigned')
            ->distinct()
            ->pluck('consigned')
            ->map(fn($c) => addslashes(strtolower(trim($c))))
            ->toArray();

        $minAge = (int) $request->input('min_age', 0);
        $maxAge = (int) $request->input('max_age', 100);

        // 🔹 Dynamic Locations
        $allLocations = DB::connection('server25')
            ->table('machine_list')
            ->select('location')
            ->whereIn('location', ['AMS', 'P1', 'PL1', 'PL1-MEMS', 'PL1-PROD', 'PL1 - BRANDING', 'PL1 PROD-STANDARD EXTENSION', 'PL3', 'P4', 'PL6', 'ARCHIVE', 'RSPI', 'ANNEX - PL6 EXTENSION'])
            ->distinct()
            ->pluck('location')
            ->map(fn($v) => addslashes($v))
            ->toArray();


        //!@#$@#$&^*(&^$%#)
        $dynamicLocationColumns = array_map(
            fn($loc) => DB::raw("SUM(CASE WHEN location = '$loc' THEN 1 ELSE 0 END) AS `$loc`"),
            $allLocations
        );

        $selectColumns = array_merge(
            [
                'machine_type',
                'model',
                'machine_manufacturer',
                'age',
                DB::raw("YEAR(STR_TO_DATE(manufactured_date, '%m/%d/%Y')) as manufactured_year"),
                DB::raw("SUM(CASE WHEN TRIM(LOWER(consigned)) = 'owned' THEN 1 ELSE 0 END) AS owned"),
                DB::raw("SUM(CASE WHEN TRIM(LOWER(consigned)) = 'consigned' THEN 1 ELSE 0 END) AS consigned"),
            ],
            $dynamicLocationColumns
        );

        $machinesTable = DB::connection('server25')
            ->table('machine_list')
            ->select($selectColumns)
            ->whereNotNull('machine_manufacturer')
            ->whereNotIn(DB::raw("TRIM(UPPER(machine_manufacturer))"), ['N/A', ''])
            ->whereNotIn('machine_type', ['', '-', 'to be UPDATE', 'NON T&R', 'IONIZER'])
            ->whereNotIn('model', ['', '-', 'to be UPDATE'])
            ->whereNotNull('machine_type')
            ->whereNotNull('model')
            ->whereNotNull('age')
            ->whereNotIn('age', ['', '-'])
            ->whereBetween('age', [$minAge, $maxAge])
            ->groupBy('machine_type', 'model', 'machine_manufacturer', DB::raw("YEAR(STR_TO_DATE(manufactured_date, '%m/%d/%Y'))"), 'age')
            ->orderBy('machine_type')
            ->orderBy('model')
            ->get();






        return Inertia::render('Dashboard', [
            'totalMachines' => $totalMachines,
            'consignedMachines' => $consignedMachines,
            'ownedMachines' => $ownedMachines,
            'machineTypeData' => $machineTypeData,
            'machineTypePlatformData' => $machineTypePlatformData,
            'machineOEM16Table' => $machineOEM16Table,
            'grandTotalOEM16' => $grandTotalOEM16,
            'machines16LocationTable' => $machines16LocationTable,
            'grandTotalLocation16' => $grandTotalLocation16,

            "machinesTable" => $machinesTable,
            "allLocations" => $allLocations,
            "allConsignedTypes" => $allConsignedTypes,
            "minAge" => $minAge,
            "maxAge" => $maxAge,

            'emp_data' => session('emp_data') ?? [],
        ]);
    }
}
