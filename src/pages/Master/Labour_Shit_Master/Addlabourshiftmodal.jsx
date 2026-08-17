import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import TimeInput12h from "../../../components/form-inputs/Time/Timeinput12h";
import { addupadtelaourshift, Translateapi } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  shiftName: { english: "", hindi: "", gujarati: "" },
  startTime: "", // stored as "hh:mm A" (12h) to match TimeInput12h
};

const AddLabourShiftModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (open && initialData) {
      setForm({
        shiftName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        startTime: initialData.startTime || "",
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const handleShiftNameChange = (name, updatedValue) => {
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
      console.error("Failed to translate shift name:", err);
      return null;
    }
  };

  const handleTimeChange = (value) => {
    setForm((prev) => ({ ...prev, startTime: value }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const isFormValid = form.shiftName.english.trim() && form.startTime;

  const handleSave = async () => {
    if (!isFormValid) return;

    const payload = {
      id: initialData?.id ?? null,
      nameEnglish: form.shiftName.english,
      nameGujarati: form.shiftName.gujarati,
      nameHindi: form.shiftName.hindi,
      startTime: form.startTime,
      userId,
    };

    setSaving(true);
    try {
      const res = await addupadtelaourshift(payload);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Shift Updated" : "Shift Saved",
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
      console.error("Failed to save labour shift:", err);
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
      width={640}
      centered
      title={isEditMode ? "Edit Labour Shift" : "Create Labour Shift"}
      footer={
        <div className="flex justify-end items-center gap-3 px-6 pb-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-primary font-medium transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !isFormValid}
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
        <div className="mb-6">
          <MultiLangInputBox
            label="Shift Name"
            name="shiftName"
            value={form.shiftName}
            onChange={handleShiftNameChange}
            onTranslate={handleTranslate}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
              Start Time
              <span className="text-red-500">*</span>:
            </label>
            <TimeInput12h
              value={form.startTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddLabourShiftModal };