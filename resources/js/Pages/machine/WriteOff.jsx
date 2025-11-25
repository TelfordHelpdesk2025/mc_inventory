import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";

import { useState } from "react";

export default function WriteOff({ tableData, tableFilters, emp_data }) {
    const [role, setRole] = useState(null);



    const tableModalClose = (close) => {
        setRole(null);
        close();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manage Write Off Machine List" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                   <i className="fa-solid fa-file-circle-xmark"></i> Write Off Machine List
                </h1>

                    <button
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
        </AuthenticatedLayout>
    );
}
