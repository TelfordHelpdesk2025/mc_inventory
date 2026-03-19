import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import { router } from "@inertiajs/react";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartDataLabels
);

export default function Dashboard({
    totalMachines,
    consignedMachines,
    ownedMachines,
}) {


    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold mb-4 animate-bounce">
                <i className="fa-solid fa-chart-line mr-1"></i>Dashboard Summary
            </h1>

            {/* 🔹 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-cyan-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Total Machines</h2>
                    <p className="text-3xl font-bold flex justify-end">{totalMachines}</p>
                </div>
                <div className="p-4 bg-sky-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Consigned</h2>
                    <p className="text-3xl font-bold flex justify-end">{consignedMachines}</p>
                </div>
                <div className="p-4 bg-emerald-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Owned</h2>
                    <p className="text-3xl font-bold flex justify-end">{ownedMachines}</p>
                </div>
            </div>

           
        </AuthenticatedLayout>
    );
}
