<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $empData = session('emp_data');



        if (!$empData) {
            return redirect()->route('login');
        }

        if (!in_array($empData['emp_role'], ['superadmin', 'admin', 'pmtech'])) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
