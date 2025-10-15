import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ totalMachines, consignedMachines, ownedMachines, emp_data }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 🔹 Total Machines */}
                <div className="p-4 bg-cyan-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Total Machines</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {totalMachines}
                    </p>
                </div>

                {/* 🔹 Consigned */}
                <div className="p-4 bg-sky-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Consigned</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {consignedMachines}
                    </p>
                </div>

                {/* 🔹 Owned */}
                <div className="p-4 bg-emerald-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Owned</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {ownedMachines}
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
