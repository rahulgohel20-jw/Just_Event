import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { Save, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { addupadtecashaccount } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  accountName: "",
  description: "",
  openingBalance: "",
  openingDate: dayjs(),
  isPrimary: false,
};

const AddCashAccount = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    setErrors({});
    if (initialData) {
      setForm({
        accountName: initialData.accountName || "",
        description: initialData.description || "",
        openingBalance: initialData.openingBalance ?? "",
        openingDate: initialData.openingDate
          ? dayjs(initialData.openingDate, "DD/MM/YYYY")
          : dayjs(),
        isPrimary: initialData.isPrimary ?? false,
      });
    } else {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.accountName.trim()) {
      nextErrors.accountName = "Account name is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const userId = Number(localStorage.getItem("userId")) || 0;
    const openingBalance = Number(form.openingBalance) || 0;

    const payload = {
      id: initialData?.id ?? null,
      accountName: form.accountName,
      description: form.description,
      openingBalance,
      // on create, current balance starts equal to opening balance;
      // on edit, keep whatever the backend already has for it
      currentBalance: isEditMode
        ? initialData?.currentBalance ?? openingBalance
        : openingBalance,
      isPrimary: form.isPrimary,
      userId,
    };

    setSaving(true);
    try {
      const res = await addupadtecashaccount(payload);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Cash Account Updated" : "Cash Account Saved",
        fallbackSuccess: "Operation completed successfully.",
        errorTitle: "Failed",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          setForm(initialFormState);
          onClose?.();
        },
      });

      if (!success) {
        // stays open so the user can fix the input and retry
        return;
      }
    } catch (err) {
      console.error("Failed to save cash account:", err);
      showApiError(err, {
        title: "Failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={600}
      centered
      title={null}
      footer={
        <div className="flex justify-end items-center gap-3 px-6 pb-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-primary">
            {isEditMode ? "Edit Cash Account Details" : "Add Cash Account Details"}
          </h2>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        {/* Account Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-1.5 block">
            <span className="text-red-500 mr-0.5">*</span>Account Name
          </label>
          <input
            type="text"
            value={form.accountName}
            onChange={(e) => handleChange("accountName", e.target.value)}
            placeholder="Enter name"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
              errors.accountName ? "border-red-400" : "border-primary/40"
            }`}
          />
          {errors.accountName && (
            <p className="text-xs text-red-500 mt-1">{errors.accountName}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-1.5 block">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Opening Balance + Opening Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              Opening Balance
            </label>
            <input
              type="number"
              value={form.openingBalance}
              onChange={(e) => handleChange("openingBalance", e.target.value)}
              placeholder="Enter opening balance"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              Opening Date
            </label>
            <DatePicker
              value={form.openingDate}
              onChange={(date) => handleChange("openingDate", date || dayjs())}
              format="DD/MM/YYYY"
              className="w-full !py-2.5"
              allowClear={false}
            />
          </div>
        </div>

        {/* Is Primary Account toggle */}
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-gray-700">Is Primary Account?</label>
          <button
            type="button"
            onClick={() => handleChange("isPrimary", !form.isPrimary)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isPrimary ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isPrimary ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddCashAccount };