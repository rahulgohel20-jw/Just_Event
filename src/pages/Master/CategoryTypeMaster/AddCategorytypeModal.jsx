import { useEffect, useState } from "react";
import { Select } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi, addupadtecategorytypemaster } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const mainCategoryOptions = [
  { value: "corporate", label: "Corporate" },
  { value: "weddings", label: "Weddings" },
  { value: "social", label: "Social Events" },
];

const emptyCategoryName = { english: "", hindi: "", gujarati: "" };

const AddCategorytypeModal = ({ open, onClose, onSave, initialData }) => {
  const [categoryName, setCategoryName] = useState(emptyCategoryName);
  const [mainCategory, setMainCategory] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (open && initialData) {
      setCategoryName({
        english: initialData.categoryName?.english || initialData.nameEnglish || "",
        hindi: initialData.categoryName?.hindi || initialData.nameHindi || "",
        gujarati: initialData.categoryName?.gujarati || initialData.nameGujarati || "",
      });
      setMainCategory(
        mainCategoryOptions.find(
          (opt) => opt.label === initialData.mainCategory
        )?.value ?? initialData.mainCategory
      );
    } else if (open && !initialData) {
      setCategoryName(emptyCategoryName);
      setMainCategory(undefined);
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

  const handleReset = () => {
    setCategoryName(emptyCategoryName);
    setMainCategory(undefined);
    onClose();
  };

  const handleSave = async () => {
    if (!categoryName.english?.trim()) return;

    const payload = {
      id: isEditMode && initialData?.id ? initialData.id : null,
      nameEnglish: categoryName.english,
      nameGujarati: categoryName.gujarati,
      nameHindi: categoryName.hindi,
      userId: 1, // static for now
    };

    setSaving(true);
    try {
      const res = await addupadtecategorytypemaster(payload);

      showApiResult(res, {
        successTitle: isEditMode ? "Category Updated" : "Category Saved",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          handleReset();
        },
      });
    } catch (err) {
      console.error("Save category failed:", err);
      showApiError(err, { title: "Something went wrong" });
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
            {saving
              ? "Saving..."
              : isEditMode
              ? "Update Category"
              : "Save Category"}
          </button>
        </div>
      }
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Category" : "Add Category Type"}
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
      </div>
    </CustomModal>
  );
};

export { AddCategorytypeModal };