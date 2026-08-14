import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { Camera, Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  Translateapi,
  getallmenuitemcat,
  addupadtemenuitem,
} from "@/services/apiServices";
import { showApiResult, showApiError, showWarning } from "@/utils/swalHelpers";


const initialFormState = {
  itemName: { english: "", hindi: "", gujarati: "" },
  menuCategoryId: null,
  description: "",
  isActive: true,
  coverImageFiles: [],
  coverImagePreviews: [],
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 6;

const AddMenuitemmaster = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [menuCategoryOptions, setMenuCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(initialData);
  const userId = Number(localStorage.getItem("userId"));

  // Load active menu categories whenever the modal opens.
  useEffect(() => {
    if (!open) return;

    const fetchMenuCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getallmenuitemcat({
          page: 0,
          size: 100,
          nameEnglish: "",
          isActive: true,
          sortBy: "id",
          sortDirection: "ASC",
          userId,
        });

        const content = res?.data?.data?.content ?? [];
        setMenuCategoryOptions(
          content.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch menu categories:", err);
        showApiError(err, { title: "Failed to load menu categories" });
        setMenuCategoryOptions([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMenuCategories();
  }, [open, userId]);

  useEffect(() => {
    if (open && initialData) {
      setForm({
        itemName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        menuCategoryId: initialData.menuCategoryId ?? null,
        description: initialData.description || "",
        isActive: initialData.isActive ?? true,
        coverImageFiles: [],
        coverImagePreviews: [],
      });
      setExistingImages(initialData.images || []);
    } else if (open && !initialData) {
      setForm(initialFormState);
      setExistingImages([]);
    }
    setFileError("");
  }, [open, initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleItemNameChange = (name, updatedValue) => {
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
      console.error("Failed to translate item name:", err);
      return null;
    }
  };

  const processFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    setFileError("");

    const validFiles = [];
    for (const file of incoming) {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      if (!isValidType) {
        setFileError("Only JPG and PNG files are supported.");
        continue;
      }
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
      if (!isValidSize) {
        setFileError(`Each file must be under ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) return;

    setForm((prev) => {
      const combined = [...prev.coverImageFiles, ...validFiles].slice(0, MAX_FILES);
      const newPreviews = combined.map((f) =>
        typeof f === "string" ? f : URL.createObjectURL(f)
      );
      return {
        ...prev,
        coverImageFiles: combined,
        coverImagePreviews: newPreviews,
      };
    });
  };

  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same file after removal
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const files = prev.coverImageFiles.filter((_, i) => i !== index);
      const previews = prev.coverImagePreviews.filter((_, i) => i !== index);
      return { ...prev, coverImageFiles: files, coverImagePreviews: previews };
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setExistingImages([]);
    setFileError("");
    onClose();
  };

  const handleSave = async () => {
    if (!form.menuCategoryId) {
      showWarning("Please select a menu category.");
      return;
    }
    if (!form.itemName.english?.trim()) {
      showWarning("Please enter the item name in English.");
      return;
    }

    const payload = {
      id: initialData?.id ?? null,
      isActive: form.isActive,
      menuCategoryId: form.menuCategoryId,
      description: form.description,
      nameEnglish: form.itemName.english,
      nameGujarati: form.itemName.gujarati,
      nameHindi: form.itemName.hindi,
      // existing images kept after removals, in case backend needs the list
      existingImages,
      userId,
    };

    // Backend expects multipart/form-data: `data` part (JSON blob) + repeated `images` parts
    const formData = new FormData();
    const dataBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    formData.append("data", dataBlob);

    form.coverImageFiles.forEach((file) => {
      formData.append("images", file); // same key repeated = array on the backend
    });

    setSaving(true);
    try {
      const res = await addupadtemenuitem(formData);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Item Updated" : "Item Saved",
        fallbackSuccess: isEditMode
          ? "Menu item updated successfully."
          : "Menu item added successfully.",
        errorTitle: "Save Failed",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          setForm(initialFormState);
          setExistingImages([]);
          onClose?.();
        },
      });

      if (!success) return;
    } catch (err) {
      console.error("Failed to save menu item:", err);
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
            {isEditMode ? "Update Item" : "Save Item"}
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update a menu item under a menu category.
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
            Menu Category <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.menuCategoryId}
            onChange={(val) => updateField("menuCategoryId", val)}
            options={menuCategoryOptions}
            loading={loadingCategories}
            placeholder="Select menu category"
            className="w-full"
            notFoundContent={loadingCategories ? "Loading..." : "No active categories found"}
          />
        </div>

        <div className="mb-6">
          <MultiLangInputBox
            label="Menu Item Name"
            name="itemName"
            value={form.itemName}
            onChange={handleItemNameChange}
            onTranslate={handleTranslate}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            placeholder="Enter item description"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Images
          </label>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative group">
                  <img
                    src={typeof src === "string" ? src : src?.url}
                    alt={`Existing item image ${i + 1}`}
                    className="h-24 w-full rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs opacity-90 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {form.coverImagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {form.coverImagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`Menu item image ${i + 1}`}
                    className="h-24 w-full rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs opacity-90 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingImages.length + form.coverImagePreviews.length < MAX_FILES && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-[#FBF1F3]"
                  : "border-gray-400 bg-[#FDF9FA] hover:bg-[#FBF1F3]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E5EA] text-primary">
                <Camera size={20} />
              </div>
              <p className="text-sm text-gray-600">
                Drag &amp; drop images or{" "}
                <span className="text-primary font-medium">Browse Files</span>
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG up to {MAX_FILE_SIZE_MB}MB each · up to {MAX_FILES} images
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}
          {fileError && <p className="text-xs text-red-500 mt-2">{fileError}</p>}
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

export { AddMenuitemmaster };