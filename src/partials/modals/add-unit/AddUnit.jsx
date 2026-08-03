import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";

const initialFormState = {
  unitName: {
    english: "",
    hindi: "",
    gujarati: "",
  },
  symbol: "",
  isActive: true,
};

const AddUnit = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        unitName: {
          english:
            initialData.unitNameEnglish ||
            initialData.unitName ||
            "",
          hindi: initialData.unitNameHindi || "",
          gujarati: initialData.unitNameGujarati || "",
        },
        symbol: initialData.symbol || "",
        isActive: initialData.status === "active",
      });
    } else if (open) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUnitNameChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTranslate = async (englishText) => {
    try {
      const res = await Translateapi(englishText);
      const data = res?.data ?? res;

      return {
        hindi: data?.hindi || "",
        gujarati: data?.gujarati || "",
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = async () => {
    if (!form.unitName.english.trim()) return;

    setSaving(true);

    const payload = {
      ...initialData,
      unitNameEnglish: form.unitName.english,
      unitNameHindi: form.unitName.hindi,
      unitNameGujarati: form.unitName.gujarati,
      unitName: form.unitName.english,
      symbol: form.symbol,
      status: form.isActive ? "active" : "inactive",
    };

    onSave?.(payload);

    setSaving(false);
    handleReset();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={650}
      centered
      title={null}
      footer={
        <div className="flex gap-4 items-center px-6 pb-6 justify-end">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary-inverse text-primary font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-light font-medium"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {isEditMode ? "Update Unit" : "Save Unit"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Unit" : "Add Unit"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Create a new measurement unit for your inventory and logistics.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <hr className="mb-5" />

        {/* Unit Name */}
        <div className="mb-5">
          <MultiLangInputBox
            label="Unit Name"
            name="unitName"
            value={form.unitName}
            onChange={handleUnitNameChange}
            onTranslate={handleTranslate}
            required
          />
        </div>

        {/* Symbol */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Symbol
          </label>

          <input
            type="text"
            value={form.symbol}
            onChange={(e) => updateField("symbol", e.target.value)}
            placeholder="Symbol (e.g., kg, L)"
            className="w-full rounded-lg border border-primary-clarity px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status */}
        <div className="rounded-xl bg-primary-inverse p-4 flex justify-between items-center">
          <div>
            <h4 className="font-medium text-dark">
             Status
            </h4>

            <p className="text-xs text-gray-500 mt-1">
             Set whether this unit is currently available.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                updateField("isActive", !form.isActive)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                form.isActive
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.isActive
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>

            <span className="text-sm font-medium text-primary">
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddUnit;