import { useEffect, useState } from "react";
import { Percent, Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { addupadtetaxmaster, Translateapi } from "@/services/apiServices"; 
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  taxName: { english: "", hindi: "", gujarati: "" },
  taxPercentage: "",
  isActive: true,
};

const AddTaxModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);
  const STATIC_USER_ID = 1;

  useEffect(() => {
    if (open && initialData) {
      setForm({
        taxName: {
          english: initialData.taxName || initialData.taxNameEnglish || "",
          hindi: initialData.taxNameHindi || "",
          gujarati: initialData.taxNameGujarati || "",
        },
        taxPercentage: String(initialData.percentage ?? ""),
        isActive: initialData.isActive ?? true,
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTaxNameChange = (name, updatedValue) => {
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
      console.error("Failed to translate tax name:", err);
      return null;
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

const handleSave = async () => {
  const payload = {
    id: initialData?.id ?? null,
    isActive: form.isActive,
    status: form.isActive,
    percentage: Number(form.taxPercentage),
    taxNameEnglish: form.taxName.english,
    taxNameGujarati: form.taxName.gujarati,
    taxNameHindi: form.taxName.hindi,
    userId: STATIC_USER_ID,
  };

  setSaving(true);
  try {
    const res = await addupadtetaxmaster(payload);

    const success = showApiResult(res, {
      successTitle: isEditMode ? "Tax Updated" : "Tax Saved",
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
    console.error("Failed to save tax:", err);
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
      width={720}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-primary font-medium  transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium  transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isEditMode ? "Update Tax" : "Save Tax"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Tax" : "Add Tax"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update tax configurations used across quotations,
              invoices, and event billing.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="mb-6">
          <MultiLangInputBox
            label="Tax Name"
            name="taxName"
            value={form.taxName}
            onChange={handleTaxNameChange}
            onTranslate={handleTranslate}
            required
          />
          <p className="text-xs text-gray-400 mt-2">e.g., CGST, SGST, VAT</p>
        </div>

       <div className="flex items-end gap-4">
  <div className="relative flex-1">
    <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
      Tax Percentage
     
    </label>
    <div className="relative">
      <Percent
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="tell"
        value={form.taxPercentage}
        onChange={(e) => updateField("taxPercentage", e.target.value)}
        placeholder="Tax Percentage"
        min="0"
        max="100"
        step="0.01"
        className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
      />
   
    </div>
  </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-600">
              {form.isActive ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={() => updateField("isActive", !form.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isActive ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddTaxModal };