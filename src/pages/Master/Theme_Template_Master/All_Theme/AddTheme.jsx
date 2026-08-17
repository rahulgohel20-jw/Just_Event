import { useEffect, useState } from "react";
import { addupdatetheme, getalltheme, getallthemetypemaster } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { CustomModal } from "../../../../components/custom-modal/CustomModal";
import PaginatedSearchSelect from "../../../../components/form-inputs/select/PaginatedSearchSelect";

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  backOfficeDescription: "",
  price: "",
  isDefault: false,
  templateModuleId: null, // "Theme" - selected first, not sent in payload
  templateMappingId: null, // "Theme Type Master" - scoped to templateModuleId, sent in payload
};

const AddTheme = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
              // when editing, we only have templateMappingId from the server -
              // templateModuleId isn't known unless initialData carries it too
              templateModuleId: initialData.templateModuleId ?? null,
              templateMappingId: initialData.templateMappingId ?? null,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // picking a new Theme resets the dependent Theme Type Master selection
  const handleThemeModuleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      templateModuleId: value,
      templateMappingId: null,
    }));
    setErrors((prev) => ({ ...prev, templateModuleId: undefined, templateMappingId: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name?.trim()) next.name = "Name is required.";
    if (form.price === "" || Number.isNaN(Number(form.price))) {
      next.price = "Enter a valid price.";
    }
    if (!form.templateModuleId) next.templateModuleId = "Theme is required.";
    if (!form.templateMappingId) next.templateMappingId = "Theme type is required.";
    setErrors(next);
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

      const res = await addupdatetheme(payload);
      showApiResult(res, {
        successTitle: isEdit ? "Updated" : "Added",
        fallbackSuccess: isEdit ? "Plan updated successfully." : "Plan added successfully.",
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
        {submitting ? "Saving..." : isEdit ? "Update" : "Save"}
      </button>
    </div>
  );

  return (
    <CustomModal open={open} onClose={onClose} title={isEdit ? "Edit Plan" : "Add Plan"} footer={footer}>
      <div className="space-y-4 p-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme <span className="text-red-500">*</span>
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
            placeholder="Select theme..."
          />
          {errors.templateModuleId && (
            <p className="text-xs text-red-500 mt-1">{errors.templateModuleId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme Type Master <span className="text-red-500">*</span>
          </label>
          <PaginatedSearchSelect
            key={form.templateModuleId} // remounts (and refetches) when the parent theme changes
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
            placeholder="Select theme type..."
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
            placeholder="e.g. Gold Plan"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
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
            placeholder="0"
            min="0"
            step="0.01"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Back Office Description
          </label>
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
    </CustomModal>
  );
};

export { AddTheme };