import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { Camera, Save, IndianRupee } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const functionTypeOptions = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "corporate", label: "Corporate" },
];

const initialFormState = {
  functionName: "",
  functionType: null,
  timeFrom: "",
  timeTo: "",
  price: "",
  coverImageFile: null,
  coverImagePreview: "",
};

const MAX_FILE_SIZE_MB = 5;

const AddFunctionModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        functionName: initialData.functionName || "",
        functionType: null, // map from initialData.type -> value if needed
        timeFrom: initialData.timeFrom || "",
        timeTo: initialData.timeTo || "",
        price: String(initialData.price ?? ""),
        coverImageFile: null,
        coverImagePreview: initialData.coverImage || "",
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
    setFileError("");
  }, [open, initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm(initialFormState);
    setFileError("");
    onClose();
  };

  const handleSave = () => {
    if (!form.functionName.trim()) return;
    onSave?.({
      ...form,
      functionType:
        functionTypeOptions.find((o) => o.value === form.functionType) || null,
    });
    setForm(initialFormState);
  };

  const processFile = (file) => {
    if (!file) return;
    setFileError("");

    const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    if (!isValidType) {
      setFileError("Only JPG and PNG files are supported.");
      return;
    }

    const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!isValidSize) {
      setFileError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      coverImageFile: file,
      coverImagePreview: previewUrl,
    }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={640}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <Save size={16} />
            {isEditMode ? "Update Function" : "Save Function"}
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pt-2 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-5 px-4 pt-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Function" : "Add Function"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new ritual or segment for your event itinerary.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="px-4 space-y-6">
          {/* Basic Information */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={form.functionName}
                onChange={(e) => updateField("functionName", e.target.value)}
                placeholder="Function Name"
                className={inputClass}
              />
              <Select
                value={form.functionType}
                onChange={(val) => updateField("functionType", val)}
                placeholder="Function Type"
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={functionTypeOptions}
              />
            </div>
          </Section>

          {/* Schedule Details */}
          <Section title="Schedule Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time From</label>
                <input
                  type="time"
                  value={form.timeFrom}
                  onChange={(e) => updateField("timeFrom", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time To</label>
                <input
                  type="time"
                  value={form.timeTo}
                  onChange={(e) => updateField("timeTo", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </Section>

          {/* Media */}
          <Section title="Media">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-[#7A2E45] bg-[#FBF1F3]"
                  : "border-gray-400 bg-[#FDF9FA] hover:bg-[#FBF1F3]"
              }`}
            >
              {form.coverImagePreview ? (
                <img
                  src={form.coverImagePreview}
                  alt="Cover preview"
                  className="h-32 w-full max-w-xs rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E5EA] text-[#7A2E45]">
                  <Camera size={20} />
                </div>
              )}
              <p className="text-sm text-gray-600">
                Drag &amp; drop cover image or{" "}
                <span className="text-[#7A2E45] font-medium">Browse Files</span>
              </p>
              <p className="text-xs text-gray-400">JPG, PNG up to {MAX_FILE_SIZE_MB}MB</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            {fileError && (
              <p className="text-xs text-red-500 mt-2">{fileError}</p>
            )}
          </Section>

          {/* Pricing Strategy */}
          <Section title="Pricing Strategy">
            <div className="relative">
              <IndianRupee
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`${inputClass} pl-9`}
              />
            </div>
          </Section>
        </div>
      </div>
    </CustomModal>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const inputClass =
  "w-full rounded-lg border border-gray-400 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]";

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="h-3.5 w-1 rounded-full bg-[#7A2E45]" />
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export { AddFunctionModal };