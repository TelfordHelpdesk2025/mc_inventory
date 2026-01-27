import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import React, { useState } from "react";
import Select from "react-select";
import { Drawer } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import PhonelinkEraseTwoToneIcon from '@mui/icons-material/PhonelinkEraseTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import BookmarkAddedTwoToneIcon from '@mui/icons-material/BookmarkAddedTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import ScannerTwoToneIcon from '@mui/icons-material/ScannerTwoTone';
import SizeContext from "antd/es/config-provider/SizeContext";
import HvacTwoToneIcon from '@mui/icons-material/HvacTwoTone';

/* ======================================================
   FIELD CONFIG (SINGLE SOURCE OF TRUTH)
====================================================== */
const FIELD_GROUPS = {
  general: {
    title: "General Information",
    fields: [
      { name: "machine_num", label: "Machine No" },
      { name: "machine_description", label: "Description" },
      { name: "machine_feed_type", label: "Feed Type" },
      { name: "machine_type", label: "Machine Type" },
      { name: "category", label: "Category" },
      { name: "status", label: "Status" },
      { name: "condition", label: "Condition" },
    ],
  },

  identity: {
    title: "Manufacturer / Identity",
    fields: [
      { name: "oem", label: "OEM" },
      { name: "machine_manufacturer", label: "Manufacturer" },
      { name: "model", label: "Model" },
      { name: "serial", label: "Serial" },
      { name: "manufactured_date", label: "Manufactured Date" },
      { name: "age", label: "Age" },
    ],
  },

  location: {
    title: "Location & Ownership",
    fields: [
      { name: "company_rec_id", label: "Company Rec ID" },
      { name: "customer_rec_id", label: "Customer Rec ID" },
      { name: "orig_loc", label: "Original Location" },
      { name: "site_loc", label: "Site Location" },
      { name: "location", label: "Current Location" },
      { name: "consigned", label: "Consigned" },
      { name: "date_transfer", label: "Date Transfer" },
    ],
  },

  technical: {
    title: "Technical Specifications",
    fields: [
      { name: "dimension", label: "Dimension" },
      { name: "weight", label: "Weight" },
      { name: "phase", label: "Phase" },
      { name: "hz", label: "Hertz" },
      { name: "amp", label: "Ampere" },
      { name: "power_consumption", label: "Power Consumption" },
      { name: "operating_supply", label: "Operating Supply" },
    ],
  },

  capacity: {
    title: "Capacity",
    fields: [
      { name: "spph", label: "SPPH" },
      { name: "cap_shift", label: "Capacity / Shift" },
      { name: "cap_delay", label: "Capacity / Delay" },
      { name: "cap_mo", label: "Capacity / Month" },
    ],
  },

  financial: {
    title: "Financial / Asset Info",
    fields: [
      { name: "acquired_from", label: "Acquired From" },
      { name: "acquisition_type", label: "Acquisition Type" },
      { name: "acquired_date", label: "Acquired Date" },
      { name: "unit_price", label: "Unit Price" },
      { name: "acquired_amount", label: "Acquired Amount" },
      { name: "useful_life", label: "Useful Life" },
      { name: "monthly_depreciation", label: "Monthly Depreciation" },
      { name: "netbook_value", label: "Net Book Value" },
    ],
  },

  others: {
    title: "Others",
    fields: [
      { name: "pm_personnel", label: "PM Personnel" },
      { name: "purpose_acquisition", label: "Purpose of Acquisition" },
      { name: "remarks", label: "Remarks" },
    ],
  },
};

/* ======================================================
   REUSABLE VIEW SECTION
====================================================== */
const ViewSection = ({ title, data, fields }) => {
  const visible = fields.filter(f => data?.[f.name]);
  if (!visible.length) return null;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-blue-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {visible.map(f => (
          <div key={f.name}>
            <div className="text-gray-500">{f.label}</div>
            <div className="font-medium">{data[f.name]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function ionizerLists({
  tableData,
  tableFilters,
  emp_data,
  existingMachine,
}) {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [formData, setFormData] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isMachineNumValid, setIsMachineNumValid] = useState(true);

  /* ================================
     HANDLERS
  ================================= */
  const openViewModal = machine => {
    setSelectedMachine(machine);
    setIsViewModalOpen(true);
  };

  const openEditModal = machine => {
    setSelectedMachine(machine);
    setFormData(machine);
    setActiveTab("general");
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({});
    setActiveTab("general");
    setIsAddModalOpen(true);
  };

  const closeAll = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedMachine(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "machine_num") {
      const exists = existingMachine
        .map(m => m.toLowerCase())
        .includes(value.toLowerCase());
      setIsMachineNumValid(!exists);
    }
  };

  const submitEdit = e => {
    e.preventDefault();
    router.post(route("machine.update", selectedMachine.id), formData, {
      onSuccess: () => window.location.reload(),
    });
  };

  const submitAdd = e => {
    e.preventDefault();
    router.post(route("machine.store"), formData, {
      onSuccess: () => window.location.reload(),
    });
  };

  /* ================================
     TABLE
  ================================= */

         const STATUS_STYLES = {
    "active": "text-green-700 border-green-600 bg-green-100 hover:bg-green-700 hover:text-white",
    "operational": "text-lime-700 border-lime-600 bg-lime-100 hover:bg-lime-700 hover:text-white",
    "active ams": "text-emerald-700 border-emerald-600 bg-emerald-100 hover:bg-emerald-700 hover:text-white",

    "for qualification": "text-indigo-700 border-indigo-600 bg-indigo-100 hover:bg-indigo-700 hover:text-white",
    "under qualification": "text-blue-700 border-blue-600 bg-blue-100 hover:bg-blue-700 hover:text-white",

    "for waiting of parts": "text-yellow-800 border-yellow-600 bg-yellow-100 hover:bg-yellow-600 hover:text-white",

    "cold shutdown": "text-amber-700 border-amber-600 bg-amber-100 hover:bg-amber-700 hover:text-white",

    "hard shutdown": "text-red-700 border-red-600 bg-red-100 hover:bg-red-700 hover:text-white",
    "write-off": "text-orange-700 border-orange-600 bg-orange-100 hover:bg-orange-700 hover:text-white",

    "inactive": "text-rose-700 border-rose-600 bg-rose-100 hover:bg-rose-700 hover:text-white",
    "archived": "text-cyan-700 border-cyan-600 bg-cyan-100 hover:bg-cyan-700 hover:text-white",
    "for archive": "text-stone-700 border-stone-600 bg-stone-100 hover:bg-stone-700 hover:text-white",

    "no record database": "text-orange-700 border-orange-600 bg-orange-100 hover:bg-orange-700 hover:text-white",
};


const getStatusClass = (status) => {
    if (!status) return "text-slate-500 border-slate-400 bg-slate-100";

    return (
        STATUS_STYLES[status.trim().toLowerCase()] ||
        "text-purple-700 border-purple-600 bg-purple-100 hover:bg-purple-700 hover:text-white"
    );
};

  const dataWithAction = tableData.data.map(item => ({
    ...item,
     // 🔸 status badge
  status: (
    <span
        className={`px-2 py-1 text-xs font-semibold border rounded-md transition-all duration-200 ${getStatusClass(
            item.status
        )}`}
    >
        {item.status?.trim() || "Waiting to Update..."}
    </span>
),

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
      <button
        onClick={() => openViewModal(item)}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        <VisibilityTwoToneIcon /> View
      </button>
    ),
  }));

  return (
    <AuthenticatedLayout>
      <Head title="Ionizer List" />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold"><HvacTwoToneIcon style={{fontSize: 45, marginBottom: 10}}/> Ionizer List</h1>
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
        >
          <PlusOutlined style={{fontSize: 18, fontWeight: "bold"}} /> New Ionizer
        </button>
      </div>

       <DataTable
                columns={[
                    { key: "machine_num", label: "Machine" },
                    { key: "machine_feed_type", label: "Feed Type" },
                    { key: "machine_manufacturer", label: "Manufacturer" },
                    {key: "machine_platform" , label: "Platform"},
                    {key: "pmnt_no" , label: "Pmnt No."},
                    {key: "machine_type" , label: "Machine Type"},
                    {key: "model" , label: "Model"},
                    {key: "location" , label: "Location"},
                    {key: "status" , label: "Status"},
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
                routeName={route("ionizer.list.index")}
                filters={tableFilters}
                rowKey="machine_num"
                showExport={false}
            />

      {/* ================= VIEW DRAWER ================= */}
<Drawer
  title={selectedMachine?.machine_num}
  placement="right"
  open={isViewModalOpen}
  onClose={closeAll}
  size={995}  // pwede 70vw, 80vw, 100vw
 styles={{ body: { padding: 0 } }}

>
  {selectedMachine && (
    <div className="flex h-full">

      {/* CONTENT */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {Object.values(FIELD_GROUPS).map(group => (
          <ViewSection
            key={group.title}
            title={group.title}
            data={selectedMachine}
            fields={group.fields}
          />
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="w-15 border-none p-4 space-y-2">
        <button
          onClick={() => openEditModal(selectedMachine)}
          className="w-24 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded ml-2"
        >
          <EditNoteTwoToneIcon /> Edit
        </button>

        {/* <button
          onClick={closeAll}
          className="w-24 bg-red-500 hover:bg-red-600 text-white py-2 rounded ml-2"
        >
          <PhonelinkEraseTwoToneIcon /> Close
        </button> */}
      </div>
    </div>
  )}
</Drawer>


     {/* ================= EDIT / ADD DRAWER ================= */}
<Drawer
  title={
    <div className="flex items-center gap-2 font-semibold">
      {isEditModalOpen ? (
        <>
          <EditOutlined className="text-indigo-500" />
          <span className="text-indigo-600">Update Ionizer</span>
        </>
      ) : (
        <>
          <PlusOutlined className="text-emerald-600" />
          <span className="text-emerald-600">New Ionizer</span>
        </>
      )}
    </div>
  }
  styles={{ header: { borderBottom: "1px solid #e5e7eb" } }}

  placement="right"
  open={isEditModalOpen || isAddModalOpen}
  onClose={closeAll}
  size={995}
>
  <form
    onSubmit={isEditModalOpen ? submitEdit : submitAdd}
    className="space-y-4"
  >
    {/* TABS */}
    <div className="flex border-b mb-4 overflow-x-auto">
      {Object.keys(FIELD_GROUPS).map(key => (
        <button
          key={key}
          type="button"
          onClick={() => setActiveTab(key)}
          className={`px-3 py-2 whitespace-nowrap ${
            activeTab === key
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          {FIELD_GROUPS[key].title}
        </button>
      ))}
    </div>

    {/* FIELDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {FIELD_GROUPS[activeTab].fields.map(f => (
        <div key={f.name}>
          <label className="text-sm text-gray-600">{f.label}</label>
          <input
            name={f.name}
            value={formData[f.name] || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-lg"
          />

          {f.name === "machine_num" && !isMachineNumValid && (
            <p className="text-red-500 text-xs">
              Machine number already exists
            </p>
          )}
        </div>
      ))}
    </div>

    {/* ACTIONS */}
    <div className="text-right pt-6">
      <button
        type="button"
        onClick={closeAll}
        className="px-4 py-2 bg-red-500 text-white rounded mr-2 hover:bg-red-600"
      >
        <HighlightOffTwoToneIcon /> Cancel
      </button>

      <button
        type="submit"
        disabled={!isMachineNumValid}
        className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
      >
        <BookmarkAddedTwoToneIcon />Save
      </button>
    </div>
  </form>
</Drawer>

    </AuthenticatedLayout>
  );
}
