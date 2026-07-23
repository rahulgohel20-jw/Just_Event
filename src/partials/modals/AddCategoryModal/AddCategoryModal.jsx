import { useEffect, useState } from "react";
import { Select } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const mainCategoryOptions = [
  { value: "corporate", label: "Corporate" },
  { value: "weddings", label: "Weddings" },
  { value: "social", label: "Social Events" },
];

const AddCategoryModal = ({ open, onClose, onSave, initialData }) => {
  const [categoryName, setCategoryName] = useState("");
  const [mainCategory, setMainCategory] = useState(undefined);
  const isEditMode = Boolean(initialData);

  // Prefill form when opening in edit mode
  useEffect(() => {
    if (open && initialData) {
      setCategoryName(initialData.categoryName || "");
      setMainCategory(
        mainCategoryOptions.find(
          (opt) => opt.label === initialData.mainCategory
        )?.value ?? initialData.mainCategory
      );
    } else if (open && !initialData) {
      setCategoryName("");
      setMainCategory(undefined);
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!categoryName.trim()) return;
    const selectedOption = mainCategoryOptions.find((o) => o.value === mainCategory);
    onSave?.({
      categoryName,
      mainCategory: selectedOption?.label || mainCategory,
    });
    handleReset();
  };

  const handleReset = () => {
    setCategoryName("");
    setMainCategory(undefined);
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={480}
      centered
      title={null} // custom header below, since header needs subtitle text
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <i className="ki-filled ki-note text-base"></i>
            {isEditMode ? "Update Category" : "Save Category"}
          </button>
        </div>
      }
    >
      <div className="px-2 pt-2 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
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

        {/* Category Name */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              #
            </span>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            E.g. "Platinum Corporate", "Luxury Weddings"
          </p>
        </div>

        {/* Main Category Group */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
            <i className="ki-filled ki-folder text-sm"></i>
            Main Category Group
          </label>
          <Select
            value={mainCategory}
            onChange={setMainCategory}
            placeholder="Select a main category..."
            className="w-full custom-category-select"
            size="large"
            options={mainCategoryOptions}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export { AddCategoryModal };