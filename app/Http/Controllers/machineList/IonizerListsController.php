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

        // dd($existingMachine);


        $result = $this->datatable->handle(
            $request,
            'server25',
            'machine_list',
            [
                'conditions' => function ($query) {
                    return $query
                        ->whereIn('machine_type', ['IONIZER', 'Air Ionizer'])
                        ->orderBy('pmnt_no', 'asc');
                },

                'searchColumns' => ['machine_num', 'machine_feed_type', 'machine_manufacturer', 'machine_platform', 'pmnt_no', 'machine_type', 'model', 'location', 'status', 'consigned'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('machine/ionizerLists', [
            'tableData' => $result['data'],
            'existingMachine' => $existingMachine,
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
