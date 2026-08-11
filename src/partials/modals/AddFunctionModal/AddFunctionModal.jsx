import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { Camera, Save, IndianRupee ,Loader2  } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; 
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { addupadtefunctionmaster } from "@/services/apiServices";
const functionTypeOptions = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "corporate", label: "Corporate" },
];

const initialFormState = {
  functionName: { english: "", hindi: "", gujarati: "" }, // was: ""
  functionType: null,
  timeFrom: "",
  timeTo: "",
  price: "",
   coverImageFiles: [],     // was: coverImageFile: null
  coverImagePreviews: [], 
};
const MAX_FILE_SIZE_MB = 5;

const AddFunctionModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(initialData);
  const [saving, setSaving] = useState(false);
const userId = Number(localStorage.getItem("userId"));

useEffect(() => {
  if (open && initialData) {
    setForm({
      functionName: {
        english: initialData.functionName || initialData.functionNameEnglish || "",
        hindi: initialData.functionNameHindi || "",
        gujarati: initialData.functionNameGujarati || "",
      },
      functionType: null,
      timeFrom: initialData.timeFrom || "",
      timeTo: initialData.timeTo || "",
      price: String(initialData.price ?? ""),
      coverImageFiles: [],
      coverImagePreviews: initialData.coverImages || [], // adjust key to match your API's response field
    });
  } else if (open && !initialData) {
    setForm(initialFormState);
  }
  setFileError("");
}, [open, initialData]);

const MAX_FILES = 6; // adjust to whatever limit makes sense

const processFiles = (fileList) => {
  const incoming = Array.from(fileList || []);
  if (!incoming.length) return;
  setFileError("");

  const validFiles = [];
  for (const file of incoming) {
    const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    if (!isValidType) {
      setFileError("Only JPG and PNG files are supported.");
      continue;
    }
    const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!isValidSize) {
      setFileError(`Each file must be under ${MAX_FILE_SIZE_MB}MB.`);
      continue;
    }
    validFiles.push(file);
  }

  if (!validFiles.length) return;

  setForm((prev) => {
    const combined = [...prev.coverImageFiles, ...validFiles].slice(0, MAX_FILES);
    const newPreviews = combined.map((f) =>
      typeof f === "string" ? f : URL.createObjectURL(f)
    );
    return {
      ...prev,
      coverImageFiles: combined,
      coverImagePreviews: newPreviews,
    };
  });
};

const handleFileInputChange = (e) => {
  processFiles(e.target.files);
  e.target.value = ""; // allow re-selecting the same file after removal
};

const handleDrop = (e) => {
  e.preventDefault();
  setIsDragging(false);
  processFiles(e.dataTransfer.files);
};

const removeImage = (index) => {
  setForm((prev) => {
    const files = prev.coverImageFiles.filter((_, i) => i !== index);
    const previews = prev.coverImagePreviews.filter((_, i) => i !== index);
    return { ...prev, coverImageFiles: files, coverImagePreviews: previews };
  });
};
  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm(initialFormState);
    setFileError("");
    onClose();
  };
const handleFunctionNameChange = (name, updatedValue) => {
  setForm((prev) => ({ ...prev, [name]: updatedValue }));
};

const handleTranslate = async (englishText) => {
  try {
    const res = await Translateapi(englishText);
    const data = res?.data ?? res;
    return {
      hindi: data?.hindi,
      gujarati: data?.gujarati,
    };
  } catch (err) {
    console.error("Failed to translate function name:", err);
    return null;
  }
};

const handleSave = async () => {
  if (!form.functionName.english.trim()) return;

  const payload = {
    id: initialData?.id ?? null,
    nameEnglish: form.functionName.english,
    nameGujarati: form.functionName.gujarati,
    nameHindi: form.functionName.hindi,
    timeFrom: form.timeFrom,
    timeTo: form.timeTo,
    userId
  };


  // Send `data` as a binary Blob (application/json) rather than a plain string,
  // since the backend expects it as a distinct multipart part with its own
const formData = new FormData();
const dataBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
formData.append("data", dataBlob);

form.coverImageFiles.forEach((file) => {
  formData.append("images", file); // same key repeated = array on the backend
});

  setSaving(true);
  try {
    const res = await addupadtefunctionmaster(formData);

    const success = showApiResult(res, {
      successTitle: isEditMode ? "Function Updated" : "Function Saved",
      fallbackSuccess: "Operation completed successfully.",
      errorTitle: "Failed",
      onSuccess: () => {
        const body = res?.data ?? res;
        onSave?.(body?.data ?? body);
        setForm(initialFormState);
        onClose?.();
      },
    });

    if (!success) return;
  } catch (err) {
    console.error("Failed to save function:", err);
    showApiError(err, { title: "Failed" });
  } finally {
    setSaving(false);
  }
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
  disabled={saving}
  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
>
  {saving ? (
    <Loader2 size={16} className="animate-spin" />
  ) : (
    <Save size={16} />
  )}
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
           <div className="md:col-span-2">
  <MultiLangInputBox
    label="Function Name"
    name="functionName"
    value={form.functionName}
    onChange={handleFunctionNameChange}
    onTranslate={handleTranslate}
    required
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
  {form.coverImagePreviews.length > 0 && (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
      {form.coverImagePreviews.map((src, i) => (
        <div key={i} className="relative group">
          <img
            src={src}
            alt={`Function image ${i + 1}`}
            className="h-24 w-full rounded-lg object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7A2E45] text-white text-xs opacity-90 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}

  {form.coverImagePreviews.length < MAX_FILES && (
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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E5EA] text-[#7A2E45]">
        <Camera size={20} />
      </div>
      <p className="text-sm text-gray-600">
        Drag &amp; drop images or{" "}
        <span className="text-[#7A2E45] font-medium">Browse Files</span>
      </p>
      <p className="text-xs text-gray-400">
        JPG, PNG up to {MAX_FILE_SIZE_MB}MB each · up to {MAX_FILES} images
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )}
  {fileError && <p className="text-xs text-red-500 mt-2">{fileError}</p>}
</Section>

          {/* Pricing Strategy */}
        
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