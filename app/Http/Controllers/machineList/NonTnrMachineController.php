<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NonTnrMachineController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {

        $existingMachine = DB::connection('server25')->table('machine_non_tnr_list')
            ->where('machine_num', '!=', 'N/A')
            ->pluck('machine_num')
            ->toArray();


        $existingPMNT = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('pmnt_no')
            ->whereNotIn('pmnt_no', ['', 'N/A'])
            ->pluck('pmnt_no')
            ->toArray();

        $existingSerial = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('serial')
            ->whereNotIn('serial', ['', 'N/A'])
            ->pluck('serial')
            ->toArray();

        $existingCnum = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('cn_no')
            ->whereNotIn('cn_no', ['', 'N/A'])
            ->pluck('cn_no')
            ->toArray();

        // dd($existingMachine);


        $result = $this->datatable->handle(
            $request,
            'server25',
            'machine_non_tnr_list',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('id', 'desc');
                },

                'searchColumns' => ['machine_num', 'machine_name', 'location', 'serial',  'pmnt_no',  'frequency', 'model', 'cn_no', 'manufacturer',  'remarks'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $machine_name = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('machine_name')
            ->whereNotIn(DB::raw('TRIM(LOWER(machine_name))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('machine_name')
            ->pluck('machine_name', 'machine_name');

        $location = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('location')
            ->whereNotIn(DB::raw('TRIM(LOWER(location))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('location')
            ->pluck('location', 'location');

        $frequency = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('frequency')
            ->whereNotIn('frequency', ['', 'N/A', ' - ', '- ', ' -', '-', 'GRAVITY ', 'TUBE '])
            ->distinct()
            ->orderBy('frequency')
            ->pluck('frequency', 'frequency');

        $model = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('model')
            ->whereNotIn('model', ['', 'N/A', ' - ', '- ', ' -', '-', 'to be UPDATE'])
            ->distinct()
            ->orderBy('model')
            ->pluck('model', 'model');

        $manufacturer = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('manufacturer')
            ->whereNotIn('manufacturer', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('manufacturer')
            ->pluck('manufacturer', 'manufacturer');

        $remarks = DB::connection('server25')->table('machine_non_tnr_list')
            ->whereNotNull('remarks')
            ->whereNotIn('remarks', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('remarks')
            ->pluck('remarks', 'remarks');

        return Inertia::render('machine/NonTnrMachine', [
            'tableData' => $result['data'],
            'existingMachine' => $existingMachine,
            'existingPMNT' => $existingPMNT,
            'existingSerial' => $existingSerial,
            'existingCnum' => $existingCnum,

            'machine_name' => $machine_name,
            'location' => $location,
            'frequency' => $frequency,
            'model' => $model,
            'manufacturer' => $manufacturer,
            'remarks' => $remarks,
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
        DB::connection('server25')->table('machine_non_tnr_list')->insert(array_merge(
            $request->all(),
            ['created_by' => session('emp_data')['emp_name'] ?? null]
        ));

        return redirect()->route('non.tnr.machine.index')->with('success', 'Machine added successfully.');
    }



    public function update(Request $request, $id)
    {
        // Validate form data
        $validated = $request->validate([
            'machine_num'   => 'required|string',
            'machine_name'  => 'required|string',
            'location'      => 'required|string',
            'serial'        => 'required|string',
            'pmnt_no'       => 'required|string',
            'frequency'     => 'required|string',
            'model'         => 'required|string',
            'cn_no'         => 'required|string',
            'manufacturer'  => 'required|string',
            'remarks'       => 'required|string',
        ]);

        // Add updated_by field
        $validated['updated_by'] = session('emp_data')['emp_name'] ?? null;

        // Update record in server25 DB
        DB::connection('server25')
            ->table('machine_non_tnr_list')
            ->where('id', $id)
            ->update($validated);

        return redirect()->back()->with('success', 'Machine updated successfully.');
    }

    public function destroy($id)
    {
        DB::connection('server25')->table('machine_non_tnr_list')->where('id', $id)->delete();

        return redirect()->route('non.tnr.machine.index')->with('success', 'Machine deleted successfully.');
    }
}
