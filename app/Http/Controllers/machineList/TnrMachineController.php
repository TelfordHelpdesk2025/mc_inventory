<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TnrMachineController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {

        $existingMachine = DB::connection('server25')->table('machine_list')
            ->where('machine_num', '!=', 'N/A')
            ->pluck('machine_num')
            ->toArray();

        $existingPMNT = DB::connection('server25')->table('machine_list')
            ->whereNotNull('pmnt_no')
            ->whereNotIn('pmnt_no', ['', 'N/A'])
            ->pluck('pmnt_no')
            ->toArray();

        $existingSerial = DB::connection('server25')->table('machine_list')
            ->whereNotNull('serial')
            ->whereNotIn('serial', ['', 'N/A'])
            ->pluck('serial')
            ->toArray();

        $existingCnum = DB::connection('server25')->table('machine_list')
            ->whereNotNull('cn_no')
            ->whereNotIn('cn_no', ['', 'N/A'])
            ->pluck('cn_no')
            ->toArray();

        // dd($existingMachine);


        $result = $this->datatable->handle(
            $request,
            'server25',
            'machine_list',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('id', 'desc');
                },

                'searchColumns' => ['machine_num', 'model', 'machine_platform', 'machine_feed_type', 'machine_manufacturer',  'status', 'pmnt_no', 'location', 'ownership'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $model = DB::connection('server25')->table('machine_list')
            ->whereNotNull('model')
            ->whereNotIn('model', ['', 'N/A', ' - ', '- ', ' -', '-', 'to be UPDATE'])
            ->distinct()
            ->orderBy('model')
            ->pluck('model', 'model');

        $machine_platform = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_platform')
            ->whereNotIn('machine_platform', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('machine_platform')
            ->pluck('machine_platform', 'machine_platform');

        $machine_feed_type = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_feed_type')
            ->whereNotIn('machine_feed_type', ['', 'N/A', ' - ', '- ', ' -', '-', 'GRAVITY ', 'TUBE '])
            ->distinct()
            ->orderBy('machine_feed_type')
            ->pluck('machine_feed_type', 'machine_feed_type');

        $machine_manufacturer = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_manufacturer')
            ->whereNotIn('machine_manufacturer', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('machine_manufacturer')
            ->pluck('machine_manufacturer', 'machine_manufacturer');



        $status = DB::connection('server25')->table('machine_list')
            ->whereNotNull('status')
            ->whereNotIn('status', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('status')
            ->pluck('status', 'status');

        $location = DB::connection('server25')->table('machine_list')
            ->whereNotNull('location')
            ->whereNotIn(DB::raw('TRIM(LOWER(location))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('location')
            ->pluck('location', 'location');

        $oem = DB::connection('server25')->table('machine_list')
            ->whereNotNull('oem')
            ->whereNotIn(DB::raw('TRIM(LOWER(oem))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('oem')
            ->pluck('oem', 'oem');

        $ownership = DB::connection('server25')->table('machine_list')
            ->whereNotNull('ownership')
            ->whereNotIn(DB::raw('TRIM(LOWER(ownership))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('ownership')
            ->pluck('ownership', 'ownership');

        return Inertia::render('machine/TnrMachine', [
            'tableData' => $result['data'],
            'existingMachine' => $existingMachine,
            'existingPMNT' => $existingPMNT,
            'existingSerial' => $existingSerial,
            'existingCnum' => $existingCnum,

            'model' => $model,
            'machine_platform' => $machine_platform,
            'machine_feed_type' => $machine_feed_type,
            'machine_manufacturer' => $machine_manufacturer,
            'status' => $status,
            'location' => $location,
            'oem' => $oem,
            'ownership' => $ownership,
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
        DB::connection('server25')->table('machine_list')->insert(array_merge(
            $request->all(),
            ['created_by' => session('emp_data')['emp_name'] ?? null]
        ));

        return redirect()->route('tnr.machine.index')->with('success', 'Machine added successfully.');
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

        $validated['updated_by'] = session('emp_data')['emp_name'] ?? null;

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

        return redirect()->route('tnr.machine.index')->with('success', 'Machine deleted successfully.');
    }
}
