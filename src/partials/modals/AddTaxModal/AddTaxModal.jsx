import { useEffect, useState } from "react";
import { Percent, Save } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const initialFormState = {
  taxName: "",
  taxPercentage: "",
};

const AddTaxModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const isEditMode = Boolean(initialData);

  // Prefill form when opening in edit mode
  useEffect(() => {
    if (open && initialData) {
      setForm({
        taxName: initialData.taxName || "",
        taxPercentage: String(initialData.percentage ?? ""),
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = () => {
    if (!form.taxName.trim() || form.taxPercentage === "") return;
    onSave?.(form);
    setForm(initialFormState);
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={480}
      centered
      title={null}
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
            <Save size={16} />
            {isEditMode ? "Update Tax" : "Save Tax"}
          </button>
        </div>
      }
    >
      <div className="px-2 pt-2 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
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

        <hr className="border-t border-gray-200 mb-5" />

        {/* Tax Name */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              #
            </span>
            <input
              type="text"
              value={form.taxName}
              onChange={(e) => updateField("taxName", e.target.value)}
              placeholder="Tax Name"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">e.g., CGST, SGST, VAT</p>
        </div>

        {/* Tax Percentage */}
        <div>
          <div className="relative">
            <Percent
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              value={form.taxPercentage}
              onChange={(e) => updateField("taxPercentage", e.target.value)}
              placeholder="Tax Percentage"
              min="0"
              max="100"
              step="0.01"
              className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              %
            </span>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddTaxModal };