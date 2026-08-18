  import React, { useEffect, useState } from "react";
  import { Save, Loader2 } from "lucide-react";
  import { Select } from "antd";

  import { CustomModal } from "@/components/custom-modal/CustomModal";
  import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
  import { Translateapi, getAllRawCategoryMaster } from "@/services/apiServices";

  const initialFormState = {
    subCategoryName: {
      english: "",
      hindi: "",
      gujarati: "",
    },
    mainCategoryId: undefined,
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
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const isEditMode = Boolean(initialData);

    const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
  if (!open) return;

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getAllRawCategoryMaster({
        page: 0,
        size: 100,
        isActive: true,
        sortBy: "id",
        sortDirection: "ASC",
      });
      const records = res?.data?.data?.content ?? [];
      setCategoryOptions(
        records.map((r) => ({
          value: r.id,
          label: r.nameEnglish,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch raw categories:", err);
      setCategoryOptions([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  fetchCategories();
}, [open]);

    useEffect(() => {
      if (open && initialData) {
        setForm({
          subCategoryName: {
            english:
              initialData.nameEnglish ||
              initialData.subCategoryName ||
              "",
            hindi: initialData.nameHindi || "",
            gujarati: initialData.nameGujarati || "",
          },
          mainCategoryId: initialData.mainCategoryId || initialData.rawCategoryId || undefined,
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
      try {
        await onSave?.(form);
        handleReset();
      } finally {
        setSaving(false);
      }
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
              disabled={saving}
              className="px-6 py-2.5 rounded-lg border border-primary-clarity text-primary disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white disabled:opacity-60"
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
              onChange={handleSubCategoryChange}
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
              value={form.mainCategoryId}
              onChange={(value) => updateField("mainCategoryId", value)}
              placeholder="Select Main Category"
              options={categoryOptions}
              loading={loadingCategories}
              className="w-full custom-category-select"
              size="large"
            />
          </div>

          {/* Status */}
          <div className="rounded-xl bg-primary-inverse p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-dark">Status</h4>
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