import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Select } from "antd";

import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";

const CATEGORY_OPTIONS = [
  { value: "Hospitality", label: "Hospitality" },
  { value: "Technical Production", label: "Technical Production" },
  { value: "Decoration", label: "Decoration" },
  { value: "Technology", label: "Technology" },
];
const MAIN_CATEGORY_OPTIONS = [
  { value: "Hospitality", label: "Hospitality" },
  { value: "Technical Production", label: "Technical Production" },
  { value: "Decoration", label: "Decoration" },
  { value: "Technology", label: "Technology" },
];
const initialFormState = {
  subCategoryName: {
    english: "",
    hindi: "",
    gujarati: "",
  },
  mainCategory: undefined,
  isActive: true,
};

const AddRawSubCategory = ({
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
        subCategoryName: {
          english:
            initialData.subCategoryNameEnglish ||
            initialData.subCategoryName ||
            "",
          hindi: initialData.subCategoryNameHindi || "",
          gujarati: initialData.subCategoryNameGujarati || "",
        },
        mainCategory: initialData.mainCategory,
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

  const handleSubCategoryChange = (name, value) => {
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
    onClose?.();
  };

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      ...form,
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
      centered
      width={760}
      title={null}
      footer={
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-primary-clarity">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-lg border border-primary-clarity text-primary"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {isEditMode ? "Update Category" : "Save Category"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
  {/* Header */}
  <div className="flex justify-between items-start mb-5">
    <div>
      <h2 className="text-xl font-bold text-primary">
        {isEditMode ? "Edit Raw Sub-Category" : "Add Raw Sub-Category"}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Enter the Raw Sub-Category details below.
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

  {/* Sub Category Name */}
  <div className="mb-5">
    <MultiLangInputBox
      label="Sub Category Name"
      name="subCategoryName"
      value={form.subCategoryName}
      onTranslate={handleTranslate}
      required
    />
  </div>

  {/* Main Category */}
  <div className="mb-5">
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Main Category
    </label>

    <Select
      value={form.mainCategory}
      onChange={(value) => updateField("mainCategory", value)}
      placeholder="Select Main Category"
      options={MAIN_CATEGORY_OPTIONS}
      className="w-full custom-category-select"
      size="large"
    />
  </div>

  {/* Status */}
  <div className="rounded-xl bg-primary-inverse p-4 flex items-center justify-between">
    <div>
      <h4 className="text-sm font-semibold text-dark">
        Status
      </h4>

      <p className="text-xs text-gray-500 mt-1">
        Set whether this sub-category is currently available.
      </p>
    </div>

    <div className="flex items-center gap-3">
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

      <span
        className={`text-sm font-medium ${
          form.isActive ? "text-primary" : "text-gray-500"
        }`}
      >
        {form.isActive ? "Active" : "Inactive"}
      </span>
    </div>
  </div>
</div>
    </CustomModal>
  );
};

export default AddRawSubCategory;