<?php

namespace App\Http\Controllers\Dthm;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DthmListController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {
        $result = $this->datatable->handle(
            $request,
            'eeportal',
            'dthm_inventory_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->where('eqpmnt_description', '!=', '')
                        ->whereNotNull('eqpmnt_description')
                        ->OrderBy('date_enrolled', 'DESC');
                },

                'searchColumns' => ['date_enrolled', 'eqpmnt_description', 'eqpmnt_manufacturer', 'eqpmnt_model', 'eqpmnt_control_no', 'ip_address', 'location', 'status'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Dthm/DthmList', [
            'tableData' => $result['data'],
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        DB::connection('eeportal')->table('dthm_inventory_tbl')->insert(array_merge(
            $request->all(),
            ['created_by' => session('emp_data')['emp_name'] ?? null]
        ));

        return redirect()->route('dthm.index')->with('success', 'dthm added successfully.');
    }


    public function update(Request $request, $id)
    {
        // Validate form data
        $validated = $request->validate([
            'date_enrolled' => 'nullable|string',
            'eqpmnt_control_no' => 'nullable|string',
            'eqpmnt_description' => 'nullable|string',
            'eqpmnt_type' => 'nullable|string',
            'eqpmnt_manufacturer' => 'nullable|string',
            'eqpmnt_model' => 'nullable|string',
            'eqpmnt_cal_date' => 'nullable|string',
            'eqpmnt_cal_due' => 'nullable|string',
            "eqpmnt_serial_no" => 'nullable|string',
            "cal_interval" => 'nullable|string',
            "location" => 'nullable|string',
            "ip_address" => 'nullable|string',
            "status" => 'nullable|string',
            "remarks" => 'nullable|string',
            "cal_specs_no" => 'nullable|string',
            "instrument" => 'nullable|string',
            "instrument_description" => 'nullable|string',
            "instrument_model" => 'nullable|string',
            "instrument_serial_no" => 'nullable|string',
            "instrument_control_no" => 'nullable|string',
            "accuracy" => 'nullable|string',
            "instrument_cal_date" => 'nullable|string',
            "instrument__cal_due" => 'nullable|string',
            "tracebility" => 'nullable|string',
            "calibrated_by" => 'nullable|string',
            "reviewed_by" => 'nullable|string',
            "report_no" => 'nullable|string',
        ]);

        // ✅ I-set ang updated_by sa current user
        $validated['updated_by'] = session('emp_data')['emp_name'] ?? null;

        // Update record sa database base sa ID
        DB::connection('eeportal')
            ->table('dthm_inventory_tbl')
            ->where('id', $id)
            ->update($validated);

        return redirect()->back()->with('success', 'Machine updated successfully.');
    }

    public function destroy($id)
    {
        DB::connection('eeportal')->table('dthm_inventory_tbl')->where('id', $id)->delete();

        return redirect()->route('dthm.index')->with('success', 'DTHM deleted successfully.');
    }
}
