import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  addupdatethemname,
  Translateapi,
  getallreportkey,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  themeName: { english: "", hindi: "", gujarati: "" },
  isAutoAssign: true,
  reportKeyIds: [],
};

const AddThemeType = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [reportKeyOptions, setReportKeyOptions] = useState([]);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    const loadReportKeys = async () => {
      try {
        const res = await getallreportkey();
        const list = res?.data ?? res ?? [];
        setReportKeyOptions(
          list.map((item) => ({
            label: item.name || item.reportKeyName || item.label,
            value: item.id ?? item.value,
          }))
        );
      } catch (err) {
        console.error("Failed to load report keys:", err);
      }
    };
    loadReportKeys();

    if (initialData) {
      setForm({
        themeName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        isAutoAssign: initialData.isAutoAssign ?? true,
        reportKeyIds: (initialData.reportKeys || [])
          .filter((rk) => rk.isAssigned)
          .map((rk) => rk.reportKeyId),
      });
    } else {
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
      console.error("Failed to translate theme type name:", err);
      return null;
    }
  };

  const toggleReportKey = (reportKeyId) => {
    setForm((prev) => {
      const exists = prev.reportKeyIds.includes(reportKeyId);
      return {
        ...prev,
        reportKeyIds: exists
          ? prev.reportKeyIds.filter((id) => id !== reportKeyId)
          : [...prev.reportKeyIds, reportKeyId],
      };
    });
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = async () => {
    const payload = {
      id: initialData?.id ?? 0,
      isAutoAssign: form.isAutoAssign,
      nameEnglish: form.themeName.english,
      nameGujarati: form.themeName.gujarati,
      nameHindi: form.themeName.hindi,
      reportKeys: reportKeyOptions.map((opt) => ({
        id:
          initialData?.reportKeys?.find((rk) => rk.reportKeyId === opt.value)
            ?.id || 0,
        reportKeyId: opt.value,
        isAssigned: form.reportKeyIds.includes(opt.value),
      })),
    };

    setSaving(true);
    try {
      const res = await addupdatethemname(payload);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Theme Type Updated" : "Theme Type Saved",
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
      console.error("Failed to save theme type:", err);
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
            {isEditMode ? "Update Theme Type" : "Save Theme Type"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Theme Type" : "Add Theme Type"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update theme types used for template assignment.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="mb-5">
          <MultiLangInputBox
            label="Theme Type Name"
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

        <div className="mb-5 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Auto Assign
          </label>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, isAutoAssign: !prev.isAutoAssign }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isAutoAssign ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isAutoAssign ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {reportKeyOptions.length > 0 && (
          <div className="mb-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Report Keys
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reportKeyOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={form.reportKeyIds.includes(opt.value)}
                    onChange={() => toggleReportKey(opt.value)}
                    className="accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export { AddThemeType };