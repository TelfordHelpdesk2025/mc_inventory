<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MachineListsController extends Controller
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
                        // ->where('machine_num', '!=', 'NULL')
                        // ->where('machine_num', '!=', '')
                        ->whereNotIn('machine_type', ['IONIZER', 'Air Ionizer', 'N/A'])
                        ->orderBy('date_created', 'desc');
                },

                'searchColumns' => ['machine_num', 'machine_feed_type', 'machine_manufacturer', 'machine_platform', 'pmnt_no', 'machine_type', 'model', 'location', 'status', 'consigned'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

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

        $machine_platform = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_platform')
            ->whereNotIn('machine_platform', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('machine_platform')
            ->pluck('machine_platform', 'machine_platform');

        $machine_description = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_description')
            ->whereNotIn('machine_description', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('machine_description')
            ->pluck('machine_description', 'machine_description');

        $status = DB::connection('server25')->table('machine_list')
            ->whereNotNull('status')
            ->whereNotIn('status', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('status')
            ->pluck('status', 'status');

        $model = DB::connection('server25')->table('machine_list')
            ->whereNotNull('model')
            ->whereNotIn('model', ['', 'N/A', ' - ', '- ', ' -', '-', 'to be UPDATE'])
            ->distinct()
            ->orderBy('model')
            ->pluck('model', 'model');

        $machine_type = DB::connection('server25')->table('machine_list')
            ->whereNotNull('machine_type')
            ->whereNotIn('machine_type', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('machine_type')
            ->pluck('machine_type', 'machine_type');

        $platform = DB::connection('server25')->table('machine_list')
            ->whereNotNull('platform')
            ->whereNotIn('platform', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('platform')
            ->pluck('platform', 'platform');

        $category = DB::connection('server25')->table('machine_list')
            ->whereNotNull('category')
            ->whereNotIn('category', ['', 'N/A', ' - ', '- ', ' -', '-'])
            ->distinct()
            ->orderBy('category')
            ->pluck('category', 'category');

        $condition = DB::connection('server25')->table('machine_list')
            ->whereNotNull('condition')
            ->whereNotIn('condition', ['', 'N/A', ' - ', '- ', ' -', '-', 'to be UPDATE'])
            ->distinct()
            ->orderBy('condition')
            ->pluck('condition', 'condition');

        $level = DB::connection('server25')->table('machine_list')
            ->whereNotNull('level')
            ->whereNotIn(DB::raw('TRIM(LOWER(level))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('level')
            ->pluck('level', 'level');

        $oem = DB::connection('server25')->table('machine_list')
            ->whereNotNull('oem')
            ->whereNotIn(DB::raw('TRIM(LOWER(oem))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('oem')
            ->pluck('oem', 'oem');

        $company_rec_id = DB::connection('server25')->table('machine_list')
            ->whereNotNull('company_rec_id')
            ->whereNotIn(DB::raw('TRIM(LOWER(company_rec_id))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('company_rec_id')
            ->pluck('company_rec_id', 'company_rec_id');

        $customer_rec_id = DB::connection('server25')->table('machine_list')
            ->whereNotNull('customer_rec_id')
            ->whereNotIn(DB::raw('TRIM(LOWER(customer_rec_id))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('customer_rec_id')
            ->pluck('customer_rec_id', 'customer_rec_id');

        $orig_loc = DB::connection('server25')->table('machine_list')
            ->whereNotNull('orig_loc')
            ->whereNotIn(DB::raw('TRIM(LOWER(orig_loc))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('orig_loc')
            ->pluck('orig_loc', 'orig_loc');

        $site_loc = DB::connection('server25')->table('machine_list')
            ->whereNotNull('site_loc')
            ->whereNotIn(DB::raw('TRIM(LOWER(site_loc))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('site_loc')
            ->pluck('site_loc', 'site_loc');

        $location = DB::connection('server25')->table('machine_list')
            ->whereNotNull('location')
            ->whereNotIn(DB::raw('TRIM(LOWER(location))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('location')
            ->pluck('location', 'location');

        $consigned = DB::connection('server25')->table('machine_list')
            ->whereNotNull('consigned')
            ->whereNotIn(DB::raw('TRIM(LOWER(consigned))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('consigned')
            ->pluck('consigned', 'consigned');

        $pm = DB::connection('mysql')->table('admin')
            ->where('emp_role', 'pmtech')
            ->whereNotNull('emp_name')
            ->whereNotIn(DB::raw('TRIM(LOWER(emp_name))'), ['', 'n/a', '-', 'to be update'])
            ->distinct()
            ->orderBy('emp_name')
            ->pluck('emp_name', 'emp_name');

        return Inertia::render('machine/machineLists', [
            'tableData' => $result['data'],
            'existingMachine' => $existingMachine,
            'existingPMNT' => $existingPMNT,
            'existingSerial' => $existingSerial,
            'existingCnum' => $existingCnum,

            'machine_feed_type' => $machine_feed_type,
            'machine_manufacturer' => $machine_manufacturer,
            'machine_platform' => $machine_platform,
            'machine_description' => $machine_description,
            'status' => $status,
            'model' => $model,
            'machine_type' => $machine_type,
            'platform' => $platform,
            'category' => $category,
            'condition' => $condition,
            'level' => $level,
            'oem' => $oem,
            'company_rec_id' => $company_rec_id,
            'customer_rec_id' => $customer_rec_id,
            'orig_loc' => $orig_loc,
            'site_loc' => $site_loc,
            'location' => $location,
            'consigned' => $consigned,
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
