import React, { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi, getAllRawCategoryTypeMaster } from "@/services/apiServices";
import { Select } from "antd";


const initialFormState = {
    categoryName: {
        english: "",
        hindi: "",
        gujarati: "",
    },
    rawCategoryTypeId: undefined,
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
    const [itemTypeOptions, setItemTypeOptions] = useState([]);
    const [loadingItemTypes, setLoadingItemTypes] = useState(false);
const userId = Number(localStorage.getItem("userId"));

    const isEditMode = Boolean(initialData);

    // Fetch raw category types for the Item Type dropdown whenever the modal opens
    useEffect(() => {
        if (!open) return;

        const fetchItemTypes = async () => {
            setLoadingItemTypes(true);
            try {
                const res = await getAllRawCategoryTypeMaster({
                    page: 0,
                    pageSize: 100, // pull enough for a dropdown; paginate/search here if the list grows large
                    status: "active",
                    userId,
                });
                const records = res?.data?.data?.content ?? [];
                setItemTypeOptions(
                    records.map((r) => ({
                        value: r.id,
                        label: r.nameEnglish,
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch raw category types:", err);
                setItemTypeOptions([]);
            } finally {
                setLoadingItemTypes(false);
            }
        };

        fetchItemTypes();
    }, [open]);

   useEffect(() => {
    if (open && initialData) {
        setForm({
            categoryName: {
                english: initialData.nameEnglish || "",
                hindi: initialData.nameHindi || "",
                gujarati: initialData.nameGujarati || "",
            },
            rawCategoryTypeId: initialData.rawCategoryTypeId,
            isActive: initialData.isActive ?? true,
        });
    } else if (open) {
        setForm(initialFormState);
    }
}, [open, initialData]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(form);
            handleReset();
        } finally {
            setSaving(false);
        }
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
                        onClick={handleSave}
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

                <div className="mb-5">
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-800 mb-2">
                        Item Type
                    </label>

                    <Select
                        value={form.rawCategoryTypeId}
                        onChange={(value) => updateField("rawCategoryTypeId", value)}
                        placeholder="Select Item Type"
                        className="w-full custom-category-select"
                        size="large"
                        loading={loadingItemTypes}
                        options={itemTypeOptions}
                    />
                </div>

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