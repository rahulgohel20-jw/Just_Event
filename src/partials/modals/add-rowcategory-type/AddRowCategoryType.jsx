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
    isActive: true,
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
const userId = Number(localStorage.getItem("userId"));

    const isEditMode = Boolean(initialData);

   useEffect(() => {
    if (open) {
        if (initialData) {
            setForm({
                categoryName: {
                    english: initialData.nameEnglish || "",
                    hindi: initialData.nameHindi || "",
                    gujarati: initialData.nameGujarati || "",
                },
                isActive: initialData.isActive ?? true,
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

                     <div className="flex items-center gap-3">
        <button
            type="button"
            onClick={() => updateField("isActive", !form.isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                form.isActive ? "bg-primary" : "bg-gray-300"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
        <span
            className={`text-sm font-medium ${
                form.isActive ? "text-primary" : "text-gray-400"
            }`}
        >
            {form.isActive ? "Active" : "Inactive"}
        </span>
    </div>
                </div>
            </div>
        </CustomModal>
    );
};

export default AddRowCategoryType;