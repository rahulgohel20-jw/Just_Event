import { useEffect, useRef, useState } from "react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import {
  X,
  Calendar,
  UserRound,
  UploadCloud,
  CircleAlert,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { AddFollowUp } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const DESCRIPTION_LIMIT = 500;

// TODO: swap for a real manager-master API call once one exists.
const STATIC_MANAGERS = [
  { id: 1, name: "Himanshu Sharma" },
  { id: 2, name: "Amit Raj" },
  { id: 3, name: "Priya Mehta" },
  { id: 4, name: "Rohit Patel" },
];

const initialFormState = {
  followManagerId: null,
  description: "",
  followDate: null,
  file: null,
};

const AddFollowUpModal = ({ open, onClose, onSave, eventId }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const userId = Number(localStorage.getItem("userId")) || 0;
  const today = dayjs();

  useEffect(() => {
    if (!open) return;
    setForm(initialFormState);
    setErrors({});
  }, [open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    onClose?.();
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    handleChange("file", file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.followManagerId) nextErrors.followManagerId = "Follow manager is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.followDate) nextErrors.followDate = "Follow date is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      id: null,
      eventId: Number(eventId),
      followManagerId: form.followManagerId,
      description: form.description,
      followDate: form.followDate.format("YYYY-MM-DD"),
      userId,
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (form.file) {
      formData.append("files", form.file);
    }

    setSaving(true);
    try {
      const res = await AddFollowUp(formData);

      const success = showApiResult(res, {
        successTitle: "Follow-up Added",
        fallbackSuccess: "Follow-up scheduled successfully.",
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
      console.error("Failed to save follow-up:", err);
      showApiError(err, { title: "Failed to save follow-up" });
    } finally {
      setSaving(false);
    }
  };

  const managerOptions = STATIC_MANAGERS.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={480}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center gap-3 px-6 pb-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Save Changes
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-dark m-0">Follow-up Details</h2>
            <p className="text-xs text-gray-500 mt-1 m-0">
              Create and schedule a follow-up reminder.
            </p>
          </div>
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600 mt-1">
            <X size={18} />
          </button>
        </div>

        {/* Created Date */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Created Date</label>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-500">
            <Calendar size={16} className="text-gray-400" />
            {today.format("D.M.YYYY")}
          </div>
        </div>

        {/* Follow Manager */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Follow Manager<span className="text-red-500 ml-0.5">*</span>
          </label>
          <Select
            value={form.followManagerId ?? undefined}
            onChange={(v) => handleChange("followManagerId", v)}
            options={managerOptions}
            placeholder={
              <span className="flex items-center gap-2 text-gray-400">
                <UserRound size={15} />
                Select Follow Manager
              </span>
            }
            className="w-full"
            size="large"
            status={errors.followManagerId ? "error" : undefined}
          />
          {errors.followManagerId && (
            <p className="text-xs text-red-500 mt-1">{errors.followManagerId}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Description<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <textarea
              value={form.description}
              onChange={(e) => {
                if (e.target.value.length <= DESCRIPTION_LIMIT) {
                  handleChange("description", e.target.value);
                }
              }}
              rows={4}
              placeholder="Add details about this follow-up..."
              className={`w-full border rounded-lg px-3 py-2.5 pb-6 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.description ? "border-red-400" : "border-gray-300"
              }`}
            />
            <span className="absolute bottom-2 right-3 text-[11px] text-gray-400">
              {form.description.length} / {DESCRIPTION_LIMIT}
            </span>
          </div>
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Follow Date */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Follow Date<span className="text-red-500 ml-0.5">*</span>
          </label>
          <DatePicker
            value={form.followDate}
            onChange={(date) => handleChange("followDate", date)}
            format="DD/MM/YYYY"
            placeholder="Select follow-up date"
            suffixIcon={<Calendar size={15} className="text-gray-400" />}
            className="w-full !py-2.5"
            status={errors.followDate ? "error" : undefined}
          />
          <p className="text-[11px] text-gray-400 mt-1">
            A reminder will be generated for this date.
          </p>
          {errors.followDate && (
            <p className="text-xs text-red-500 mt-1">{errors.followDate}</p>
          )}
        </div>

        {/* Upload File */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Upload File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50"
            }`}
          >
            {form.file ? (
              <>
                <FileText size={22} className="text-primary" />
                <p className="text-sm font-medium text-primary m-0">{form.file.name}</p>
                <p className="text-xs text-gray-400 m-0">Click to replace</p>
              </>
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <UploadCloud size={18} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-primary m-0">Upload attachment</p>
                <p className="text-xs text-gray-400 m-0">PDF, JPG, PNG or DOCX</p>
              </>
            )}
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 rounded-lg bg-danger-lighter px-3 py-2.5">
          <CircleAlert size={15} className="text-danger shrink-0" />
          <p className="text-xs text-danger m-0">
            Reminder will not be generated if Follow Date is left blank.
          </p>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddFollowUpModal };