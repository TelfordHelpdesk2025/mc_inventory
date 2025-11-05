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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard({
    totalMachines,
    consignedMachines,
    ownedMachines,
    emp_data,
    machineTypeData,
    machinePlatformData,
    machineTypePlatformData,
}) {
    // 🔹 Function to generate random colors
const getRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
};

// 🔹 PIE CHART 1 — By Machine Type
const machineTypeChartData = {
    labels: Object.keys(machineTypeData || {}),
    datasets: [
        {
            label: "Machine Type",
            data: Object.values(machineTypeData || {}),
            backgroundColor: getRandomColors(Object.keys(machineTypeData || {}).length),
            borderColor: "#fff",
            borderWidth: 1,
        },
    ],
};

// 🔹 PIE CHART 2 — By Machine Platform
const machinePlatformChartData = {
    labels: Object.keys(machinePlatformData || {}),
    datasets: [
        {
            label: "Machine Platform",
            data: Object.values(machinePlatformData || {}),
            backgroundColor: getRandomColors(Object.keys(machinePlatformData || {}).length),
            borderColor: "#fff",
            borderWidth: 1,
        },
    ],
};


    // 🔹 STACKED BAR — Machine Type per Platform
    const barLabels = Object.keys(machineTypePlatformData || {});
    const barDatasets = [];

    // Collect all unique types for consistent stacking
    const allTypes = [
        ...new Set(
            Object.values(machineTypePlatformData || {}).flatMap((platform) =>
                Object.keys(platform)
            )
        ),
    ];

    allTypes.forEach((type, i) => {
        barDatasets.push({
            label: type,
            data: barLabels.map(
                (platform) => machineTypePlatformData[platform]?.[type] || 0
            ),
            backgroundColor: [
                "#3b82f6",
                "#22c55e",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#14b8a6",
            ][i % 8],
        });
    });

    const stackedBarData = {
        labels: barLabels,
        datasets: barDatasets,
    };

    const stackedBarOptions = {
        plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Machine Type per Platform" },
        },
        responsive: true,
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold mb-4 text-gray-00"><i className="fa-solid fa-chart-line animate-bounce mr-1"></i> Dashboard</h1>

            {/* 🔹 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-cyan-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Total Machines</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {totalMachines}
                    </p>
                </div>
                <div className="p-4 bg-sky-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Consigned</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {consignedMachines}
                    </p>
                </div>
                <div className="p-4 bg-emerald-200 rounded-lg shadow text-gray-700">
                    <h2 className="text-lg font-semibold">Owned</h2>
                    <p className="text-3xl font-bold flex justify-end">
                        {ownedMachines}
                    </p>
                </div>
            </div>

            {/* 🔹 Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 🥧 Pie: Machine Type */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Machine Type Distributionll
                    </h2>
                    <Pie data={machineTypeChartData} />
                </div>

                {/* 🥧 Pie: Machine Platform */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Machine Platform Distribution
                    </h2>
                    <Pie data={machinePlatformChartData} />
                </div>
            </div>

            {/* 📊 Stacked Bar Chart*/}
            <div className="bg-white p-4 rounded-lg shadow">
                <Bar data={stackedBarData} options={stackedBarOptions} />
            </div>
        </AuthenticatedLayout>
    );
}
