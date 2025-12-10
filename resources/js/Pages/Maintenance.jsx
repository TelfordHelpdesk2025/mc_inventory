import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Maintenance() {
    return (
        <AuthenticatedLayout>
            <Head title="Maintenance" />

            <div className="min-h-screen bg-gray-200 flex justify-center items-center px-4">
                <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-10 text-center">
                    
                    <div className="flex justify-center mb-5">
                        {/* Icon sample gear */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#3c8dbc"
                            viewBox="0 0 24 24"
                            className="w-20 h-20"
                        >
                            <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.11-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.027 7.027 0 00-1.63-.94l-.36-2.54A.488.488 0 0014.29 2h-4.58a.5.5 0 00-.49.42l-.36 2.54c-.59.24-1.14.56-1.63.94l-2.39-.96a.5.5 0 00-.61.22L2.71 8.84c-.14.23-.08.53.11.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.11.64l1.92 3.32c.14.23.44.33.61.22l2.39-.96c.49.38 1.04.7 1.63.94l.36 2.54c.05.24.25.42.49.42h4.58c.24 0 .44-.18.49-.42l.36-2.54c.59-.24 1.14-.56 1.63-.94l2.39.96c.23.11.52.01.61-.22l1.92-3.32a.5.5 0 00-.11-.64l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-semibold text-gray-700 uppercase">
                        Maintenance System
                    </h1>
                    <p className="mt-2 text-gray-500 font-semibold">
                        This module is currently under development.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
