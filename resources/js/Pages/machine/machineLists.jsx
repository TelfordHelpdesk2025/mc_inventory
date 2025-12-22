import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import React, { useState, Fragment } from "react";


export default function machineLists({ tableData, tableFilters, emp_data }) {

        const [isViewModalOpen, setIsViewModalOpen] = useState(false);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [selectedMachine, setSelectedMachine] = useState(null);
        const [formData, setFormData] = useState({});
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
        const [dropdownOpen, setDropdownOpen] = useState(null);
        const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

        const openAddModal = () => {
            setFormData({});
            setIsAddModalOpen(true);
        };

            // 🟢 Handle Add submit
          const handleAddSubmit = (e) => {
            e.preventDefault();
            router.post(route("machine.store"), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setIsLoading(true);
                    alert("✅ Machine added successfully.");
                    window.location.reload();
                },
            });
          };
        
            // 🔹 Open View Modal
            const openViewModal = (machine) => {
                setSelectedMachine(machine);
                setIsViewModalOpen(true);
            };
        
            // 🔹 Open Edit Modal
            const openEditModal = (machine) => {
                setSelectedMachine(machine);
                setFormData(machine);
                setIsEditModalOpen(true);
            };
        
            // 🔹 Close modals
            const handleCloseModals = () => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedMachine(null);
            };
        
            // 🔹 Handle form input changes
            const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData({ ...formData, [name]: value });
            };
        
            // 🔹 Submit edited data
        const handleSubmit = (e) => {
          e.preventDefault();
          setIsLoading(true);
        
          router.post(route("machine.update", selectedMachine.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
              setIsEditModalOpen(false);
        
              // Delay 2 seconds bago mag reload
              setTimeout(() => {
                setIsLoading(false);
                alert("✅ Machine updated successfully.");
                window.location.reload();
              }, 1000); // 1 second
            },
            onError: () => setIsLoading(false),
          });
        };
        
        const handleDelete = (id) => {
          if (confirm("Are you sure you want to delete this machine?")) {
            router.delete(route("machine.delete", id), {
              preserveScroll: true,
              onSuccess: () => {
                alert("✅ Machine deleted successfully.");
                window.location.reload();
              },
            });
          }
        };


    // 🔹 Add "View", "Edit", "Delete" buttons per row
const dataWithAction = tableData.data.map((item) => ({
  ...item,

  // 🔸 Consigned badge
  consigned: (
    <span
      className={`px-2 py-1 text-xs font-semibold border rounded-md ${
        item.consigned &&
        item.consigned.trim().toLowerCase() === "consigned"
          ? "text-blue-500 border-blue-500 bg-blue-100 hover:bg-blue-700 hover:text-white"
          : item.consigned &&
            item.consigned.trim().toLowerCase() === "owned"
          ? "text-emerald-500 border-emerald-500 bg-emerald-100 hover:bg-emerald-700 hover:text-white"
          : "text-gray-400 border-gray-400 bg-gray-100 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {item.consigned?.trim() || "Waiting to Update..."}
    </span>
  ),

  // 🔸 Action buttons
  
action: ( 
   emp_data && (["superadmin", "admin", "engineer"].includes(emp_data?.emp_role) ||
  (["pmtech"].includes(emp_data?.emp_role) && ["1742"].includes(emp_data?.emp_id)) ) ) ? (
    <div className="relative inline-block text-left">
      {/* 🔘 Dropdown Trigger */}
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
        className="px-2 py-1 bg-gray-500 hover:bg-black text-white rounded text-sm border-2 hover:border-blue-600 rounded-md"
      >
        Actions <i className="fa fa-caret-down ml-1"></i>
      </button>

      {/* ✅ Dropdown Menu — only for the clicked item */}
      {dropdownOpen === item.id && (
        <div
          className="block overflow-y-auto z-50 mt-1 w-32 bg-gray-400 border border-gray-200 rounded shadow-lg space-y-2 p-1 px-2 py-1 rounded"
          style={{
            top:dropdownPosition.top,
            left:dropdownPosition.left,
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
            className="block w-full text-left px-3 py-1 text-sm hover:bg-amber-600 bg-amber-500 text-white rounded border border-2 border-amber-900"
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
     <div className="space-x-2">
    {/* 👁️ View Button */}
    <button
      onClick={() => openViewModal(item)}
      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
    >
      <i className="fas fa-eye mr-1"></i> View
    </button>
    </div>
  ),

}));
    return (
        <AuthenticatedLayout>
            <Head title="Manage Admin List" />

            <div className="flex items-center justify-between mb-4">
               <h1 className="text-2xl font-bold animate-bounce"><i class="fa-solid fa-cash-register mr-2"></i>Machine List</h1>
               <button
                   className="text-white bg-green-500 border-green-900 btn hover:bg-green-700"
                    onClick={openAddModal}
               >
                    <i className="fas fa-plus mr-1"></i>
                   Add New Machine
                </button>
            </div>

            <DataTable
                columns={[
                    { key: "machine_num", label: "Machine" },
                    { key: "serial", label: "Serial No." },
                    { key: "machine_feed_type", label: "Feed Type" },
                    { key: "machine_manufacturer", label: "Manufacturer" },
                    {key: "machine_platform" , label: "Platform"},
                    {key: "pmnt_no" , label: "Pmnt No."},
                    {key: "machine_type" , label: "Machine Type"},
                    {key: "model" , label: "Model"},
                    {key: "consigned" , label: "Consignment"},
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
                routeName={route("machine.list.index")}
                filters={tableFilters}
                rowKey="machine_num"
                showExport={false}
            />


                        {/* ✅ VIEW MODAL */}
                        <Modal
                    show={isViewModalOpen}
                    onClose={handleCloseModals}
            
                    maxWidth="7xl"
                    className="p-5 rounded-lg shadow-lg w-[95%] md:max-w-7xl overflow-y-auto max-h-[95vh]  border-2 border-blue-500"
                    >
            
                            {selectedMachine && (
              <div className="p-4 space-y-3 overflow-y-auto max-h-[80vh] bg-white">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded text-gray-900">
                  <h2 className="text-xl font-semibold animate-pulse">
                    <i className="fas fa-info-circle mr-2"></i> Machine Details
                  </h2>
                </div>
            
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-sm border text-gray-700">
                    <tbody>
                      {[
                        {
                          headers: [
                            "Machine No", "Machine Fed type", "Manufacturer", "Platform",
                            "Machine Description", "Company Rec ID", "Customer Rec ID", "Status"
                          ],
                          fields: [
                            "machine_num", "machine_feed_type", "machine_manufacturer", "machine_platform",
                            "machine_description", "company_rec_id", "customer_rec_id", "status"
                          ],
                        },
                        {
                          headers: [
                            "PMNT No", "CN No", "Orig Location", "Site Location",
                            "Location", "OEM", "Model", "Serial"
                          ],
                          fields: [
                            "pmnt_no", "cn_no", "orig_loc", "site_loc",
                            "location", "oem", "model", "serial"
                          ],
                        },
                        {
                          headers: [
                            "Machine Type", "Pm Personnel", "Platform", "Category",
                            "Level", "Dimension", "Operating Supply", "Phase"
                          ],
                          fields: [
                            "machine_type", "pm_personnel", "platform", "category",
                            "level", "dimension", "operating_supply", "phase"
                          ],
                        },
                        {
                          headers: [
                            "Heartz", "Amphere", "Power Consumption", "Weight",
                            "Spph", "Cap Shift", "Cap Delay", "Cap mo."
                          ],
                          fields: [
                            "hz", "amphere", "power_consumption", "weight",
                            "spph", "cap_shift", "cap_delay", "cap_mo"
                          ],
                        },
                        {
                          headers: [
                            "Manufactured Date", "Age", "Condition", "Acquired From",
                            "Acquisition Type", "Aquired Date", "Unit Price", "Aquired Amount"
                          ],
                          fields: [
                            "manufactured_date", "age", "condition", "acquired_from",
                            "acquisition_type", "acquired_date", "unit_price", "acquired_amount"
                          ],
                        },
                        {
                          headers: [
                            "Useful Life", "Monthly Depreciation", "Last Date Depreciation",
                            "Netbook Value", "Purpose of Acquisition", "Specify Machine Replaced",
                            "Consigned", "Date Transfer"
                          ],
                          fields: [
                            "useful_life", "monthly_depreciation", "last_date_depreciation",
                            "netbook_value", "purpose_of_acquisition", "specify_machine_replaced",
                            "consigned", "date_transfer"
                          ],
                        },
                      ].map((section, index) => (
                        <Fragment key={index}>

                          <tr>
                            {section.headers.map((head, i) => (
                              <th key={i} className="font-medium p-1 border bg-gray-400">
                                {head}
                              </th>
                            ))}
                          </tr>
                          <tr>
                            {section.fields.map((field, i) => (
                              <td key={i} className="p-1 border">
                                {selectedMachine[field] || ""}
                              </td>
                            ))}
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
            
                <div className="text-right mt-3">
                  <button
                    onClick={handleCloseModals}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 mt-2 transition"
                  >
                    <i className="fas fa-times mr-2"></i> Close
                  </button>
                </div>
              </div>
                )}
            </Modal>
            
            
                       {/* ✅ EDIT MODAL */}
            <Modal
              show={isEditModalOpen}
              onClose={handleCloseModals}
              maxWidth="3xl"
              className="p-5 rounded-lg shadow-lg w-full md:max-w-7xl overflow-y-auto overflow-x-hidden max-h-[100vh] border-4 border-blue-600 bg-white"
            >
              {formData && (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <h2 className="text-lg font-semibold mb-3 animate-pulse text-gray-900">
                    <i className="fas fa-edit mr-2 text-2xl"></i>Edit Machine Info
                  </h2>
            
                  {/* 👉 Generate inputs dynamically */}
                  <div className="grid grid-cols-3 gap-3 text-gray-700">
                    {[
                      "id",
                      "machine_num",
                      "machine_feed_type",
                      "machine_manufacturer",
                      "machine_platform",
                      "machine_description",
                      "company_rec_id",
                      "customer_rec_id",
                      "status",
                      "pmnt_no",
                      "cn_no",
                      "orig_loc",
                      "site_loc",
                      "location",
                      "oem",
                      "model",
                      "serial",
                      "machine_type",
                      "pm_personnel",
                      "platform",
                      "category",
                      "level",
                      "dimension",
                      "operating_supply",
                      "phase",
                      "hz",
                      "amp",
                      "power_consumption",
                      "weight",
                      "spph",
                      "cap_shift",
                      "cap_delay",
                      "cap_mo",
                      "manufactured_date",
                      "age",
                      "condition",
                      "acquired_from",
                      "acquisition_type",
                      "acquired_date",
                      "unit_price",
                      "acquired_amount",
                      "useful_life",
                      "monthly_depreciation",
                      "last_date_depreciation",
                      "netbook_value",
                      "purpose_acquisition",
                      "specify_machine_replaced",
                      "date_transfer",
                      "consigned",
                    ].map((field) => (
                      <div key={field}>
                        <label className="text-sm font-medium capitalize">
                          {field.replace(/_/g, " ")}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                          className="w-full border rounded p-1 text-gray-600"
                        />
                      </div>
                    ))}
                  </div>
            
                  {/* ✅ Buttons */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleCloseModals}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 mr-2"
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      <i className="fas fa-save"></i> Save
                    </button>
                  </div>
                </form>
              )}
            </Modal>
            
             {/* ✅ ADD MODAL */}
            <Modal
              show={isAddModalOpen}
              onClose={handleCloseModals}
              maxWidth="3xl"
              className="p-5 rounded-lg shadow-lg w-full md:max-w-7xl overflow-y-auto overflow-x-hidden max-h-[100vh] border-2 border-blue-500"
            >
              <form onSubmit={handleAddSubmit} className="space-y-2">
                <h2 className="text-lg font-semibold mb-3 text-white">
                  <i className="fas fa-plus-circle mr-2"></i> New Machine
                </h2>
            
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "machine_num",
                    "machine_feed_type",
                    "machine_manufacturer",
                    "machine_platform",
                    "machine_description",
                    "company_rec_id",
                    "customer_rec_id",
                    "status",
                    "pmnt_no",
                    "cn_no",
                    "orig_loc",
                    "site_loc",
                    "location",
                    "oem",
                    "model",
                    "serial",
                    "machine_type",
                    "pm_personnel",
                    "platform",
                    "category",
                    "level",
                    "dimension",
                    "operating_supply",
                    "phase",
                    "hz",
                    "amp",
                    "power_consumption",
                    "weight",
                    "spph",
                    "cap_shift",
                    "cap_delay",
                    "cap_mo",
                    "manufactured_date",
                    "age",
                    "condition",
                    "acquired_from",
                    "acquisition_type",
                    "acquired_date",
                    "unit_price",
                    "acquired_amount",
                    "useful_life",
                    "monthly_depreciation",
                    "last_date_depreciation",
                    "netbook_value",
                    "purpose_acquisition",
                    "specify_machine_replaced",
                    "date_transfer",
                    "consigned",
                  ].map((field) => (
                    <div key={field}>
                      <label className="text-sm font-medium capitalize">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-gray-600"
                      />
                    </div>
                  ))}
                </div>
            
                <div className="text-right mt-3">
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 mr-2"
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    <i className="fas fa-save"></i> Save
                  </button>
                </div>
              </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
