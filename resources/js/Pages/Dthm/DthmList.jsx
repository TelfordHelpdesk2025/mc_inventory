import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState } from "react";

export default function DthmList({ tableData, tableFilters, emp_data }) {

    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerMode, setDrawerMode] = useState("add"); // add | view | edit
    const [selectedItem, setSelectedItem] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [formData, setFormData] = useState({
        date_enrolled: new Date().toLocaleDateString("en-US"), // MM/DD/YYYY
        eqpmnt_control_no: "",
        eqpmnt_description: "",
        eqpmnt_type: "",
        eqpmnt_manufacturer: "",
        eqpmnt_model: "",
        eqpmnt_cal_date: "",
        eqpmnt_cal_due: "",
        eqpmnt_serial_no: "",
        cal_interval: "",
        location: "",
        ip_address: "",
        status: "",
        remarks: "",
        cal_specs_no: "",
        instrument: "",
        instrument_description: "",
        instrument_serial_no: "",
        instrument_control_no: "",
        instrument_cal_date: "",
        instrument__cal_due: "",
        tracebility: "",
        calibrated_by: emp_data.emp_name,
        reviewed_by: "",
        report_no: "",
    });

    // 🔹 Drawer functions
    const openAddDrawer = () => {
        setDrawerMode("add");
        setSelectedItem(null);
        setFormData({
            ...formData,
            date_enrolled: new Date().toLocaleDateString("en-US"),
        });
        setOpenDrawer(true);
    };

    const openViewDrawer = (item) => {
        setDrawerMode("view");
        setSelectedItem(item);
        setFormData(item);
        setOpenDrawer(true);
    };

    const openEditDrawer = (item) => {
        setDrawerMode("edit");
        setSelectedItem(item);
        setFormData(item);
        setOpenDrawer(true);
    };

    // 🔹 Form submissions
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("dthm.store"), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenDrawer(false);
                alert("✅ DTHM equipment added successfully.");
                window.location.reload();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.post(route("dthm.update", selectedItem.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setOpenDrawer(false);
                alert("✅ DTHM equipment updated successfully.");
                window.location.reload();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this DTHM equipment?")) {
            router.delete(route("dthm.delete", id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert("✅ DTHM equipment deleted successfully.");
                    window.location.reload();
                },
            });
        }
    };

    // 🔹 Data table with status badge and action buttons
    const dataWithAction = tableData.data.map((item) => ({
        ...item,
        status: (
            <span
                className={`px-2 py-1 text-xs font-semibold border rounded-md ${
                    item.status &&
                    item.status.trim().toLowerCase() === "active"
                        ? "text-emerald-500 border-emerald-500 bg-emerald-100 hover:bg-emerald-700 hover:text-white"
                        : item.status &&
                          item.status.trim().toLowerCase() === "inactive"
                        ? "text-rose-500 border-rose-500 bg-rose-100 hover:bg-rose-700 hover:text-white"
                        : "text-gray-400 border-gray-400 bg-gray-100 hover:bg-gray-700 hover:text-white"
                }`}
            >
                {item.status?.trim() || "Waiting to Update..."}
            </span>
        ),
        action: (
            emp_data &&
            (
                ["superadmin", "admin", "engineer"].includes(emp_data?.emp_role) ||
                (["pmtech"].includes(emp_data?.emp_role) && ["1742"].includes(emp_data?.emp_id))
            )
        ) ? (
            <div className="relative inline-block text-left">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.target.getBoundingClientRect();
                        setDropdownPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left,
                        });
                        setDropdownOpen(dropdownOpen === item.id ? null : item.id);
                    }}
                    className="px-2 py-1 bg-gray-500 hover:bg-black text-white rounded text-sm border-2 hover:border-blue-600"
                >
                    Actions <i className="fa fa-caret-down ml-1"></i>
                </button>

                {dropdownOpen === item.id && (
                    <div
                        className="block overflow-y-auto z-50 mt-1 w-32 bg-gray-400 border border-gray-200 rounded shadow-lg space-y-2 p-1"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            height: "auto",
                        }}
                    >
                        <button
                            onClick={() => { openViewDrawer(item); setDropdownOpen(null); }}
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-blue-600 bg-blue-500 text-white rounded border border-2 border-blue-900"
                        >
                            <i className="fa fa-eye mr-2"></i> View
                        </button>

                        <button
                            onClick={() => { openEditDrawer(item); setDropdownOpen(null); }}
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-amber-600 bg-amber-500 text-white rounded border border-2 border-amber-900"
                        >
                            <i className="fa fa-edit mr-2"></i> Edit
                        </button>

                        <button
                            onClick={() => { handleDelete(item.id); setDropdownOpen(null); }}
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-red-600 bg-red-500 text-white rounded border border-2 border-red-900"
                        >
                            <i className="fa fa-trash mr-2"></i> Delete
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex space-x-2 ">
                <button
                    onClick={() => openViewDrawer(item)}
                    className="block w-full text-left px-3 py-1 text-sm hover:bg-blue-600 bg-blue-500 text-white rounded border border-2 border-blue-900"
                >
                    <i className="fas fa-eye mr-1"></i> View
                </button>

                <button
                            onClick={() => { openEditDrawer(item); setDropdownOpen(null); }}
                            className="block w-full text-left px-3 py-1 text-sm hover:bg-amber-600 bg-amber-500 text-white rounded border border-2 border-amber-900"
                        >
                            <i className="fa fa-edit mr-2"></i> Edit
                        </button>
            </div>
        ),
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Manage DTHM List" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold animate-bounce">
                    <i className="fa-solid fa-tachograph-digital"></i> DTHM List
                </h1>
                <button
                    className="text-white bg-green-500 border-green-900 btn hover:bg-green-700"
                    onClick={openAddDrawer}
                >
                    <i className="fa-solid fa-plus"></i> DTHM Equipment
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "date_enrolled", label: "Date Enrolled" },
                    { key: "eqpmnt_description", label: "Equipment Description" },
                    { key: "eqpmnt_manufacturer", label: "Equipment Manufacturer" },
                    { key: "eqpmnt_model", label: "Equipment Model" },
                    { key: "eqpmnt_control_no", label: "Equipment Control No" },
                    { key: "ip_address", label: "IP Address" },
                    { key: "location", label: "Location" },
                    { key: "status", label: "Status" },
                    { key: "action", label: "Action" },
                ]}
                data={dataWithAction}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                routeName={route("dthm.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* 🔹 Drawer Overlay */}
            {openDrawer && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setOpenDrawer(false)}
                />
            )}

            {/* 🔹 Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[680px] bg-white shadow-xl z-50 transform transition-transform duration-300
                    ${openDrawer ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-500 to-gray-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {drawerMode === "add" ? (
                            <>
                                <i className="fa-solid fa-plus"></i> Add DTHM Equipment
                            </>
                        ) : drawerMode === "view" ? (
                            <>
                                <i className="fa-solid fa-eye"></i> View DTHM Equipment
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-pen"></i> Edit DTHM Equipment
                            </>
                        )}
                    </h2>

                    <button
                        onClick={() => setOpenDrawer(false)}
                        className="text-red-500 hover:text-red-500"
                    >
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Body / Form */}
<div className="p-4 overflow-y-auto h-full pb-40">
    <form className="grid grid-cols-3 gap-4">
        {[
            "date_enrolled",
            "eqpmnt_control_no",
            "eqpmnt_description",
            "eqpmnt_type",
            "eqpmnt_manufacturer",
            "eqpmnt_model",
            "eqpmnt_cal_date",
            "eqpmnt_cal_due",
            "eqpmnt_serial_no",
            "cal_interval",
            "location",
            "ip_address",
            "status",
            "remarks",
            "cal_specs_no",
            "instrument",
            "instrument_description",
            "instrument_serial_no",
            "instrument_control_no",
            "instrument_cal_date",
            "instrument__cal_due",
            "tracebility",
            "calibrated_by",
            "reviewed_by",
            "report_no",
        ].map((field) => (
            <div key={field} className="flex flex-col">
                <label className="text-sm font-semibold capitalize">
                    {field.replace(/_/g, " ")}
                </label>

                {/* readonly fields */}
                {["date_enrolled", "calibrated_by"].includes(field) ? (
                    <input
                        type="text"
                        className="w-full mt-1 rounded border-gray-300 border px-2 py-1 bg-gray-100"
                        name={field}
                        value={formData[field] || ""}
                        disabled
                    />
                ) : ["eqpmnt_cal_date", "eqpmnt_cal_due", "instrument_cal_date", "instrument__cal_due"].includes(field) ? (
                    // date fields
                    <input
                        type="date"
                        className="w-full mt-1 rounded border-gray-300 border px-2 py-1"
                        name={field}
                        value={formData[field] || ""}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        disabled={drawerMode === "view"}
                    />
                ) : field === "status" ? (
                    // dropdown for status
                    <select
                        className="w-full mt-1 rounded border-gray-300 border px-2 py-1"
                        name={field}
                        value={formData[field] || ""}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        disabled={drawerMode === "view"}
                    >
                        <option value="">-- Select Status --</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="waiting">Waiting</option>
                    </select>
                ) : (
                    <input
                        type="text"
                        className="w-full mt-1 rounded border-gray-300 border px-2 py-1"
                        name={field}
                        value={formData[field] || ""}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        disabled={drawerMode === "view"}
                    />
                )}
            </div>
        ))}
    </form>
</div>


                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white flex justify-end gap-2">
                    <button
                        onClick={() => setOpenDrawer(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        <i className="fa-solid fa-xmark"></i> Close
                    </button>

                    {drawerMode !== "view" && (
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={drawerMode === "add" ? handleSubmit : handleUpdate}
                        >
                            <i className="fa-solid fa-floppy-disk"></i> {drawerMode === "add" ? " Save" : " Update"}
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
