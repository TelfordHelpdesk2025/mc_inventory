import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Maintenance() {
    return (
        <AuthenticatedLayout>
            <Head title="Page Under Maintenance" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-gray-100 to-blue-200 px-4">
                <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-12 text-center">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6 animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-24 h-24 text-blue-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.983 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75-4.365-9.75-9.75-9.75zm.017 5.25v5.25l3.75 2.25"
                            />
                        </svg>
                    </div>

                    {/* Text */}
                    <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
                        Page Under Maintenance
                    </h1>

                    <p className="mt-4 text-gray-600 text-lg">
                        This page is currently being improved to give you a better experience.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Please check back again later.
                    </p>

                    {/* Optional button */}
                    <div className="mt-8">
                        <a
                            href={route("dashboard")}
                            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                        >
                            Go Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
