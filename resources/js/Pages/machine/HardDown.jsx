import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useState } from "react";
import { Modal, Select, Button } from "antd";
import {
    SaveOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

export default function HardDown({
    tableData,
    tableFilters,
    emp_data,
    errors,
    machines = [], // 👈 safe default
}) {

    

    // --- MODAL STATE ---
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openHandle, setOpenHandle] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // --- VIEW MODAL STATE ---
const [viewItem, setViewItem] = useState(null);
const [timeline, setTimeline] = useState([]);

// derived value (SAFE na)
const headerItem = timeline[0] || viewItem;
const [previewImage, setPreviewImage] = useState(null);
const [imageModalOpen, setImageModalOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);





    // --- FORM STATES ---
    const [machineNum, setMachineNum] = useState(null);
    const [platform, setPlatform] = useState("");
    const [model, setModel] = useState("");
    const [location, setLocation] = useState("");
    const [pmnt_no, setpmnt_no] = useState("");
    const [packageName, setPackageName] = useState("N/A");
    const [process, setProcess] = useState("N/A");
    const [status, setStatus] = useState("");

    // --- DROPDOWN STATE (ACTION COLUMN) ---
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    // --- RESET FORM ---
    const resetForm = () => {
        setMachineNum(null);
        setPlatform("");
        setModel("");
        setLocation("");
        setpmnt_no("");
        setPackageName("N/A");
        setProcess("N/A");
        setStatus("");
    };

    // --- MACHINE AUTO FILL (ANTD SELECT) ---
    const handleMachineChange = (value) => {
        setMachineNum(value);

        const machine = machines.find(
            (m) => m.machine_num === value
        );

        if (machine) {
            setPlatform(machine.platform);
            setModel(machine.model);
            setLocation(machine.location);
            setpmnt_no(machine.pmnt_no || "");
        } else {
            setPlatform("");
            setModel("");
            setLocation("");
            setpmnt_no("");
        }
    };

    // --- ADD SUBMIT ---
    const handleAddSubmit = () => {
    setSubmitting(true);

    router.post(
        route("harddown.store"),
        {
            machine_num: machineNum,
            platform,
            model,
            location,
            pmnt_no,
            package: packageName,
            process,
            status,
            machine_problem: machineProblem,
        },
        {
            onFinish: () => setSubmitting(false),
            onSuccess: () => {
                resetForm();
                setOpenAddModal(false);
            },
        }
    );
};

// --- HANDLE MODAL STATE ---
const [currentItem, setCurrentItem] = useState(null);
const [machineProblem, setMachineProblem] = useState("");
const [identifiedError, setIdentifiedError] = useState("");
const [solutionRemarks, setSolutionRemarks] = useState("");
const [attachment, setAttachment] = useState(null);
const [statusHandle, setStatusHandle] = useState(""); // renamed from handledBy

const openHandleModal = (item) => {
    setCurrentItem(item); // Save the row data
    setMachineProblem(item.machine_problem || "");
    setIdentifiedError(item.identified_error || "");
    setSolutionRemarks(item.solution_remarks || "");
    setStatusHandle(item.status || ""); // prefill if any
    setOpenHandle(true);
};

const handleSubmitHandle = () => {
    if (!currentItem) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('harddown_id', currentItem.id);
    formData.append('machine_num', currentItem.machine_num);
    formData.append('machine_platform', currentItem.platform);
    formData.append('pmnt_no', currentItem.pmnt_no);
    formData.append('machine_problem', machineProblem);
    formData.append('identified_error', identifiedError);
    formData.append('solution_remarks', solutionRemarks);
    formData.append('status', statusHandle);
    if (attachment) formData.append('attachment', attachment);

    router.post(route("harddown.handle", { id: currentItem.harddown_id }), formData, {
        onFinish: () => setSubmitting(false),
        onSuccess: () => {
            setOpenHandle(false);
            setCurrentItem(null);
            setMachineProblem("");
            setIdentifiedError("");
            setSolutionRemarks("");
            setStatusHandle("");
            setAttachment(null);
        },
    });
};


        const STATUS_STYLES = {
    "active": "text-green-700 border-green-600 bg-green-100 hover:bg-green-700 hover:text-white",

    "cold shutdown": "text-yellow-700 border-yellow-600 bg-yellow-100 hover:bg-yellow-700 hover:text-white",

    "hard shutdown": "text-red-700 border-red-600 bg-red-100 hover:bg-red-700 hover:text-white",
};


const getStatusClass = (status) => {
    if (!status) return "text-slate-500 border-slate-400 bg-slate-100";

    return (
        STATUS_STYLES[status.trim().toLowerCase()] ||
        "text-purple-700 border-purple-600 bg-purple-100 hover:bg-purple-700 hover:text-white"
    );
};

// console.log(item.id);



const handleDelete = (id) => {
  if (confirm("Are you sure you want to delete this Item?")) {
    router.put(route("harddown.delete", id), {
      preserveScroll: true,
      onSuccess: () => {
        alert("✅ Harddown deleted successfully.");
        window.location.reload();
      },
    });
  }
};



       // --- DATA WITH ACTION BUTTONS ---
    const dataWithAction = tableData.data.map((item) => ({
        ...item,
        // 🔸 status badge
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
        action:
            emp_data &&
            ["superadmin", "admin"].includes(emp_data?.emp_role) ? (
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

                            {/* <button
                                onClick={() => {
                                    openEditModal(item);
                                    setDropdownOpen(null);
                                }}
                                className="block w-full text-left px-3 py-1 text-sm hover:bg-yellow-600 bg-yellow-500 text-white rounded border border-2 border-yellow-900"
                            >
                                <i className="fa fa-edit mr-2"></i> Edit
                            </button> */}

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
               <div className="flex gap-2 "> 
                <button
                    onClick={() => openViewModal(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                    <i className="fas fa-eye mr-1"></i> View
                </button>
                {item.status?.trim().toLowerCase() !== "active" && (
  <button
    onClick={() => openHandleModal(item)}
    className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-600 text-sm"
  >
    <i className="fas fa-tools mr-1"></i> Handle
  </button>
)}

               </div>

                
            ),
    }));

const openViewModal = (item) => {
    setViewItem(item);
    setOpenView(true);
    setTimeline([]); // reset timeline bago mag-fetch

    axios
    .get(route("harddown.history", item.id))
    .then((res) => {
        // console.log("Fetched timeline:", res.data);
        setTimeline(res.data || []);
    })
    .catch((err) => {
        // console.error("Timeline fetch error:", err.response?.data || err.message);
        setTimeline([]);
    });

};


    return (
        <AuthenticatedLayout>
            <Head title="Manage Hard Down List" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-solid fa-turn-down mr-2"></i>
                    Hard Down List
                </h1>

                <button
                    onClick={() => setOpenAddModal(true)}
                    className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-700"
                >
                    <i className="fas fa-plus mr-1"></i>
                    New Down Machine
                </button>
            </div>

            

            {/* ================= TABLE ================= */}
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

  {/* ================= ADD MODAL (ANTD - CUSTOM) ================= */}
<Modal
    title={
        <div className="flex items-center gap-2 text-green-700">
            <i className="fa-solid fa-file-circle-plus"></i>
            <span>New Hard Down Machine</span>
        </div>
    }
    open={openAddModal}
    footer={null} // ❌ disable default OK / Cancel
    onCancel={() => {
        resetForm();
        setOpenAddModal(false);
    }}
    width={700}
>
    <div className="grid grid-cols-2 gap-4">
        {/* MACHINE SELECT */}
        <div className="col-span-3" >
            <label className="block text-sm font-medium mb-1">
                Machine ID
            </label>
            <Select
                showSearch
                allowClear
                placeholder="Search Machine..."
                value={machineNum}
                onChange={handleMachineChange}
                className="w-full p-2 border rounded border-gray-600"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
            >
                {machines.map((m) => (
                    <Select.Option key={m.id} value={m.machine_num}>
                        {m.machine_num}
                    </Select.Option>
                ))}
            </Select>
            {errors?.machine_num && (
                <p className="text-red-500 text-sm">
                    {errors.machine_num}
                </p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium">Platform</label>
            <input
                value={platform}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Model</label>
            <input
                value={model}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Location</label>
            <input
                value={location}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">PMNT No.</label>
            <input
                value={pmnt_no}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Package</label>
            <input
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full p-2 border rounded"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Process</label>
            <input
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full p-2 border rounded"
            />
        </div>

        <div className="col-span-3">
            <label className="block text-sm font-medium">Machine Encounter</label>
            <textarea
                value={machineProblem}
                onChange={(e) => setMachineProblem(e.target.value)}
                className="w-full p-2 border rounded"
            />
        </div>
        <div className="col-span-3">
  <label className="block text-sm font-medium mb-1">Status</label>
  <Select
    showSearch
    value={status}
    onChange={(value) => setStatus(value)}
    placeholder="Select Status"
    className="w-full p-3 border rounded border-gray-600"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
  >
    <Option value="HARD SHUTDOWN">HARD SHUTDOWN</Option>
    <Option value="COLD SHUTDOWN">COLD SHUTDOWN</Option>
    <Option value="Under Restoration">Under Restoration</Option>
    <Option value="For Qualification">For Qualification</Option>
    <Option value="In-Active">In-Active</Option>
  </Select>
</div>
    </div>

    {/* ===== CUSTOM FOOTER BUTTONS ===== */}
    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <Button
            color="danger"
            variant="solid"
            className="border-2 border-red-500"
            icon={<CloseCircleOutlined />}
            onClick={() => {
                resetForm();
                setOpenAddModal(false);
            }}
        >
            Cancel
        </Button>

        <Button
            color="green"
            variant="solid"
            icon={<SaveOutlined />}
            loading={submitting}
            className="border-2 border-green-700"
            onClick={handleAddSubmit}
            disabled={!machineNum || !status}
        >
            Submit
        </Button>
    </div>
</Modal>

 {/* ================= HANDLE MODAL ================= */}
<Modal
    title={
        <div className="flex items-center gap-2 text-orange-700">
            <i className="fas fa-tools"></i>
            <span>Handle Machine</span>
        </div>
    }
    open={openHandle}
    footer={null}
    onCancel={() => setOpenHandle(false)}
    width={700}
>
    {/* Machine info */}
    <div className="grid grid-cols-3 gap-4">
        <div>
            <label className="block text-sm font-medium">Machine ID</label>
            <input
                value={currentItem?.machine_num || ""}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Platform</label>
            <input
                value={currentItem?.platform || ""}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">PMNT No.</label>
            <input
                value={currentItem?.pmnt_no || ""}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
            />
        </div>
    </div>

    {/* Problem / error / solution */}
    <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-3">
            <label className="block text-sm font-medium">Machine Problem</label>
            <textarea
                value={machineProblem}
                onChange={(e) => setMachineProblem(e.target.value)}
                className="w-full p-2 border rounded h-28 bg-gray-100"
                readOnly
            />
        </div>

        <div className="col-span-3">
            <label className="block text-sm font-medium">Identified Error</label>
            <textarea
                value={identifiedError}
                onChange={(e) => setIdentifiedError(e.target.value)}
                className="w-full p-2 border rounded h-28"
            />
        </div>

        <div className="col-span-3">
            <label className="block text-sm font-medium">Solution Remarks</label>
            <textarea
                value={solutionRemarks}
                onChange={(e) => setSolutionRemarks(e.target.value)}
                className="w-full p-2 border rounded h-28"
            />
        </div>

        <div className="col-span-3">
  <label className="block text-sm font-medium">Attachment Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setAttachment(e.target.files[0])}
    className="w-full p-2 border rounded"
  />
</div>


        {/* STATUS SELECT */}
<div className="col-span-3">
    <label className="block text-sm font-medium">Status</label>
    <Select
        value={statusHandle}
        onChange={(value) => setStatusHandle(value)}
        className="w-full"
        placeholder="Select Status"
    >
        <Option value="HARD SHUTDOWN">HARD SHUTDOWN</Option>
        <Option value="COLD SHUTDOWN">COLD SHUTDOWN</Option>
        <Option value="ACTIVE">ACTIVE</Option>
    </Select>
</div>

    </div>

    {/* Footer buttons */}
    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <Button
            color="danger"
            variant="solid"
            className="border-2 border-red-500"
            icon={<CloseCircleOutlined />}
            onClick={() => setOpenHandle(false)}
        >
            Cancel
        </Button>

        <Button
            color="green"
            variant="solid"
            icon={<SaveOutlined />}
            loading={submitting}
            className="border-2 border-green-700"
            onClick={handleSubmitHandle}
            disabled={!machineProblem || !identifiedError || !solutionRemarks || !statusHandle || !attachment}
        >
            Submit
        </Button>
    </div>
</Modal>

{/* ================= VIEW MODAL ================= */}
<Modal
  title={
    <div className="flex items-center gap-2 text-blue-700">
      <i className="fas fa-history"></i>
      <span>Machine History Timeline</span>
    </div>
  }
  open={openView}
  footer={null}
  onCancel={() => setOpenView(false)}
  width={1500}
  style={{ top: 20, height: '100vh' }}
>
  {/* ================= MACHINE HEADER INFO ================= */}
  <div className="grid grid-cols-3 gap-4 mb-6 bg-white p-2 rounded shadow border border-gray-200 text-center">
    <div>
      <label className="text-xs font-semibold text-gray-600">Machine ID</label>
      <div className="font-medium">{headerItem?.machine_num || "-"}</div>
    </div>

    <div>
      <label className="text-xs font-semibold text-gray-600">Platform</label>
      <div className="font-medium">{headerItem?.machine_platform || "-"}</div>
    </div>

    <div>
      <label className="text-xs font-semibold text-gray-600">PMNT No.</label>
      <div className="font-medium">{headerItem?.pmnt_no || "-"}</div>
    </div>
  </div>

  {/* ================= TIMELINE ================= */}
  <div className="relative border-l-2 border-gray-300 ml-4 space-y-8 max-h-[520px] overflow-y-auto pr-4">
    {timeline.length === 0 && (
      <p className="text-gray-500 ml-6">No history available.</p>
    )}

    {timeline.map((item, index) => (
      <div key={index} className="relative pl-10">
        {/* DOT */}
        <span
          className={`absolute -left-[9px] top-2 w-5 h-5 rounded-full border-4 border-white ${
            item.status?.toLowerCase() === "active"
              ? "bg-green-500"
              : item.status?.toLowerCase().includes("hard shutdown")
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        />

        {/* CARD */}
        <div className="bg-white border rounded-lg shadow-sm p-4 relative">
          {/* STATUS + DATE */}
          <div className="flex justify-between items-center mb-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded border ${
                item.status?.toLowerCase() === "active"
                  ? "text-green-700 bg-green-100 border-green-400"
                  : item.status?.toLowerCase().includes("hard shutdown")
                  ? "text-red-700 bg-red-100 border-red-400"
                  : "text-yellow-700 bg-yellow-100 border-yellow-400"
              }`}
            >
              {item.status}
            </span>

            <span className="text-xs text-gray-500">{item.created_at}</span>
          </div>

          {/* ================= DETAILS TABLE ================= */}
          <table className="min-w-full border border-gray-300 rounded-lg text-sm">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Handled At</td>
                <td className="px-4 py-2 font-semibold">Machine Problem</td>
                <td className="px-4 py-2 font-semibold">Identified Error</td>
                <td className="px-4 py-2 font-semibold">Solution/ Remarks</td>
                <td className="px-4 py-2 font-semibold">Handled By</td>
                <td className="px-4 py-2 font-semibold">Attachment</td>
              </tr>

              <tr className="border-b align-top">
                <td className="px-4 py-2">
                  {item.date_created
                    ? new Date(item.date_created).toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })
                    : "-"}
                </td>
                <td className="px-4 py-2">
                    <div className="whitespace-pre-wrap text-sm bg-white p-2 rounded border-none">
                        {item.machine_problem || "-"}
                    </div>
                </td>
                <td className="px-4 py-2">
                    <div className="whitespace-pre-wrap text-sm bg-white p-2 rounded border-none">
                        {item.identified_error || "-"}
                    </div>
                </td>
                <td className="px-4 py-2">
                    <div className="whitespace-pre-wrap text-sm bg-white p-2 rounded border-none">
                        {item.solution_remarks || "-"}
                    </div>
                </td>
                <td className="px-4 py-2">{item.handled_by || "-"}</td>

                {/* ATTACHMENT */}
               <td className="px-4 py-2">
  {item.attachment_url ? (
    <img
      src={item.attachment_url}
      alt="Attachment"
      className="w-12 h-12 object-cover rounded cursor-pointer border hover:scale-110 transition"
      onClick={() => {
        setSelectedImage(item.attachment_url);
        setImageModalOpen(true);
      }}
    />
  ) : (
    "-"
  )}
</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>

  {/* ================= FOOTER ================= */}
  <div className="flex justify-end mt-6">
    <Button
      color="danger"
      variant="solid"
      className="border-2 border-red-500"
      icon={<CloseCircleOutlined />}
      onClick={() => setOpenView(false)}
    >
      Close
    </Button>
  </div>
</Modal>

<Modal
  open={imageModalOpen}
  footer={null}
  onCancel={() => {
    setImageModalOpen(false);
    setSelectedImage(null);
  }}
  width="90vw"
  style={{ maxWidth: "1200px" }}
  centered
>
  <div className="flex justify-center items-center w-full h-[80vh]">
    {selectedImage && (
      <img
        src={selectedImage}
        alt="Attachment Preview"
        className="w-full h-full object-contain rounded shadow"
      />
    )}
  </div>
</Modal>
        </AuthenticatedLayout>
    );
}
