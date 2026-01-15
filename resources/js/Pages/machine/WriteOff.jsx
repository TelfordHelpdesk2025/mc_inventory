import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState } from "react";
import { Modal, Select, Space } from "antd";
import { FileAddOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SaveOutlined, UnorderedListOutlined,  } from '@ant-design/icons';
import "antd/dist/reset.css";
import { Inertia } from '@inertiajs/inertia';

export default function WriteOff({
    tableData,
    tableFilters,
    emp_data,
    errors,
    machines = [],
}) {
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

    // --- DROPDOWN ---
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const resetForm = () => {
        setQty("");
        setSerial("");
        setDescription("");
        setDatePurchase("");
        setCurrentId(null);
    };

    // --- MACHINE SELECT ---
    const handleMachineChange = (value) => {
        setDescription(value);

        const machine = machines.find(
            (m) => m.machine_num === value
        );

        if (machine) {
            setSerial(machine.serial);
            setDatePurchase(machine.acquired_date);
        } else {
            setSerial("");
            setDatePurchase("");
        }
    };

    // --- ADD ---
 const handleAddSubmit = () => {
    Modal.confirm({
        title: 'Confirm Save',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure the data is correct?',
        okText: 'Yes',
        cancelText: 'Cancel',

        onOk() {
            router.post(route("writeoff.store"), {
                qty,
                serial_no: serial,
                description,
                date_purchase: datePurchase,
            }, {
                onSuccess: () => {
                    alert("✅ Write Off added successfully.");
                    setShowAddModal(false);
                    resetForm();
                    window.location.reload();
                },
            });
        },
    });
};


    // --- EDIT ---
    const handleEditSubmit = () => {
        router.put(route("writeoff.update", currentId), {
            qty,
            serial_no: serial,
            description,
            date_purchase: datePurchase,
        }, {
            onSuccess: () => {
                alert("✅ Write Off updated successfully.");
                setShowEditModal(false);
                resetForm();
                window.location.reload();
            },
        });
    };

    // --- DELETE ---
const confirmDelete = () => {
    router.put(route("writeoff.delete", currentId), {}, {
        onSuccess: () => {
            alert("✅ Write Off deleted successfully.");
            setShowDeleteModal(false);
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

    const dataWithAction = tableData.data.map((item) => ({
        ...item,
       action: (
    <div className="flex gap-2">
        <button
            onClick={() => openViewModal(item)}
            className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
        >
            <EyeOutlined /> View
        </button>
        {/* <button
            onClick={() => openEditModal(item)}
            className="px-2 py-1 bg-amber-500 text-white rounded"
        >
            <EditOutlined />
        </button> */}
   {(
  ["superadmin", "admin", "engineer"].includes(emp_data?.emp_role)) &&
        <button
            onClick={() => {
                setCurrentId(item.id);
                setShowDeleteModal(true);
            }}
            className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
        >
            <DeleteOutlined /> Delete
        </button>
        }
        
    </div>
)

    }));

    return (
        <AuthenticatedLayout>
            <Head title="Write-Off List" />

            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <UnorderedListOutlined /> Write-Off Machine List
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    <FileAddOutlined /> Add Write-Off
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "qty", label: "Qty" },
                    { key: "serial_no", label: "Serial" },
                    { key: "description", label: "Description" },
                    { key: "date_purchase", label: "Date Purchase" },
                    { key: "created_by", label: "Responsible" },
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
            />

            {/* ADD */}
            <Modal
    title={
        <Space className="text-emerald-700">
            <FileAddOutlined />
            Add Write-Off
        </Space>
    }
    open={showAddModal}
    onCancel={() => setShowAddModal(false)}
    footer={null}
    destroyOnClose
>
                <FormContent
                    qty={qty}
                    setQty={setQty}
                    serial={serial}
                    setSerial={setSerial}
                    description={description}
                    setDescription={setDescription}
                    datePurchase={datePurchase}
                    setDatePurchase={setDatePurchase}
                    machines={machines}
                    readOnly={false}
                    onSubmit={handleAddSubmit}
                />
            </Modal>

            {/* VIEW */}
            <Modal
    title={
        <Space className="text-indigo-700">
            <EyeOutlined />
            View Write-Off
        </Space>
    }
    open={showViewModal}
    onCancel={() => setShowViewModal(false)}
    footer={null}
    destroyOnClose
>
                <FormContent
                    qty={qty}
                    serial={serial}
                    description={description}
                    datePurchase={datePurchase}
                    readOnly={true}
                />
            </Modal>

            {/* EDIT */}
                        <Modal
    title={
        <Space className="text-amber-600">
            <EditOutlined />
            Edit Write-Off
        </Space>
    }
    open={showEditModal}
    onCancel={() => setShowEditModal(false)}
    footer={null}
    destroyOnClose
>
                <FormContent
                    qty={qty}
                    setQty={setQty}
                    serial={serial}
                    setSerial={setSerial}
                    description={description}
                    setDescription={setDescription}
                    datePurchase={datePurchase}
                    setDatePurchase={setDatePurchase}
                    machines={machines}
                    readOnly={false}
                    onSubmit={handleEditSubmit}
                />
            </Modal>

            {/* DELETE */}
            <Modal
    title={
        <span className="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined />
            Confirm Delete
        </span>
    }
    open={showDeleteModal}
    onOk={confirmDelete}
    onCancel={() => setShowDeleteModal(false)}
    okText="Delete"
    okButtonProps={{ danger: true }}
>
    Are you sure you want to delete this?
</Modal>

        </AuthenticatedLayout>
    );
}

// ======================================================================
// FORM CONTENT
// ======================================================================
function FormContent({
    qty,
    setQty,
    serial,
    setSerial,
    description,
    setDescription,
    datePurchase,
    setDatePurchase,
    machines = [],
    readOnly,
    onSubmit,
}) {
    const handleMachineChange = (value) => {
        setDescription(value);
        const machine = machines.find(m => m.machine_num === value);
        if (machine) {
            setSerial(machine.serial);
            setDatePurchase(machine.acquired_date);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label>Quantity</label>
                <input
                    type="number"
                    value={qty}
                    disabled={readOnly}
                    onChange={(e) => setQty?.(e.target.value)}
                    className="w-full border p-2 rounded-md"
                />
            </div>

            <div>
                <label>Description</label>
                <Select
                    showSearch
                    value={description || undefined}
                    disabled={readOnly}
                    className="w-full border p-2 bg-white rounded-md border-gray-500 text-black"
                    placeholder="Search machine..."
                    optionFilterProp="label"
                    onChange={handleMachineChange}
                    options={machines.map((m) => ({
                        value: m.machine_num,
                        label: `${m.machine_num}`,
                    }))}
                />
            </div>

            <div>
                <label>Serial No</label>
                <input
                    type="text"
                    value={serial}
                    disabled={readOnly}
                    onChange={(e) => setSerial?.(e.target.value)}
                    className="w-full border p-2 bg-gray-100 rounded-md"
                    readOnly
                />
            </div>

            

            <div>
                <label>Date Purchase</label>
                <input
                    type="text"
                    value={datePurchase}
                    disabled={readOnly}
                    onChange={(e) => setDatePurchase?.(e.target.value)}
                    className="w-full border p-2 bg-gray-100 rounded-md"
                    required
                />
            </div>

            {!readOnly && (
    <div className="flex justify-end">
        <button
            onClick={onSubmit}
            disabled={!qty || !description || !serial || !datePurchase}
            className={`px-4 py-2 rounded flex items-center gap-1
                ${
                    !qty || !description || !serial || !datePurchase
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                }
            `}
        >
            <SaveOutlined /> Save
        </button>
    </div>
)}

        </div>
    );
}
