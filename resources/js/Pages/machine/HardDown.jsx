import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";

export default function HardDown({ tableData, tableFilters, emp_data, errors }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form fields
    const [machineNum, setMachineNum] = useState("");
    const [platform, setPlatform] = useState("");
    const [model, setModel] = useState("");
    const [location, setLocation] = useState("");
    const [packageName, setPackageName] = useState("N/A");
    const [process, setProcess] = useState("N/A");
    const [status, setStatus] = useState("");
    const [currentId, setCurrentId] = useState(null);

    // Dropdown state
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    // --- FUNCTIONS ---
    const resetForm = () => {
        setMachineNum("");
        setPlatform("");
        setModel("");
        setLocation("");
        setPackageName("N/A");
        setProcess("N/A");
        setStatus("");
        setCurrentId(null);
    };

    // ADD
    const handleAddSubmit = () => {
        router.post(
            route("harddown.store"),
            {
                machine_num: machineNum,
                platform,
                model,
                location,
                package: packageName,
                process,
                status,
            },
            {
                onSuccess: () => {
                    setShowAddModal(false);
                    resetForm();
                    alert("✅ Hard Down Machine added successfully.");
                    window.location.reload();
                },
            }
        );
    };

    // EDIT
    const handleEditSubmit = () => {
        router.put(
            route("harddown.update", currentId),
            {
                machine_num: machineNum,
                platform,
                model,
                location,
                package: packageName,
                process,
                status,
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    resetForm();
                    alert("✅ Hard Down Machine updated successfully.");
                    window.location.reload();
                },
            }
        );
    };

    // DELETE
    const handleDelete = (id) => {
        setCurrentId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route("harddown.delete", currentId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                alert("✅ Hard Down Machine deleted successfully.");
                window.location.reload();
            },
        });
    };

    // VIEW
    const openViewModal = (item) => {
        setMachineNum(item.machine_num);
        setPlatform(item.platform);
        setModel(item.model);
        setLocation(item.location);
        setPackageName(item.package);
        setProcess(item.process);
        setStatus(item.status);
        setShowViewModal(true);
    };

    // EDIT
    const openEditModal = (item) => {
        setMachineNum(item.machine_num);
        setPlatform(item.platform);
        setModel(item.model);
        setLocation(item.location);
        setPackageName(item.package);
        setProcess(item.process);
        setStatus(item.status);
        setCurrentId(item.id);
        setShowEditModal(true);
    };

    // --- DATA WITH ACTION BUTTONS ---
    const dataWithAction = tableData.data.map((item) => ({
        ...item,
        action:
            emp_data &&
            ["superadmin", "admin"].includes(emp_data?.emp_system_role) ? (
                <div className="relative inline-block text-left">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.target.getBoundingClientRect();
                            setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
                            setDropdownOpen(dropdownOpen === item.id ? null : item.id);
                        }}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded text-md border border-2 border-black"
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
                                onClick={() => {
                                    openViewModal(item);
                                    setDropdownOpen(null);
                                }}
                                className="block w-full text-left px-3 py-1 text-sm hover:bg-blue-600 bg-blue-500 text-white rounded border border-2 border-blue-900"
                            >
                                <i className="fa fa-eye mr-2"></i> View
                            </button>

                            <button
                                onClick={() => {
                                    openEditModal(item);
                                    setDropdownOpen(null);
                                }}
                                className="block w-full text-left px-3 py-1 text-sm hover:bg-yellow-600 bg-yellow-500 text-white rounded border border-2 border-yellow-900"
                            >
                                <i className="fa fa-edit mr-2"></i> Edit
                            </button>

                            <button
                                onClick={() => {
                                    handleDelete(item.id);
                                    setDropdownOpen(null);
                                }}
                                className="block w-full text-left px-3 py-1 text-sm hover:bg-red-600 bg-red-500 text-white rounded border border-2 border-red-900"
                            >
                                <i className="fa fa-trash mr-2"></i> Delete
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => openViewModal(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    <i className="fas fa-eye mr-1"></i> View
                </button>
            ),
    }));

    // --- JSX ---
    return (
        <AuthenticatedLayout>
            <Head title="Manage Hard Down List" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold animate-bounce">
                    <i className="fa-solid fa-turn-down mr-2"></i>Hard Down List
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="text-white bg-green-500 border-green-900 btn hover:bg-green-700"
                >
                    <i className="fas fa-plus"></i> New Down Machine
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "machine_num", label: "Machine ID" },
                    { key: "platform", label: "Platform" },
                    { key: "model", label: "Model" },
                    { key: "location", label: "Location" },
                    { key: "package", label: "Package" },
                    { key: "process", label: "Process" },
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
                routeName={route("harddown.index")}
                filters={tableFilters}
                rowKey="machine_num"
                showExport={false}
            />

            {/* --- ADD MODAL --- */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <FormContent
                    title="New Hard Down Machine"
                    machineNum={machineNum}
                    setMachineNum={setMachineNum}
                    platform={platform}
                    setPlatform={setPlatform}
                    model={model}
                    setModel={setModel}
                    location={location}
                    setLocation={setLocation}
                    packageName={packageName}
                    setPackageName={setPackageName}
                    process={process}
                    setProcess={setProcess}
                    status={status}
                    setStatus={setStatus}
                    errors={errors}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* --- VIEW MODAL --- */}
            <Modal show={showViewModal} onClose={() => setShowViewModal(false)}>
                <FormContent
                    title="View Hard Down Machine"
                    machineNum={machineNum}
                    setMachineNum={setMachineNum}
                    platform={platform}
                    setPlatform={setPlatform}
                    model={model}
                    setModel={setModel}
                    location={location}
                    setLocation={setLocation}
                    packageName={packageName}
                    setPackageName={setPackageName}
                    process={process}
                    setProcess={setProcess}
                    status={status}
                    setStatus={setStatus}
                    errors={{}}
                    readOnly={true}
                    onSubmit={null}
                    onCancel={() => setShowViewModal(false)}
                />
            </Modal>

            {/* --- EDIT MODAL --- */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <FormContent
                    title="Edit Hard Down Machine"
                    machineNum={machineNum}
                    setMachineNum={setMachineNum}
                    platform={platform}
                    setPlatform={setPlatform}
                    model={model}
                    setModel={setModel}
                    location={location}
                    setLocation={setLocation}
                    packageName={packageName}
                    setPackageName={setPackageName}
                    process={process}
                    setProcess={setProcess}
                    status={status}
                    setStatus={setStatus}
                    errors={errors}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>

            {/* --- DELETE CONFIRM MODAL --- */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold mb-4 text-red-600">
                        <i className="fa fa-exclamation-triangle mr-2"></i> Confirm Delete
                    </h2>
                    <p className="mb-6">Are you sure you want to delete this?</p>
                    <div className="flex justify-center gap-3">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 border border-2 border-blue-900"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <i className="fa-solid fa-ban mr-1"></i>
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 border border-2 border-red-900"
                            onClick={confirmDelete}
                        >
                            <i className="fa-regular fa-trash-can mr-1"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

// --- FORM CONTENT COMPONENT ---
function FormContent({
    title,
    machineNum,
    setMachineNum,
    platform,
    setPlatform,
    model,
    setModel,
    location,
    setLocation,
    packageName,
    setPackageName,
    process,
    setProcess,
    status,
    setStatus,
    errors,
    readOnly = false,
    onSubmit,
    onCancel,
}) {

    // SET ICON BASED ON TITLE
    let icon = <i className="fa-solid fa-circle-info"></i>;

    if (title === "View Hard Down Machine") {
        icon = <i className="fa-regular fa-eye text-blue-600"></i>;
    } else if (title === "New Hard Down Machine") {
        icon = <i className="fa-solid fa-file-circle-plus text-green-600"></i>;
    } else if (title === "Edit Hard Down Machine") {
        icon = <i className="fa-regular fa-pen-to-square text-yellow-600"></i>;
    }

    return (
        <div className="p-6 bg-gray-200 rounded-md">
            <div className="p-4 bg-gradient-to-b from-gray-300 to-gray-600 rounded-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 animate-bounce mt-2">
                {icon} {title}
            </h2>
            </div>

            <div className="space-y-4 text-gray-700 mt-2">
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: "Machine ID", value: machineNum, setter: setMachineNum, key: "machine_num" },
                        { label: "Platform", value: platform, setter: setPlatform, key: "platform" },
                        { label: "Model", value: model, setter: setModel, key: "model" },
                        { label: "Location", value: location, setter: setLocation, key: "location" },
                        { label: "Package", value: packageName, setter: setPackageName, key: "package" },
                        { label: "Process", value: process, setter: setProcess, key: "process" },
                    ].map((field) => (
                        <div className="space-y-1" key={field.key}>
                            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                disabled={readOnly}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                            />
                            {errors[field.key] && <p className="text-red-500 text-sm">{errors[field.key]}</p>}
                        </div>
                    ))}
                </div>

                {/* STATUS */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <input
                        list="statusOptions"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={readOnly}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                        placeholder="Select Status..."
                    />
                    <datalist id="statusOptions">
                        <option value="COLD SHUTDOWN" />
                        <option value="Under Restoration" />
                        <option value="For Qualification" />
                        <option value="In-Active" />
                    </datalist>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>

                {/* BUTTONS */}
                {!readOnly && (
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                            <i className="fa-solid fa-ban"></i>
                            Cancel
                        </button>

                        <button
                            onClick={onSubmit}
                            className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <i className="fa-regular fa-paper-plane"></i>
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
