import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";
import { Select } from "antd";

const RowCategoryOptions = [
    { value: "Perishable", label: "Perishable" },
    { value: "Reusable", label: "Reusable" },
    { value: "Assets", label: "Assets" },
];

const initialFormState = {
    categoryName: {
        english: "",
        hindi: "",
        gujarati: "",
    },
    itemType: undefined,
    editNo: "",
    isActive: true,
};

const AddRowCategory = ({
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
                categoryName: {
                    english:
                        initialData.categoryNameEnglish ||
                        initialData.categoryName ||
                        "",
                    hindi: initialData.categoryNameHindi || "",
                    gujarati: initialData.categoryNameGujarati || "",
                },
                itemType:
                    RowCategoryOptions.find(
                        (opt) =>
                            opt.label === initialData.itemType ||
                            opt.value === initialData.itemType?.toLowerCase()
                    )?.value,
                editNo: initialData.editNo || "",
                isActive: initialData.status === "active",
            });
        } else if (open) {
            setForm(initialFormState);
        }
    }, [open, initialData]);

    const handleSave = () => {
        onSave(form);
        onClose();
    };

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCategoryNameChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Translation API
    const handleTranslate = async (englishText) => {
        try {
            const res = await Translateapi(englishText);
            const data = res?.data ?? res;

            return {
                hindi: data?.hindi || "",
                gujarati: data?.gujarati || "",
            };
        } catch (err) {
            console.error("Translation failed:", err);
            return null;
        }
    };

    const handleReset = () => {
        setForm(initialFormState);
        onClose?.();
    };

    return (
        <CustomModal
            open={open}
            onClose={handleReset}
            width={720}
            centered
            title={null}
            footer={
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200">
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-lg border border-primary-clarity text-primary font-medium hover:bg-primary-inverse transition disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-light font-medium hover:opacity-95 transition disabled:opacity-60"
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
            <div className="px-6 pt-6 pb-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-2xl font-semibold text-dark">
                            {isEditMode ? "Edit Raw Category" : "Add Raw Category"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Enter raw category information to organize your event inventory.
                        </p>
                    </div>

                    <button
                        onClick={handleReset}
                        className="text-gray-500"
                    >
                        <i className="ki-filled ki-cross text-lg"></i>
                    </button>
                </div>

                {/* Raw Category Name - English / Hindi / Gujarati */}
                <div className="mb-5">
                    <MultiLangInputBox
                        label="Raw Category Name"
                        name="categoryName"
                        value={form.categoryName}
                        onChange={handleCategoryNameChange}
                        onTranslate={handleTranslate}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
                            Item Type
                        </label>

                        <Select
                            value={form.itemType}
                            onChange={(value) => updateField("itemType", value)}
                            placeholder="Select Item Type"
                            className="w-full custom-category-select"
                            size="large"
                            options={RowCategoryOptions}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
                            Edit No.
                        </label>

                        <input
                            type="text"
                            value={form.editNo}
                            onChange={(e) => updateField("editNo", e.target.value)}
                            placeholder="Edit No."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                        />
                    </div>
                </div>
                {/* Status Card */}
                <div className="rounded-xl bg-primary-inverse p-4 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-dark">
                            Category Status
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                            Toggle category visibility in the inventory system.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => updateField("isActive", !form.isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-light transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>

                        <span className="text-sm font-medium text-primary">
                            {form.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};

export default AddRowCategory;
