<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // COMMENT OUT IF NO SPECIFIC DEPT OR JOB TITLE


        $empData = session('emp_data');

        if ($empData) {
            $role = $empData['emp_system_role'] ?? null;
            $empId = $empData['emp_id'] ?? null;

            if (
                !in_array($role, ['superadmin', 'admin', 'engineer']) &&
                !($role === 'pmtech' && $empId === '1742')
            ) {
                // User is not authorized
                session()->forget('emp_data');
                session()->flush();
                return redirect()->route('unauthorized');
            }
        }


        return $next($request);
    }
}
