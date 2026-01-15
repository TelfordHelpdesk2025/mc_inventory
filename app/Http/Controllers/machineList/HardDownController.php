<?php

namespace App\Http\Controllers\machineList;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HardDownController extends Controller
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
            'harddown_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('status', 'desc');
                },

                'searchColumns' => ['machine_num', 'model', 'location', 'status', 'package', 'process'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        $machines = DB::connection('server25')->table('machine_list')
            ->where('machine_num', '!=', '')
            ->where('machine_num', '!=', 'N/A')
            ->whereNotNull('machine_num')
            ->where('status', 'Active')
            ->orderBy('machine_platform', 'asc')
            ->get();

        // dd($machine);

        return Inertia::render('machine/HardDown', [
            'tableData' => $result['data'],
            'machines' => $machines,
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
            'pmnt_no'    => 'nullable|string|max:255',
            'package'     => 'required|string|max:255',
            'process'     => 'required|string|max:255',
            'status'      => 'required|string|max:255',
            'machine_problem' => 'required|string|max:255',
        ]);

        DB::connection('eeportal')->table('harddown_tbl')->insert([
            'machine_num' => $request->machine_num,
            'platform'    => $request->platform, // FIXED
            'model'       => $request->model,
            'location'    => $request->location,
            'pmnt_no'    => $request->pmnt_no,
            'package'     => $request->package,
            'process'     => $request->process,
            'status'      => $request->status,
            'machine_problem' => $request->machine_problem,
            'created_by'      => session('emp_data')['emp_name'] ?? null,
        ]);

        DB::connection('server25')->table('machine_list')
            ->where('machine_num', $request->machine_num)
            ->where('platform', $request->platform)
            ->where('model', $request->model)
            ->where('location', $request->location)
            ->where('pmnt_no', $request->pmnt_no)
            ->update([
                'status'      => $request->status,
                'updated_by'      => session('emp_data')['emp_name'] ?? null,
            ]);

        DB::connection('eeportal')->table('harddown_history')->insert([
            'harddown_id' => DB::connection('eeportal')->table('harddown_tbl')->latest('id')->first()->id,
            'machine_num' => $request->machine_num,
            'machine_platform'    => $request->platform,
            'pmnt_no'    => $request->pmnt_no,
            'machine_problem'    => $request->machine_problem,
            'status'      => $request->status,
            'handled_by'      => session('emp_data')['emp_name'] ?? null,
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
            'pmnt_no' => 'required',
            'package' => 'required',
            'process' => 'required',
            'status' => 'required',
        ]);

        DB::connection('eeportal')->table('harddown_tbl')
            ->where('id', $id)
            ->update([
                'machine_num' => $request->machine_num,
                'platform' => $request->platform,
                'model' => $request->model,
                'location' => $request->location,
                'pmnt_no' => $request->pmnt_no,
                'package' => $request->package,
                'process' => $request->process,
                'status' => $request->status,
                'updated_by'      => session('emp_data')['emp_name'] ?? null,
            ]);

        return back()->with('success', 'Machine updated successfully.');
    }

    public function destroy($id)
    {
        DB::connection('eeportal')->table('harddown_tbl')->where('id', $id)->delete();

        return back()->with('success', 'Machine deleted successfully.');
    }

    public function handle(Request $request)
    {
        $request->validate([
            'harddown_id' => 'required|integer|max:255',
            'machine_num' => 'required|string|max:255',
            'machine_platform' => 'required|string|max:255',
            'pmnt_no' => 'required|string|max:255',
            'machine_problem' => 'required|string',
            'identified_error' => 'required|string',
            'solution_remarks' => 'required|string',
            'status' => 'required|string|max:255',
            'attachment' => 'nullable|image|max:2048', // max 2MB
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        DB::connection('eeportal')->table('harddown_history')->insert([
            'harddown_id' => $request->harddown_id,
            'machine_num' => $request->machine_num,
            'machine_platform' => $request->machine_platform,
            'pmnt_no' => $request->pmnt_no,
            'machine_problem' => $request->machine_problem,
            'identified_error' => $request->identified_error,
            'solution_remarks' => $request->solution_remarks,
            'status' => $request->status,
            'attachment' => $attachmentPath, // store path in DB
            'handled_by' => session('emp_data')['emp_name'] ?? null,
        ]);

        DB::connection('server25')->table('machine_list')
            ->where('machine_num', $request->machine_num)
            ->where('platform', $request->machine_platform)
            ->where('pmnt_no', $request->pmnt_no)
            ->update([
                'status'      => $request->status,
                'updated_by'      => session('emp_data')['emp_name'] ?? null,
            ]);

        DB::connection('eeportal')->table('harddown_tbl')
            ->where('id', $request->harddown_id)
            ->where('machine_num', $request->machine_num)
            ->where('platform', $request->machine_platform)
            ->where('pmnt_no', $request->pmnt_no)
            ->update([

                'status'      => $request->status,
                'updated_by'      => session('emp_data')['emp_name'] ?? null,
            ]);

        return redirect()->back()->with('success', 'Hard Down Machine added successfully.');
    }


    public function history($id)
    {
        try {
            // Fetch history first
            $history = DB::connection('eeportal')
                ->table('harddown_history')
                ->where('harddown_id', $id)
                ->orderBy('date_created', 'desc')
                ->get();

            // Add attachment_url if attachment exists
            $history = $history->map(function ($item) {
                if ($item->attachment) {
                    $item->attachment_url = asset('storage/' . $item->attachment);
                } else {
                    $item->attachment_url = null;
                }
                return $item;
            });

            return response()->json($history);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function delete(Request $request, $id)
    {
        $harddown = DB::connection('eeportal')
            ->table('harddown_tbl')
            ->where('id', $id)
            ->first();

        if (!$harddown) {
            return back()->with('error', 'Hard Down not found.');
        }

        $histories = DB::connection('eeportal')
            ->table('harddown_history')
            ->where('harddown_id', $id)
            ->get();

        foreach ($histories as $history) {
            if (!empty($history->attachment)) {

                // ✅ USE EXACT PATH FROM DB
                if (Storage::disk('public')->exists($history->attachment)) {
                    Storage::disk('public')->delete($history->attachment);
                }
            }
        }

        DB::connection('server25')->table('machine_list')
            ->where('machine_num', $harddown->machine_num)
            ->update([
                'status' => 'ACTIVE',
                'updated_by' => session('emp_data')['emp_name'] ?? null,
            ]);

        DB::connection('eeportal')->table('harddown_history')->where('harddown_id', $id)->delete();
        DB::connection('eeportal')->table('harddown_tbl')->where('id', $id)->delete();

        return back()->with('success', 'Machine and attachments deleted successfully.');
    }
}
