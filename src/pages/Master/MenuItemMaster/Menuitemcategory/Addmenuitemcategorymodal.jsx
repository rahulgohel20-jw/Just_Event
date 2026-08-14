import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Select } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  Translateapi,
  getallmenuitemcattype,
  addupadtemenuitemcat,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  categoryName: { english: "", hindi: "", gujarati: "" },
  menuCategoryTypeId: null,
  isActive: true,
};

const AddMenuItemCategoryModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [menuCategoryTypeOptions, setMenuCategoryTypeOptions] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const isEditMode = Boolean(initialData);
  const userId = Number(localStorage.getItem("userId"));

  // Load active menu category types whenever the modal opens.
  useEffect(() => {
    if (!open) return;

    const fetchMenuCategoryTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await getallmenuitemcattype({
          page: 0,
          size: 100,
          nameEnglish: "",
          isActive: true,
          sortBy: "id",
          sortDirection: "ASC",
          userId,
        });

        const content = res?.data?.data?.content ?? [];
        setMenuCategoryTypeOptions(
          content.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch menu category types:", err);
        showApiError(err, { title: "Failed to load menu category types" });
        setMenuCategoryTypeOptions([]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchMenuCategoryTypes();
  }, [open, userId]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        categoryName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        menuCategoryTypeId: initialData.menuCategoryTypeId ?? null,
        isActive: initialData.isActive ?? true,
      });
    } else if (open && !initialData) {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCategoryNameChange = (name, updatedValue) => {
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
      console.error("Failed to translate category name:", err);
      return null;
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = async () => {
    if (!form.menuCategoryTypeId) {
      Swal.fire("Required", "Please select a menu category type.", "warning");
      return;
    }
    if (!form.categoryName.english?.trim()) {
      Swal.fire("Required", "Please enter the category name in English.", "warning");
      return;
    }

    const payload = {
      id: initialData?.id ?? null,
      isActive: form.isActive,
      menuCategoryTypeId: form.menuCategoryTypeId,
      nameEnglish: form.categoryName.english,
      nameGujarati: form.categoryName.gujarati,
      nameHindi: form.categoryName.hindi,
      userId,
    };

    setSaving(true);
    try {
      const res = await addupadtemenuitemcat(payload);
      const body = res?.data ?? res;

      if (body?.success === false) {
        throw new Error(body?.msg || "Failed to save menu item category.");
      }

      Swal.fire(
        "Success",
        isEditMode
          ? "Menu item category updated successfully."
          : "Menu item category added successfully.",
        "success"
      );

      onSave?.(body?.data ?? payload);
      setForm(initialFormState);
      onClose?.();
    } catch (err) {
      console.error("Failed to save menu item category:", err);
      showApiError(err, { title: "Save Failed" });
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
            {isEditMode ? "Update Category" : "Save Category"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Menu Item Category" : "Add Menu Item Category"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update a menu item category used to classify items
              under a menu category type.
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
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Menu Category Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.menuCategoryTypeId}
            onChange={(val) => updateField("menuCategoryTypeId", val)}
            options={menuCategoryTypeOptions}
            loading={loadingTypes}
            placeholder="Select menu category type"
            className="w-full"
            notFoundContent={loadingTypes ? "Loading..." : "No active types found"}
          />
        </div>

        <div className="mb-6">
          <MultiLangInputBox
            label="Menu Item Category Name"
            name="categoryName"
            value={form.categoryName}
            onChange={handleCategoryNameChange}
            onTranslate={handleTranslate}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">Status</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
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
          <span className="text-sm text-primary font-medium">
            {form.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddMenuItemCategoryModal };