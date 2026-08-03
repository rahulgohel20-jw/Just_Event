import { useEffect, useState } from "react";
import { Select } from "antd";
import Swal from "sweetalert2";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  Translateapi,
  getAllCategoryTypemaster,
  addupdatecategorymaster,
} from "@/services/apiServices";

const emptyCategoryName = { english: "", hindi: "", gujarati: "" };

const AddCategoryModal = ({ open, onClose, onSave, initialData }) => {
  const [categoryName, setCategoryName] = useState(emptyCategoryName);
  const [categoryTypeId, setCategoryTypeId] = useState(undefined);
  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);

  // Fetch Main Category Group options (category types) whenever modal opens
  useEffect(() => {
    if (!open) return;
    const fetchCategoryTypes = async () => {
      setLoadingTypes(true);
      try {
        const payload = {
          nameEnglish: "",
          page: 0,
          size: 1000,
          sortBy: "id",
          sortDirection: "ASC",
          userId: 1,
        };
        const res = await getAllCategoryTypemaster(payload);
        const list = res?.data?.data?.content || res?.data?.data || res?.data || [];
        setCategoryTypeOptions(
          (Array.isArray(list) ? list : []).map((item) => ({
            value: item.id,
            label: item.nameEnglish,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch category types:", err);
        setCategoryTypeOptions([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchCategoryTypes();
  }, [open]);

  // Prefill form when opening in edit mode
  useEffect(() => {
    if (open && initialData) {
      setCategoryName({
        english: initialData.categoryName?.english || initialData.nameEnglish || "",
        hindi: initialData.categoryName?.hindi || initialData.nameHindi || "",
        gujarati: initialData.categoryName?.gujarati || initialData.nameGujarati || "",
      });
      setCategoryTypeId(initialData.categoryTypeId ?? undefined);
    } else if (open && !initialData) {
      setCategoryName(emptyCategoryName);
      setCategoryTypeId(undefined);
    }
  }, [open, initialData]);

  const handleTranslate = async (englishText) => {
    try {
      const res = await Translateapi(englishText);
      const data = res?.data?.data || res?.data || {};
      return {
        hindi: data.hindi || data.hi || "",
        gujarati: data.gujarati || data.gu || "",
      };
    } catch (err) {
      console.error("Translate API failed:", err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!categoryName.english?.trim()) return;
    if (!categoryTypeId) {
      Swal.fire({
        icon: "warning",
        title: "Main Category Group is required",
      });
      return;
    }

    const payload = {
      id: isEditMode && initialData?.id ? initialData.id : null,
      categoryTypeId,
      nameEnglish: categoryName.english,
      nameGujarati: categoryName.gujarati,
      nameHindi: categoryName.hindi,
      userId: 1, // static for now
    };

    setSaving(true);
    try {
      const res = await addupdatecategorymaster(payload);
      const result = res?.data?.data || res?.data;

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Category Updated" : "Category Saved",
        timer: 1500,
        showConfirmButton: false,
      });

      onSave?.(result || payload);
      handleReset();
    } catch (err) {
      console.error("Save category failed:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err?.response?.data?.message || "Failed to save category.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCategoryName(emptyCategoryName);
    setCategoryTypeId(undefined);
    onClose();
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
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
          >
            <i className="ki-filled ki-note text-base"></i>
            {saving ? "Saving..." : isEditMode ? "Update Category" : "Save Category"}
          </button>
        </div>
      }
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update this category's name or main category group."
                : "Create a new category for organizing clients and event records."}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-5" />

        {/* Category Name (English / Hindi / Gujarati) */}
        <div className="mb-4">
          <MultiLangInputBox
            label="Category Name"
            name="categoryName"
            value={categoryName}
            onChange={(_, updated) => setCategoryName(updated)}
            onTranslate={handleTranslate}
            required
            disabled={saving}
          />
        </div>

        {/* Main Category Group */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
            <i className="ki-filled ki-folder text-sm"></i>
             Category Type
          </label>
          <Select
            value={categoryTypeId}
            onChange={setCategoryTypeId}
            placeholder="Select a main category..."
            className="w-full custom-category-select"
            size="large"
            loading={loadingTypes}
            options={categoryTypeOptions}
            disabled={saving}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export { AddCategoryModal };