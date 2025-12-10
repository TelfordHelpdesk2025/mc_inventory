import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";

import { useState } from "react";

export default function WriteOff({ tableData, tableFilters, emp_data }) {
    const [openModal, setOpenModal] = useState(false);

    // Form States
    const [qty, setQty] = useState("");
    const [serial, setSerial] = useState("");
    const [description, setDescription] = useState("");
    const [datePurchase, setDatePurchase] = useState("");

    const tableModalClose = (close) => {
        setOpenModal(false);
        close();
    };

    const submitWriteoff = () => {
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
                setOpenModal(false);

                setQty("");
                setSerial("");
                setDescription("");
                setDatePurchase("");

                alert("✅ Write Off added successfully.");
                window.location.reload();
            },
        }
    );
};


    return (
        <AuthenticatedLayout>
            <Head title="Manage Write Off Machine List" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-solid fa-file-circle-xmark"></i> Write Off Machine List
                </h1>

                {/* OPEN MODAL BTN */}
                <button
                    onClick={() => setOpenModal(true)}
                    className="text-white bg-emerald-500 border-emerald-900 btn hover:bg-emerald-700"
                >
                    <i className="fas fa-plus"></i> Add New WriteOff
                </button>
            </div>

            

            <DataTable
                columns={[
                    { key: "qty", label: "qty" },
                    { key: "serial_no", label: "Serial" },
                    { key: "description", label: "Description" },
                    { key: "date_purchase", label: "Date Purchase" },
                ]}
                data={tableData.data}
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

            {/* MODAL */}
            <Modal show={openModal} onClose={tableModalClose}>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Add New WriteOff
                    </h2>

                    <div className="grid grid-cols-1 gap-3">

                        <div>
                            <label className="block text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Serial No</label>
                            <input
                                type="text"
                                value={serial}
                                onChange={(e) => setSerial(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg"
                                rows={3}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Date Purchase</label>
                            <input
                                type="date"
                                value={datePurchase}
                                onChange={(e) => setDatePurchase(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="text-end mt-5 flex gap-3 justify-end">

                        <button
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                            onClick={submitWriteoff}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
