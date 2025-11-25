<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WriteOffController extends Controller
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
            'write_off_tbl',
            [
                // 'conditions' => function ($query) {
                //     return $query
                //         ->whereIn('emp_role', ['admin', 'engineer']);
                // },

                'searchColumns' => ['qty', 'serial_no', 'description', 'date_purchase'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $machine = DB::connection('server25')->table('machine_list')
            ->where('machine_num', '!=', '')
            ->whereNotNull('machine_num')
            ->get();

        // dd($machine);

        return Inertia::render('machine/WriteOff', [
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
        $request->validate([
            'machine_num' => 'required|string|max:255',
            'platform'    => 'required|string|max:255',
            'model'       => 'required|string|max:255',
            'location'    => 'required|string|max:255',
            'package'     => 'required|string|max:255',
            'process'     => 'required|string|max:255',
            'status'      => 'required|string|max:255',
        ]);

        DB::connection('eeportal')->table('write_off_tbl')->insert([
            'machine_num' => $request->machine_num,
            'platform'    => $request->platform, // FIXED
            'model'       => $request->model,
            'location'    => $request->location,
            'package'     => $request->package,
            'process'     => $request->process,
            'status'      => $request->status,
            'created_by'      => session('emp_data')['emp_name'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Hard Down Machine added successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'machine_num' => 'required',
            'platform' => 'required',
            'model' => 'required',
            'location' => 'required',
            'package' => 'required',
            'process' => 'required',
            'status' => 'required',
        ]);

        DB::connection('eeportal')->table('write_off_tbl')
            ->where('id', $id)
            ->update([
                'machine_num' => $request->machine_num,
                'platform' => $request->platform,
                'model' => $request->model,
                'location' => $request->location,
                'package' => $request->package,
                'process' => $request->process,
                'status' => $request->status,
                'updated_by'      => session('emp_data')['emp_name'] ?? null,
            ]);

        return back()->with('success', 'Machine updated successfully.');
    }

    public function destroy($id)
    {
        DB::connection('eeportal')->table('write_off_tbl')->where('id', $id)->delete();

        return back()->with('success', 'Machine deleted successfully.');
    }
}
