import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";

export default function WriteOff({ tableData, tableFilters, emp_data, errors }) {
    // --- MODALS ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // --- FORM FIELDS ---
    const [qty, setQty] = useState("");
    const [serial, setSerial] = useState("");
    const [description, setDescription] = useState("");
    const [datePurchase, setDatePurchase] = useState("");
    const [currentId, setCurrentId] = useState(null);

    // --- DROPDOWN STATE --
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    // --- RESET FORM ---
    const resetForm = () => {
        setQty("");
        setSerial("");
        setDescription("");
        setDatePurchase("");
        setCurrentId(null);
    };

    // --- ADD SUBMIT ---
    const handleAddSubmit = () => {
        router.post(
            route("writeoff.store"),
            {
                qty,
                serial_no: serial,
                description,
                date_purchase: datePurchase,
            },
            {
                onSuccess: () => {
                    setShowAddModal(false);
                    resetForm();
                    alert("Write-Off added successfully.");
                    window.location.reload();
                },
            }
        );
    };

    // --- EDIT SUBMIT ---
    const handleEditSubmit = () => {
        router.put(
            route("writeoff.update", currentId),
            {
                qty,
                serial_no: serial,
                description,
                date_purchase: datePurchase,
            },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    resetForm();
                    alert("Write-Off updated successfully.");
                    window.location.reload();
                },
            }
        );
    };

    // --- DELETE ---
    const handleDelete = (id) => {
        setCurrentId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route("writeoff.delete", currentId), {
            onSuccess: () => {
                setShowDeleteModal(false);
                alert("Write-Off removed successfully.");
                window.location.reload();
            },
        });
    };

    // --- VIEW ---
    const openViewModal = (item) => {
        setQty(item.qty);
        setSerial(item.serial_no);
        setDescription(item.description);
        setDatePurchase(item.date_purchase);
        setShowViewModal(true);
    };

    // --- EDIT ---
    const openEditModal = (item) => {
        setQty(item.qty);
        setSerial(item.serial_no);
        setDescription(item.description);
        setDatePurchase(item.date_purchase);
        setCurrentId(item.id);
        setShowEditModal(true);
    };

    // --- DATA WITH ACTION COLUMN ---
    const dataWithAction = tableData.data.map((item) => ({
    ...item,
    action:
        emp_data &&
        ["superadmin", "admin", "engineer"].includes(emp_data?.emp_system_role) ? (
            <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDropdownPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                        });
                        setDropdownOpen(dropdownOpen === item.id ? null : item.id);
                    }}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-gray-100 rounded border border-black"
                >
                    Actions <i className="fa fa-caret-down ml-1"></i>
                </button>

                {dropdownOpen === item.id && (
                    <div
                        className="fixed z-50 w-32 bg-gray-400 border border-gray-200 rounded-md shadow-lg space-y-2 p-1"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                    >
                        <button
                            onClick={() => {
                                openViewModal(item);
                                setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded border border-2 border-blue-900"
                        >
                            <i className="fa fa-eye mr-1"></i> View
                        </button>

                        <button
                            onClick={() => {
                                openEditModal(item);
                                setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded border border-2 border-yellow-900"
                        >
                            <i className="fa fa-edit mr-1"></i> Edit
                        </button>

                        <button
                            onClick={() => {
                                handleDelete(item.id);
                                setDropdownOpen(null);
                            }}
                            className="block w-full text-left px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded border border-2 border-red-900"
                        >
                            <i className="fa fa-trash mr-1"></i> Delete
                        </button>
                    </div>
                )}
            </>
        ) : (
            <button
                onClick={() => openViewModal(item)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
                <i className="fas fa-eye mr-1"></i> View
            </button>
        ),
}));


    return (
        <AuthenticatedLayout>
            <Head title="Write-Off List" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold animate-bounce">
                    <i className="fa-solid fa-file-circle-xmark mr-1"></i>Write-Off Machine List
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="text-white bg-green-500 border-green-900 btn hover:bg-green-700"
                >
                    <i className="fas fa-plus"></i> Add New WriteOff
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "qty", label: "Qty" },
                    { key: "serial_no", label: "Serial" },
                    { key: "description", label: "Description" },
                    { key: "date_purchase", label: "Date Purchase" },
                    { key: "created_by", label: "Responsible person" },
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
                routeName={route("writeoff.index")}
                filters={tableFilters}
                rowKey="serial_no"
                showExport={false}
            />

            {/* ADD */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <FormContent
                    title="Add Write-Off"
                    qty={qty}
                    setQty={setQty}
                    serial={serial}
                    setSerial={setSerial}
                    description={description}
                    setDescription={setDescription}
                    datePurchase={datePurchase}
                    setDatePurchase={setDatePurchase}
                    readOnly={false}
                    errors={errors}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* VIEW */}
            <Modal show={showViewModal} onClose={() => setShowViewModal(false)}>
                <FormContent
                    title="View Write-Off"
                    qty={qty}
                    setQty={setQty}
                    serial={serial}
                    setSerial={setSerial}
                    description={description}
                    setDescription={setDescription}
                    datePurchase={datePurchase}
                    setDatePurchase={setDatePurchase}
                    readOnly={true}
                    errors={{}}
                    onSubmit={null}
                    onCancel={() => setShowViewModal(false)}
                />
            </Modal>

            {/* EDIT */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <FormContent
                    title="Edit Write-Off"
                    qty={qty}
                    setQty={setQty}
                    serial={serial}
                    setSerial={setSerial}
                    description={description}
                    setDescription={setDescription}
                    datePurchase={datePurchase}
                    setDatePurchase={setDatePurchase}
                    readOnly={false}
                    errors={errors}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEditModal(false)}
                />
            </Modal>

            {/* DELETE */}
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

// ======================================================================
// FORM CONTENT COMPONENT
// ======================================================================
function FormContent({
    title,
    qty,
    setQty,
    serial,
    setSerial,
    description,
    setDescription,
    datePurchase,
    setDatePurchase,
    readOnly,
    errors,
    onSubmit,
    onCancel,
}) {

    // SET ICON BASED ON TITLE
    let icon = <i className="fa-solid fa-circle-info"></i>;

    if (title === "Add Write-Off") {
        icon = <i className="fa-regular fa-eye text-blue-600"></i>;
    } else if (title === "View Write-Off") {
        icon = <i className="fa-solid fa-file-circle-plus text-green-600"></i>;
    } else if (title === "Edit Write-Off") {
        icon = <i className="fa-regular fa-pen-to-square text-yellow-600"></i>;
    }

    return (
        <div className="p-6 bg-gray-200 rounded-md">
            <div className="p-4 bg-gradient-to-b from-gray-300 to-gray-600 rounded-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 animate-bounce mt-2">
                {icon} {title}
            </h2>
            </div>

            <div className="space-y-4 text-gray-700">
                {/* QTY */}
                <div>
                    <label className="block text-sm font-semibold">Quantity</label>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        disabled={readOnly}
                        className="w-full p-2 border rounded"
                    />
                    {errors.qty && <p className="text-red-500 text-sm">{errors.qty}</p>}
                </div>

                {/* SERIAL */}
                <div>
                    <label className="block text-sm font-semibold">Serial No</label>
                    <input
                        type="text"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        disabled={readOnly}
                        className="w-full p-2 border rounded"
                    />
                    {errors.serial_no && <p className="text-red-500 text-sm">{errors.serial_no}</p>}
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="block text-sm font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={readOnly}
                        className="w-full p-2 border rounded"
                        rows={3}
                    ></textarea>
                </div>

                {/* DATE */}
                <div>
                    <label className="block text-sm font-semibold">Date Purchase</label>
                    <input
                        type="date"
                        value={datePurchase}
                        onChange={(e) => setDatePurchase(e.target.value)}
                        disabled={readOnly}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* BUTTONS */}
                {!readOnly && (
                    <div className="flex justify-end gap-3">
                        <button
                            className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                            onClick={onCancel}
                        >
                            <i className="fa-solid fa-ban"></i>
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            onClick={onSubmit}
                        >
                            <i className="fa-regular fa-paper-plane"></i>
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
