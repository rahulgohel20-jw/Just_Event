import { useEffect, useRef, useState } from "react";
import { addupdatetheme, getalltheme, getallthemetypemaster } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { CustomModal } from "../../../../components/custom-modal/CustomModal";
import PaginatedSearchSelect from "../../../../components/form-inputs/select/PaginatedSearchSelect";

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE_MB = 15;
const MAX_PDF_SIZE_MB = 15;
const IMAGE_NAME_REGEX = /^[1-9]\.(jpe?g|png|webp)$/i;

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  backOfficeDescription: "",
  price: "",
  isDefault: false,
  templateModuleId: null,
  templateMappingId: null,
};

const AddTheme = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [pdfFile, setPdfFile] = useState(null);

  const slotInputRef = useRef(null);   // single-file: replaces one specific slot
  const bulkInputRef = useRef(null);   // multi-file: fills next empty slots
  const pdfInputRef = useRef(null);
  const activeSlotRef = useRef(null);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              id: initialData.id,
              name: initialData.name ?? "",
              description: initialData.description ?? "",
              backOfficeDescription: initialData.backOfficeDescription ?? "",
              price: initialData.price ?? "",
              isDefault: initialData.isDefault ?? false,
              templateModuleId: initialData.templateModuleId ?? null,
              templateMappingId: initialData.templateMappingId ?? null,
            }
          : EMPTY_FORM
      );
     if (initialData) {
  // TODO: confirm actual field names the API uses for the numbered slots
  const existing = [
    initialData.frontPage,
    initialData.secondPage,
    // ...remaining slots — need to know what /getbyid actually returns for slots 3-6
    initialData.lastPage,
    initialData.watermark,
  ];
  setImages(Array(MAX_IMAGES).fill(null).map((_, i) => existing[i] ?? null));
} else {
  setImages(Array(MAX_IMAGES).fill(null));
}
setPdfFile(null);
setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleThemeModuleChange = (value) => {
    setForm((prev) => ({ ...prev, templateModuleId: value, templateMappingId: null }));
    setErrors((prev) => ({ ...prev, templateModuleId: undefined, templateMappingId: undefined }));
  };

  // ---------- image slots ----------
  const openSlotPicker = (slotIndex) => {
    activeSlotRef.current = slotIndex;
    slotInputRef.current?.click();
  };

  const openBulkPicker = () => bulkInputRef.current?.click();

  const validateImageFile = (file) => {
    if (!IMAGE_NAME_REGEX.test(file.name)) {
      return `"${file.name}" is not proper. Rename to 1-9 before uploading (e.g. "1.jpg").`;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return `"${file.name}" exceeds ${MAX_IMAGE_SIZE_MB}MB.`;
    }
    return null;
  };

  // single slot click - replaces exactly that slot
  const handleSlotFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      setErrors((prev) => ({ ...prev, images: err }));
      return;
    }

    const slotIndex = activeSlotRef.current ?? images.findIndex((f) => !f);
    setErrors((prev) => ({ ...prev, images: undefined }));
    setImages((prev) => {
      const next = [...prev];
      next[slotIndex] = file;
      return next;
    });
  };

  // bulk button click - fills multiple empty slots at once
  const handleBulkFileChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setImages((prev) => {
      const next = [...prev];
      const errorsList = [];
      let cursor = 0;

      for (const file of files) {
        const err = validateImageFile(file);
        if (err) {
          errorsList.push(err);
          continue;
        }
        // find next empty slot
        while (cursor < MAX_IMAGES && next[cursor]) cursor += 1;
        if (cursor >= MAX_IMAGES) {
          errorsList.push(`Only ${MAX_IMAGES} images allowed - "${file.name}" was skipped.`);
          continue;
        }
        next[cursor] = file;
        cursor += 1;
      }

      setErrors((prevErr) => ({
        ...prevErr,
        images: errorsList.length ? errorsList.join(" ") : undefined,
      }));

      return next;
    });
  };

  const removeImage = (slotIndex) => {
    setImages((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  };

  // ---------- pdf ----------
  const openPdfPicker = () => pdfInputRef.current?.click();

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, pdf: "Only PDF files are allowed." }));
      return;
    }
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pdf: `PDF must be under ${MAX_PDF_SIZE_MB}MB.` }));
      return;
    }

    setErrors((prev) => ({ ...prev, pdf: undefined }));
    setPdfFile(file);
  };

  const validate = () => {
    const next = {};
    if (!form.name?.trim()) next.name = "Name is required.";
    if (form.price === "" || Number.isNaN(Number(form.price))) next.price = "Enter a valid price.";
    if (!form.templateModuleId) next.templateModuleId = "Template Name is required.";
    if (!form.templateMappingId) next.templateMappingId = "Template Module is required.";
    if (images.filter(Boolean).length === 0) next.images = "At least one template image is required.";
    if (!pdfFile && !isEdit) next.pdf = "Dummy PDF is required.";

    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        id: form.id ?? null,
        backOfficeDescription: form.backOfficeDescription,
        description: form.description,
        isDefault: form.isDefault,
        name: form.name,
        price: Number(form.price),
        templateMappingId: form.templateMappingId,
      };

     const formData = new FormData();
formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

if (!isEdit) {
  images.filter(Boolean).forEach((file) => formData.append("images", file));
} else {
  // only send images if the user actually replaced/added new files
  const newFiles = images.filter((f) => f instanceof File);
  newFiles.forEach((file) => formData.append("images", file));
}

if (pdfFile) formData.append("pdf", pdfFile);

      const res = await addupdatetheme(formData);
      showApiResult(res, {
        successTitle: isEdit ? "Updated" : "Added",
        fallbackSuccess: isEdit ? "Template updated successfully." : "Template added successfully.",
        errorTitle: isEdit ? "Update Failed" : "Add Failed",
        onSuccess: () => onSave?.(),
      });
    } catch (err) {
      showApiError(err, { title: isEdit ? "Update Failed" : "Add Failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-3 px-5 pb-4">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-red-900 disabled:opacity-60"
      >
        {submitting ? "Saving..." : isEdit ? "Update Theme" : "Save Theme"}
      </button>
    </div>
  );

  return (
    <CustomModal open={open} onClose={onClose} title={isEdit ? "Edit Template" : "Add Template"} width={800} footer={footer}>
      <div className="max-h-[75vh] overflow-y-auto">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          {/* LEFT: preview + uploads */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
            <div className="grid grid-cols-2 gap-3">
             {images.map((file, idx) => (
  <div
    key={idx}
    onClick={() => openSlotPicker(idx)}
    className="relative aspect-[4/3] border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400 cursor-pointer overflow-hidden hover:border-[#7A2E45] transition"
  >
    {file ? (
      <>
        <img
          src={typeof file === "string" ? file : URL.createObjectURL(file)}
          alt={`slot-${idx + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeImage(idx);
          }}
          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ×
        </button>
      </>
    ) : (
      "Empty Slot"
    )}
  </div>
))}
            </div>

            {/* single-slot input - no multiple */}
            <input
              ref={slotInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={handleSlotFileChange}
            />

            {/* bulk input - multiple enabled */}
            <input
              ref={bulkInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={handleBulkFileChange}
            />

            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Template Images (Max {MAX_IMAGES}) <span className="text-red-500">*</span>
              </p>
              <button
                type="button"
                onClick={openBulkPicker}
                className="w-full border border-dashed border-gray-300 rounded-lg py-4 text-xs text-gray-500 hover:border-[#7A2E45] transition"
              >
                Click to upload templates ({images.filter(Boolean).length}/{MAX_IMAGES})
                <br />
                Select multiple at once. File names must be 1-9 (e.g. "1.jpg"). JPG, PNG, WEBP (Max {MAX_IMAGE_SIZE_MB}MB each)
              </button>
              {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Dummy PDF <span className="text-red-500">*</span>
              </p>
              <button
                type="button"
                onClick={openPdfPicker}
                className="w-full border border-dashed border-gray-300 rounded-lg py-4 text-xs text-gray-500 hover:border-[#7A2E45] transition truncate"
              >
                {pdfFile ? pdfFile.name : `Click to upload PDF (Max ${MAX_PDF_SIZE_MB}MB)`}
              </button>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />
              {errors.pdf && <p className="text-xs text-red-500 mt-1">{errors.pdf}</p>}
            </div>
          </div>

          {/* RIGHT: form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name <span className="text-red-500">*</span>
              </label>
              <PaginatedSearchSelect
                value={form.templateModuleId}
                onChange={handleThemeModuleChange}
                fetchFn={getalltheme}
                sizeParamName="size"
                searchParamName="nameEnglish"
                extraParams={{ isAutoAssign: null, sortBy: "id", sortDirection: "DESC" }}
                labelKey="nameEnglish"
                valueKey="id"
                placeholder="Select template name..."
              />
              {errors.templateModuleId && (
                <p className="text-xs text-red-500 mt-1">{errors.templateModuleId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Module <span className="text-red-500">*</span>
              </label>
              <PaginatedSearchSelect
                key={form.templateModuleId}
                value={form.templateMappingId}
                onChange={handleChange("templateMappingId")}
                fetchFn={getallthemetypemaster}
                sizeParamName="size"
                searchParamName="nameEnglish"
                extraParams={{
                  isAutoAssign: null,
                  sortBy: "id",
                  sortDirection: "ASC",
                  templateModuleId: form.templateModuleId,
                }}
                labelKey="nameEnglish"
                valueKey="id"
                placeholder="Select template type..."
                disabled={!form.templateModuleId}
              />
              {errors.templateMappingId && (
                <p className="text-xs text-red-500 mt-1">{errors.templateMappingId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
                placeholder="Enter theme name"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={handleChange("description")}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
                placeholder="Enter description (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={handleChange("price")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Back Office Description</label>
              <textarea
                value={form.backOfficeDescription}
                onChange={handleChange("backOfficeDescription")}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as Default
              </label>
              <button
                type="button"
                id="isDefault"
                onClick={() => handleChange("isDefault")(!form.isDefault)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.isDefault ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isDefault ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddTheme };