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
    machinesTable, 
    minAge,
    maxAge,
    // machineTypePlatformData,
    machineOEM16Table,           
    grandTotalOEM16,
    machines16LocationTable,    
    grandTotalLocation16,
    allLocations,
    allConsignedTypes,
}) {

    const [minAgeInput, setMinAgeInput] = useState(minAge);
  const [maxAgeInput, setMaxAgeInput] = useState(maxAge);

  const applyAgeFilter = () => {
    router.get(route("dashboard"), {
      min_age: minAgeInput,
      max_age: maxAgeInput,
    });
  };

    // 🔹 Generate random colors
    const getRandomColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.9)`);
        }
        return colors;
    };

    // 🔹 Get all machine types for headers
    const allMachineTypesOEM = [
        ...new Set(
            Object.values(machineOEM16Table || {}).flatMap((data) =>
                Object.keys(data).filter((k) => k !== "total")
            )
        ),
    ];

    const allMachineTypesLocation = [
        ...new Set(
            Object.values(machines16LocationTable || {}).flatMap((data) =>
                Object.keys(data).filter((k) => k !== "total")
            )
        ),
    ];

    // 🔹 PIE chart options
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
            legend: { position: "bottom" },
            datalabels: {
                color: "#fff",
                font: { weight: "bold", size: 14 },
                formatter: (value, context) => {
                    const dataArr = context.chart.data.datasets[0].data;
                    const total = dataArr.reduce((acc, val) => acc + val, 0);
                    return ((value / total) * 100).toFixed(1) + "%";
                },
            },
        },
    };

    // 🔹 STACKED BAR — Machine Type per Platform
    // const barLabels = Object.keys(machineTypePlatformData || {});
    // const barDatasets = [];
    // const allTypes = [
    //     ...new Set(
    //         Object.values(machineTypePlatformData || {}).flatMap((platform) =>
    //             Object.keys(platform)
    //         )
    //     ),
    // ];

    // allTypes.forEach((type, i) => {
    //     barDatasets.push({
    //         label: type,
    //         data: barLabels.map(
    //             (platform) => machineTypePlatformData[platform]?.[type] || 0
    //         ),
    //         backgroundColor: [
    //             "#3b82f6",
    //             "#22c55e",
    //             "#f59e0b",
    //             "#ef4444",
    //             "#8b5cf6",
    //             "#14b8a6",
    //         ][i % 6],
    //     });
    // });

    // const stackedBarData = { labels: barLabels, datasets: barDatasets };
    // const stackedBarOptions = {
    //     plugins: {
    //         legend: { position: "bottom" },
    //         title: { display: true, text: "Machine Type per Platform" },
    //     },
    //     responsive: true,
    //     scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
    // };

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

            {/* 🔹 Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 🥧 Pie: Machine Platform Age 16+ (OEM) */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        <i className="fa-solid fa-chart-pie"></i>
                        TSPI T&R Machine Platform Age 16+ (OEM)
                    </h2>
                    <div className="h-96">
                        <Pie
                            data={{
                                labels: Object.keys(machineOEM16Table || {}),
                                datasets: [
                                    {
                                        label: "total count",
                                        data: Object.values(machineOEM16Table || {}).map(
                                            (item) => item.total
                                        ),
                                        backgroundColor: getRandomColors(
                                            Object.keys(machineOEM16Table || {}).length
                                        ),
                                        borderColor: "#fff",
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={pieOptions}
                            plugins={[ChartDataLabels]}
                        />
                    </div>

                    {/* Table for OEM 16+ */}
                    <div className="overflow-x-auto mt-4 h-full">
                        <table className="min-w-full text-sm text-left text-gray-700 border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">OEM</th>
                                    {allMachineTypesOEM.map((type) => (
                                        <th key={type} className="px-4 py-2">{type}</th>
                                    ))}
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(machineOEM16Table).map(([oem, data]) => (
                                    <tr key={oem} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{oem}</td>
                                        {allMachineTypesOEM.map((type) => (
                                            <td key={type} className="px-4 py-2">{data[type] || 0}</td>
                                        ))}
                                        <td className="px-4 py-2 font-bold">{data.total}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200 font-bold">
                                    <td className="px-4 py-2">Grand Total</td>
                                    {allMachineTypesOEM.map((type) => {
                                        const sum = Object.values(machineOEM16Table).reduce(
                                            (acc, val) => acc + (val[type] || 0),
                                            0
                                        );
                                        return <td key={type} className="px-4 py-2">{sum}</td>;
                                    })}
                                    <td className="px-4 py-2">{grandTotalOEM16}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🥧 Pie: Machines 16+ per Location */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        <i className="fa-brands fa-codiepie"></i>
                        TSPI T&R Machine Age 16+ (Product Line / Location)
                    </h2>
                    <div className="h-96">
                        <Pie
                            data={{
                                labels: Object.keys(machines16LocationTable || {}),
                                datasets: [
                                    {
                                        label: "total count",
                                        data: Object.values(machines16LocationTable || {}).map(
                                            (item) => item.total
                                        ),
                                        backgroundColor: getRandomColors(
                                            Object.keys(machines16LocationTable || {}).length
                                        ),
                                        borderColor: "#fff",
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={pieOptions}
                            plugins={[ChartDataLabels]}
                        />
                    </div>

                    {/* Table for Location 16+ */}
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full text-sm text-left text-gray-700 border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Product Line</th>
                                    {allMachineTypesLocation.map((type) => (
                                        <th key={type} className="px-4 py-2">{type}</th>
                                    ))}
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(machines16LocationTable).map(([loc, data]) => (
                                    <tr key={loc} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{loc}</td>
                                        {allMachineTypesLocation.map((type) => (
                                            <td key={type} className="px-4 py-2">{data[type] || 0}</td>
                                        ))}
                                        <td className="px-4 py-2 font-bold">{data.total}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200 font-bold">
                                    <td className="px-4 py-2">Grand Total</td>
                                    {allMachineTypesLocation.map((type) => {
                                        const sum = Object.values(machines16LocationTable).reduce(
                                            (acc, val) => acc + (val[type] || 0),
                                            0
                                        );
                                        return <td key={type} className="px-4 py-2">{sum}</td>;
                                    })}
                                    <td className="px-4 py-2">{grandTotalLocation16}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 📊 Stacked Bar Chart */}
            {/* <div className="bg-white p-4 rounded-lg shadow">
                <Bar data={stackedBarData} options={stackedBarOptions} />
            </div> */}

{/* 🔹 Machines Table (Vertical Type → Model) */}
<div className="bg-white p-4 rounded-lg shadow mt-6">
  {/* Table Title */}
  <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
    <i className="fa-solid fa-table"></i>
    Machines Table (Age {minAge} - {maxAge})
  </h2>

  {/* Age Filter */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
    <label htmlFor="">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
    <i className="fa-solid fa-arrow-down-1-9"></i>
    Select Age Range:
  </h3>
  </label>
    <input
      type="number"
      className="border px-2 py-1 rounded w-full sm:w-auto"
      placeholder="Min Age"
      value={minAgeInput}
      onChange={(e) => setMinAgeInput(e.target.value)}
    />
    <input
      type="number"
      className="border px-2 py-1 rounded w-full sm:w-auto"
      placeholder="Max Age"
      value={maxAgeInput}
      onChange={(e) => setMaxAgeInput(e.target.value)}
    />
    <button
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      onClick={applyAgeFilter}
    >
        <i className="fa-solid fa-filter"></i>
      Filter
    </button>
  </div>

  {/* 1st Table */}
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full text-sm text-left text-gray-700 border">
      <thead className="bg-gray-100 sticky top-0 z-10 text-left">
        <tr>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Model</th>

          {/* Dynamic Locations */}
          {allLocations.map((loc) => (
            <th key={loc} className="px-4 py-2">
              {loc}
            </th>
          ))}

          {/* Hardcoded Consigned Columns */}
          <th className="px-4 py-2">Owned</th>
          <th className="px-4 py-2">Consigned</th>

          <th className="px-4 py-2">Manufactured Year</th>
          <th className="px-4 py-2">Age</th>
        </tr>
      </thead>


       <tbody className="text-center">
  {machinesTable.map((row, index) => (
    <tr key={index} className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">{row.machine_type}</td>
      <td className="px-4 py-2">{row.model}</td>

      {/* Dynamic Location Counts */}
      {allLocations.map((loc) => (
        <td key={loc} className="px-4 py-2">{row[loc] || 0}</td>
      ))}

      {/* Hardcoded Consigned Counts */}
      <td className="px-4 py-2">{row.owned || 0}</td>
      <td className="px-4 py-2">{row.consigned || 0}</td>

      <td className="px-4 py-2">{row.manufactured_year || "-"}</td>
      <td className="px-4 py-2">{row.age}</td>
    </tr>
  ))}

  {/* Total row at the bottom */}
  <tr className="border-b bg-gray-700 font-bold text-gray-100">
  <td></td>
  <td>Total</td>
  {allLocations.map(loc => {
    const sum = machinesTable.reduce(
      (acc, row) => acc + Number(row[loc] || 0), // <-- convert to number
      0
    );
    return <td key={loc}>{sum}</td>;
  })}
  <td>{machinesTable.reduce((acc, row) => acc + Number(row.owned || 0), 0)}</td>
  <td>{machinesTable.reduce((acc, row) => acc + Number(row.consigned || 0), 0)}</td>
  <td></td>
  <td></td>
</tr>


      </tbody>
    </table>
  </div>

  {/* 2nd Table */}
<div className="overflow-x-auto mt-8">
  <table className="min-w-full text-sm text-left text-gray-700 border">
    <thead className="bg-blue-900 text-white sticky top-0 z-10">
      <tr>
        <th rowSpan={2} className="px-4 py-2"></th>
        <th colSpan={3} className="px-4 py-2 text-center">P1</th>
        <th colSpan={3} className="px-4 py-2 text-center">P4</th>
        <th colSpan={3} className="px-4 py-2 text-center">AMS</th>
        <th rowSpan={2} className="px-4 py-2">Total</th>
      </tr>
      <tr>
        {/* P1 Status */}
        <th className="px-2 py-1">ACTIVE</th>
        <th className="px-2 py-1">ENERCON</th>
        <th className="px-2 py-1">HARD DOWN</th>

        {/* P4 Status */}
        <th className="px-2 py-1">ACTIVE</th>
        <th className="px-2 py-1">ENERCON</th>
        <th className="px-2 py-1">HARD DOWN</th>

        {/* AMS Status */}
        <th className="px-2 py-1">ACTIVE</th>
        <th className="px-2 py-1">ENERCON</th>
        <th className="px-2 py-1">HARD DOWN</th>
      </tr>
    </thead>
    <tbody>
      {machinesTable.map((row, index) => {
        const total =
          (row.P1_ACTIVE || 0) + (row.P1_ENERCON || 0) + (row.P1_HARD_DOWN || 0) +
          (row.P4_ACTIVE || 0) + (row.P4_ENERCON || 0) + (row.P4_HARD_DOWN || 0) +
          (row.AMS_ACTIVE || 0) + (row.AMS_ENERCON || 0) + (row.AMS_HARD_DOWN || 0);

        return (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{row.machine_manufacturer} {row.model}</td>

            {/* P1 */}
            <td className="px-2 py-1">{row.P1_ACTIVE || 0}</td>
            <td className="px-2 py-1">{row.P1_ENERCON || 0}</td>
            <td className="px-2 py-1">{row.P1_HARD_DOWN || 0}</td>

            {/* P4 */}
            <td className="px-2 py-1">{row.P4_ACTIVE || 0}</td>
            <td className="px-2 py-1">{row.P4_ENERCON || 0}</td>
            <td className="px-2 py-1">{row.P4_HARD_DOWN || 0}</td>

            {/* AMS */}
            <td className="px-2 py-1">{row.AMS_ACTIVE || 0}</td>
            <td className="px-2 py-1">{row.AMS_ENERCON || 0}</td>
            <td className="px-2 py-1">{row.AMS_HARD_DOWN || 0}</td>

            <td className="px-4 py-2 font-bold">{total}</td>
          </tr>
        );
      })}

      {/* Total Row */}
      <tr className="bg-gray-200 font-bold">
        <td className="px-4 py-2">Total</td>

        {/* P1 */}
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P1_ACTIVE || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P1_ENERCON || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P1_HARD_DOWN || 0), 0)}</td>

        {/* P4 */}
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P4_ACTIVE || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P4_ENERCON || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.P4_HARD_DOWN || 0), 0)}</td>

        {/* AMS */}
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.AMS_ACTIVE || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.AMS_ENERCON || 0), 0)}</td>
        <td className="px-2 py-1">{machinesTable.reduce((acc, row) => acc + (row.AMS_HARD_DOWN || 0), 0)}</td>

        <td className="px-4 py-2">
          {machinesTable.reduce((acc, row) =>
            acc +
            (row.P1_ACTIVE || 0) + (row.P1_ENERCON || 0) + (row.P1_HARD_DOWN || 0) +
            (row.P4_ACTIVE || 0) + (row.P4_ENERCON || 0) + (row.P4_HARD_DOWN || 0) +
            (row.AMS_ACTIVE || 0) + (row.AMS_ENERCON || 0) + (row.AMS_HARD_DOWN || 0)
          , 0)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>
        </AuthenticatedLayout>
    );
}
