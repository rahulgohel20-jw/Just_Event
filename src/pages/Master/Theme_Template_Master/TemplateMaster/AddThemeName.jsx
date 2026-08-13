import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { addupdatethemname, Translateapi } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  themeName: { english: "", hindi: "", gujarati: "" },
  isAutoAssign: true,
};

const AddThemeName = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        themeName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        isAutoAssign: initialData.isAutoAssign ?? true,
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const handleThemeNameChange = (name, updatedValue) => {
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
      console.error("Failed to translate theme name:", err);
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
      isAutoAssign: form.isAutoAssign,
      nameEnglish: form.themeName.english,
      nameGujarati: form.themeName.gujarati,
      nameHindi: form.themeName.hindi,
    };

    setSaving(true);
    try {
      const res = await addupdatethemname(payload);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Template Updated" : "Template Saved",
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
      console.error("Failed to save theme:", err);
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
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-primary font-medium transition-colors disabled:opacity-60"
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
            {isEditMode ? "Update Template" : "Save Template"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Template Name" : "Add Template Name"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update template names used across theme selection.
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
            label="Template Name"
            name="themeName"
            value={form.themeName}
            onChange={handleThemeNameChange}
            onTranslate={handleTranslate}
            required
          />
          <p className="text-xs text-gray-400 mt-2">
            e.g., Exclusive Theme, Back Office Theme
          </p>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddThemeName };