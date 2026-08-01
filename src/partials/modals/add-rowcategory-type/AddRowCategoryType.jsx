import React, { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";

const initialFormState = {
    categoryName: {
        english: "",
        hindi: "",
        gujarati: "",
    },
    status: "",
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
const AddRowCategoryType = ({
    open,
    onClose,
    onSave,
    initialData,
}) => {
    const [form, setForm] = useState(initialFormState);

    const isEditMode = Boolean(initialData);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setForm({
                    categoryName: {
                        english:
                            initialData.categoryNameEnglish ||
                            initialData.categoryName ||
                            "",
                        hindi: initialData.categoryNameHindi || "",
                        gujarati: initialData.categoryNameGujarati || "",
                    },
                    status: initialData.status || "",
                });
            } else {
                setForm(initialFormState);
            }
        }
    }, [open, initialData]);


    const handleCategoryNameChange = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleReset = () => {
        setForm(initialFormState);
        onClose();
    };

    const handleSave = () => {
        onSave?.(form);
        handleReset();
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
                        className="px-5 py-2 rounded-lg bg-primary-inverse text-primary font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-lg bg-primary text-white font-medium"
                    >
                        {isEditMode
                            ? "Update Category Type"
                            : "Save Category Type"}
                    </button>
                </div>
            }
        >
            <div className="px-6 pt-5 pb-4">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-primary">
                            {isEditMode
                                ? "Edit Row Category Type"
                                : "Add Row Category Type"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Create or update a new classification for your event
                            resources and equipment.
                        </p>
                    </div>

                    <button
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <i className="ki-filled ki-cross text-lg"></i>
                    </button>
                </div>

                <hr className="border-t border-gray-200 mb-6" />

                {/* Multi Language Input */}
                <div className="mb-6">
                    <MultiLangInputBox
                        label="Row Category Type"
                        name="categoryName"
                        value={form.categoryName}
                        onChange={handleCategoryNameChange}
                        onTranslate={handleTranslate}
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>

                    <select
                        value={form.status}
                        onChange={(e) => updateField("status", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-primary-clarity focus:outline-none"
                    >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </CustomModal>
    );
};

export default AddRowCategoryType;