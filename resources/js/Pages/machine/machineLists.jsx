import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import React, { useState, useEffect } from "react";
import Select from "react-select";

import { Drawer } from "antd";
import { PlusOutlined, EditOutlined, ReconciliationOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import PhonelinkEraseTwoToneIcon from '@mui/icons-material/PhonelinkEraseTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import BookmarkAddedTwoToneIcon from '@mui/icons-material/BookmarkAddedTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import ScannerTwoToneIcon from '@mui/icons-material/ScannerTwoTone';
import SizeContext from "antd/es/config-provider/SizeContext";
import CreatableSelect from "react-select/creatable";


/* ======================================================
   FIELD CONFIG (SINGLE SOURCE OF TRUTH)
====================================================== */
const FIELD_GROUPS = {
  general: {
    title: "General Information",
    fields: [
      { name: "machine_num", label: "Machine No" },
      { name: "machine_description", label: "Description", type: "select", optionsKey: "machine_description" },
      { name: "machine_feed_type", label: "Feed Type", type: "select", optionsKey: "machine_feed_type" },
      { name: "machine_type", label: "Machine Type", type: "select", optionsKey: "machine_type" },
      { name: "machine_platform", label: "Machine Platform", type: "select", optionsKey: "machine_platform" },
      { name: "category", label: "Category", type: "select", optionsKey: "category" },
      { name: "status", label: "Status", type: "select", optionsKey: "status" },
      { name: "condition", label: "Condition", type: "select", optionsKey: "condition" },
      { name: "pmnt_no", label: "PMNT No" },
      { name: "platform", label: "Platform", type: "select", optionsKey: "platform" },
      { name: "cn_no", label: "CN No" },
      { name: "level", label: "Level", type: "select", optionsKey: "level" },
    ],
  },

  identity: {
    title: "Manufacturer / Identity",
    fields: [
      { name: "oem", label: "OEM", type: "select", optionsKey: "oem" },
      { name: "machine_manufacturer", label: "Manufacturer", type: "select", optionsKey: "machine_manufacturer" },
      { name: "model", label: "Model", type: "select", optionsKey: "model" },
      { name: "serial", label: "Serial" },
      { name: "manufactured_date", label: "Manufactured Date", type: "date" },
      { name: "age", label: "Age", readonly: true },
    ],
  },

  location: {
    title: "Location & Ownership",
    fields: [
      { name: "company_rec_id", label: "Company Rec ID", type: "select", optionsKey: "company_rec_id" },
      { name: "customer_rec_id", label: "Customer Rec ID", type: "select", optionsKey: "customer_rec_id" },
      { name: "orig_loc", label: "Original Location", type: "select", optionsKey: "orig_loc"  },
      { name: "site_loc", label: "Site Location", type: "select", optionsKey: "site_loc"  },
      { name: "location", label: "Current Location", type: "select", optionsKey: "location"  },
      { name: "consigned", label: "Consigned", type: "select", optionsKey: "consigned" },
      { name: "date_transfer", label: "Date Transfer", type: "date" },
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
      { name: "acquired_date", label: "Acquired Date", type: "date" },
      { name: "unit_price", label: "Unit Price" },
      { name: "acquired_amount", label: "Acquired Amount" },
      { name: "useful_life", label: "Useful Life" },
      { name: "monthly_depreciation", label: "Monthly Depreciation" },
      { name: "last_date_depreciation", label: "Last Depreciation Date", type: "date" },
      { name: "netbook_value", label: "Net Book Value" },
    ],
  },

  others: {
    title: "Others",
    fields: [
      { name: "pm_personnel", label: "PM Personnel", type: "select", optionsKey: "pm" },
      { name: "purpose_acquisition", label: "Purpose of Acquisition" },
      { name: "specify_machine_replaced", label: "Specify Machine Replaced" },
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
export default function MachineLists({
  tableData,
  tableFilters,
  emp_data,
  existingMachine,
  existingPMNT,
  existingSerial,
  existingCnum,
  machine_feed_type,
  machine_manufacturer,
  machine_platform,
  machine_description,
  status,
  model,
  machine_type,
  platform,
  category,
  condition,
  level,
  oem,
  company_rec_id,
  customer_rec_id,
  orig_loc,
  site_loc,
  location,
  consigned,
  pm
}) {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [formData, setFormData] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isMachineNumValid, setIsMachineNumValid] = useState(true);
  const [isPMNTValid, setIsPMNTValid] = useState(true);
  const [isSerialValid, setIsSerialValid] = useState(true);
  const [isCnumValid, setIsCnumValid] = useState(true);

  const DROPDOWN_OPTIONS = {
  machine_feed_type,
  machine_manufacturer,
  machine_platform,
  machine_description,
  status,
  model,
  machine_type,
  platform,
  category,
  condition,
  level,
  oem,
  company_rec_id,
  customer_rec_id,
  orig_loc,
  site_loc,
  location,
  consigned,
  pm
};


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

 const isDuplicate = (list, value) =>
  list
    ?.map(v => String(v).toLowerCase())
    .includes(String(value).toLowerCase());

    const calculateAgeLabel = (fromDate) => {
  const start = new Date(fromDate);
  const now = new Date();

  const diffMs = now - start;
  if (diffMs < 0) return "";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
  }

  const diffMonths = Math.floor(diffDays / 30.44);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  }

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  return months > 0
    ? `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`
    : `${years} year${years !== 1 ? "s" : ""}`;
};

useEffect(() => {
  if (!formData.manufactured_date) return;

  setFormData(prev => ({
    ...prev,
    age: calculateAgeLabel(formData.manufactured_date),
  }));
}, [formData.manufactured_date]);



  


const handleChange = e => {
  const { name, value } = e.target;

  // ✅ update formData FIRST
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));

  // validations
  if (name === "machine_num") {
    setIsMachineNumValid(!isDuplicate(existingMachine, value));
  }
  if (name === "pmnt_no") {
    setIsPMNTValid(!isDuplicate(existingPMNT, value));
  }
  if (name === "serial") {
    setIsSerialValid(!isDuplicate(existingSerial, value));
  }
  if (name === "cn_no") {
  if (value === "Calibration not required") {
    setIsCnumValid(true);
  } else {
    setIsCnumValid(!isDuplicate(existingCnum, value));
  }
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
      <Head title="Machine List" />

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold"><ScannerTwoToneIcon style={{fontSize: 45, marginBottom: 10}}/> Machine List</h1>
        <button
          onClick={openAddModal}
          className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
        >
          <PlusOutlined style={{fontSize: 18, fontWeight: "bold"}} /> NEW Machine
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
                    {key: "serial" , label: "serial"},
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
                routeName={route("machine.list.index")}
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
          <span className="text-indigo-600">Update Machine</span>
        </>
      ) : (
        <>
          <ReconciliationOutlined className="text-emerald-600" />
          <span className="text-emerald-600">New Machine</span>
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
  {FIELD_GROUPS[activeTab].fields
    .filter(f => f.name !== "remarks") // exclude remarks here
    .map(f => (
      <div key={f.name}>
        <label className="text-sm text-gray-600">{f.label}</label>

        {f.type === "select" ? (
          <CreatableSelect
            options={Object.entries(DROPDOWN_OPTIONS[f.optionsKey] || {}).map(
              ([value, label]) => ({ value, label })
            )}
            value={
              formData[f.name]
                ? { value: formData[f.name], label: formData[f.name] }
                : null
            }
            onChange={option =>
              setFormData(prev => ({
                ...prev,
                [f.name]: option?.value || "",
              }))
            }
            placeholder={`Select or type ${f.label}`}
            isClearable
            isSearchable
            className="text-sm"
          />
        ) : f.type === "date" ? (
          <input
            type="date"
            name={f.name}
            value={formData[f.name] || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded px-2 py-1 text-lg"
          />
        ) : f.name === "age" ? (
          <input
            type="text"
            value={formData.age || ""}
            readOnly
            className="w-full border rounded px-2 py-1 text-lg bg-gray-100 border-gray-400 cursor-not-allowed"
          />
        ) : (
          <input
            type="text"
            name={f.name}
            value={formData[f.name] || ""}
            onChange={handleChange}
            className="w-full border border-gray-500 rounded px-2 py-1 text-lg"
            required
          />
        )}

        {/* Duplicate warnings */}
        {f.name === "machine_num" && !isMachineNumValid && (
          <p className="text-red-500 text-xs">
            Machine number already exists
          </p>
        )}
        {f.name === "pmnt_no" && !isPMNTValid && (
          <p className="text-red-500 text-xs">
            PMNT number already exists
          </p>
        )}
        {f.name === "serial" && !isSerialValid && (
          <p className="text-red-500 text-xs">
            Serial number already exists
          </p>
        )}
        {f.name === "cn_no" && 
          !isCnumValid && 
          formData.cn_no !== "Calibration not required" && (
            <p className="text-red-500 text-xs">
              CN number already exists
            </p>
        )}

      </div>
    ))}
</div>


    {/* REMARKS (full width, 1 column) */}
{FIELD_GROUPS[activeTab].fields.some(f => f.name === "remarks") && (
  <div className="grid grid-cols-1 gap-4 mt-4">
    <div>
      <label className="text-sm text-gray-600">
        {FIELD_GROUPS[activeTab].fields.find(f => f.name === "remarks").label}
      </label>
      <textarea
        name="remarks"
        value={formData.remarks || ""}
        onChange={handleChange}
        className="w-full h-32 border border-gray-500 rounded px-2 py-1 text-lg"
      />
    </div>
  </div>
)}

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
  disabled={!isMachineNumValid || !isPMNTValid || !isSerialValid || !isCnumValid }
  className={`px-4 py-2 rounded text-white ${
    !isMachineNumValid || !isPMNTValid || !isSerialValid || !isCnumValid 
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-emerald-500 hover:bg-emerald-600"
  }`}
>
  <BookmarkAddedTwoToneIcon /> Save
</button>

    </div>
  </form>
</Drawer>

    </AuthenticatedLayout>
  );
}
