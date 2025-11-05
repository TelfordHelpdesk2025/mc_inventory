<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MachineListController extends Controller
{
    public function index(Request $request)
    {
        // Default sort kung walang laman request
        if (!$request->has('sortBy')) {
            $request->merge(['sortBy' => 'id']);
        }
        if (!$request->has('sortDirection')) {
            $request->merge(['sortDirection' => 'desc']);
        }

        // ✅ Kunin perPage galing request o default 10
        $perPage = $request->input('perPage', 10);

        // ✅ Gumamit ng remote connection: server25
        $query = DB::connection('server25')->table('machine_list')
            ->select('*')
            ->where('machine_num', '!=', 'NULL')
            ->where('machine_num', '!=', '')
            ->orderBy('machine_platform', 'asc');


        // 🔍 Optional search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('machine_num', 'like', "%{$search}%")
                    ->orWhere('serial', 'like', "%{$search}%")
                    ->orWhere('machine_feed_type', 'like', "%{$search}%")
                    ->orWhere('machine_manufacturer', 'like', "%{$search}%")
                    ->orWhere('machine_platform', 'like', "%{$search}%")
                    ->orWhere('pmnt_no', 'like', "%{$search}%")
                    ->orWhere('machine_type', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('consigned', 'like', "%{$search}%");
            });
        }

        // 🔽 Sorting
        $sortBy = $request->input('sortBy', 'machine_num');
        $sortDirection = $request->input('sortDirection', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        // 📄 Pagination (dynamic per page)
        $machines = $query->paginate($perPage)->appends($request->all());

        // 🔧 Filters para sa frontend
        $tableFilters = [
            'search' => $search,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
            'perPage' => $perPage,
        ];

        // 🧭 Ibalik sa React page
        return Inertia::render('machine/machineList', [
            'tableData' => $machines,
            'tableFilters' => $tableFilters,
            'empData' => [
                'emp_id' => session('emp_data')['emp_id'] ?? null,
                'emp_name' => session('emp_data')['emp_name'] ?? null,
            ]
        ]);
    }


    public function store(Request $request)
    {
        DB::connection('server25')->table('machine_list')->insert(array_merge(
            $request->all(),
            ['created_by' => session('emp_data')['emp_name'] ?? null]
        ));

        return redirect()->route('machine.list')->with('success', 'Machine added successfully.');
    }



    public function update(Request $request, $id)
    {
        // Validate form data
        $validated = $request->validate([
            'machine_num' => 'nullable|string',
            'machine_feed_type' => 'nullable|string',
            'machine_manufacturer' => 'nullable|string',
            'machine_platform' => 'nullable|string',
            'machine_description' => 'nullable|string',
            'company_rec_id' => 'nullable|string',
            'customer_rec_id' => 'nullable|string',
            'status' => 'nullable|string',
            "pmnt_no" => 'nullable|string',
            "cn_no" => 'nullable|string',
            "orig_loc" => 'nullable|string',
            "site_loc" => 'nullable|string',
            "location" => 'nullable|string',
            "oem" => 'nullable|string',
            "model" => 'nullable|string',
            "serial" => 'nullable|string',
            "machine_type" => 'nullable|string',
            "pm_personnel" => 'nullable|string',
            "platform" => 'nullable|string',
            "category" => 'nullable|string',
            "level" => 'nullable|string',
            "dimension" => 'nullable|string',
            "operating_supply" => 'nullable|string',
            "phase" => 'nullable|string',
            "hz" => 'nullable|string',
            "amp" => 'nullable|string',
            "power_consumption" => 'nullable|string',
            "weight" => 'nullable|string',
            "spph" => 'nullable|string',
            "cap_shift" => 'nullable|string',
            "cap_delay" => 'nullable|string',
            "cap_mo" => 'nullable|string',
            "manufactured_date" => 'nullable|string',
            "age" => 'nullable|string',
            "condition" => 'nullable|string',
            "acquired_from" => 'nullable|string',
            "acquisition_type" => 'nullable|string',
            "acquired_date" => 'nullable|string',
            "unit_price" => 'nullable|string',
            "acquired_amount" => 'nullable|string',
            "useful_life" => 'nullable|string',
            "monthly_depreciation" => 'nullable|string',
            "last_date_depreciation" => 'nullable|string',
            "netbook_value" => 'nullable|string',
            "purpose_acquisition" => 'nullable|string',
            "specify_machine_replaced" => 'nullable|string',
            "date_transfer" => 'nullable|string',
            "consigned" => 'nullable|string',
            // 👉 optional: dagdagan mo lahat ng fields mo dito kung gusto mong strict validation
        ]);

        // Update record sa server25 DB
        DB::connection('server25')
            ->table('machine_list')
            ->where('id', $id)
            ->update($validated);

        return redirect()->back()->with('success', 'Machine updated successfully.');
    }

    public function destroy($id)
    {
        DB::connection('server25')->table('machine_list')->where('id', $id)->delete();

        return redirect()->route('machine.list')->with('success', 'Machine deleted successfully.');
    }
}
