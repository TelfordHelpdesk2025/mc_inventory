<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IonizerListsController extends Controller
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
                        ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
                        ->whereNotIn('machine_type', ['N/A'])
                        ->orderBy('pmnt_no', 'asc');
                },

                'searchColumns' => ['pmnt_no', 'machine_type', 'model', 'location', 'serial', 'status', 'consigned'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $status = DB::connection('server25')->table('machine_list')
            ->whereNotNull('status')
            ->whereNotIn('status', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('status')
            ->pluck('status', 'status');

        $model = DB::connection('server25')->table('machine_list')
            ->whereNotNull('model')
            ->whereNotIn('model', ['', 'N/A', ' - ', '- ', ' -', '-', 'to be UPDATE'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('model')
            ->pluck('model', 'model');

        $machine_type = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_type')
            ->whereNotIn('machine_type', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('machine_type')
            ->pluck('machine_type', 'machine_type');

        $oem = DB::connection('server25')->table('machine_list')
            ->whereNotNull('oem')
            ->whereNotIn(DB::raw('TRIM(LOWER(oem))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('oem')
            ->pluck('oem', 'oem');

        $company_rec_id = DB::connection('server25')->table('machine_list')
            ->whereNotNull('company_rec_id')
            ->whereNotIn(DB::raw('TRIM(LOWER(company_rec_id))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('company_rec_id')
            ->pluck('company_rec_id', 'company_rec_id');

        $customer_rec_id = DB::connection('server25')->table('machine_list')
            ->whereNotNull('customer_rec_id')
            ->whereNotIn(DB::raw('TRIM(LOWER(customer_rec_id))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('customer_rec_id')
            ->pluck('customer_rec_id', 'customer_rec_id');

        $orig_loc = DB::connection('server25')->table('machine_list')
            ->whereNotNull('orig_loc')
            ->whereNotIn(DB::raw('TRIM(LOWER(orig_loc))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('orig_loc')
            ->pluck('orig_loc', 'orig_loc');

        $site_loc = DB::connection('server25')->table('machine_list')
            ->whereNotNull('site_loc')
            ->whereNotIn(DB::raw('TRIM(LOWER(site_loc))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('site_loc')
            ->pluck('site_loc', 'site_loc');

        $location = DB::connection('server25')->table('machine_list')
            ->whereNotNull('location')
            ->whereNotIn(DB::raw('TRIM(LOWER(location))'), ['', 'n/a', '-', 'to be update'])
            ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
            ->distinct()
            ->orderBy('location')
            ->pluck('location', 'location');

        $pm = DB::connection('mysql')->table('admin')
            ->where('emp_role', 'pmtech')
            ->whereNotNull('emp_name')
            ->whereNotIn(DB::raw('TRIM(LOWER(emp_name))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('emp_name')
            ->pluck('emp_name', 'emp_name');

        return Inertia::render('machine/ionizerLists', [
            'tableData' => $result['data'],
            'existingMachine' => $existingMachine,
            'existingPMNT' => $existingPMNT,
            'existingSerial' => $existingSerial,
            'existingCnum' => $existingCnum,

            'status' => $status,
            'model' => $model,
            'machine_type' => $machine_type,
            'oem' => $oem,
            'company_rec_id' => $company_rec_id,
            'customer_rec_id' => $customer_rec_id,
            'orig_loc' => $orig_loc,
            'site_loc' => $site_loc,
            'location' => $location,
            'pm' => $pm,
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
}
