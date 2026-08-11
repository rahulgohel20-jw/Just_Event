import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { addupdaterolemaster, Translateapi } from "../../../services/apiServices";


const initialFormState = {
    roleName: {
        english: "",
        hindi: "",
        gujarati: "",
    },
};

export const AddRole = ({ open, onClose, onSave, initialData }) => {
    const [form, setForm] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const isEditMode = Boolean(initialData);
  const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        if (open && initialData) {
            setForm({
                roleName: {
                    english: initialData.nameEnglish || "",
                    hindi: initialData.nameHindi || "",
                    gujarati: initialData.nameGujarati || "",
                },
            });
        } else if (open) {
            setForm(initialFormState);
        }
    }, [open, initialData]);

    const updateField = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleReset = () => {
        setForm(initialFormState);
        onClose();
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
            console.error("Failed to translate role name:", err);
            return null;
        }
    };
    const handleRoleNameChange = (name, updatedValue) => {
        setForm((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
    };
    const handleSave = async () => {
        if (!form.roleName.english.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Role Name is required.",
            });
            return;
        }

        const payload = {
            id: initialData?.id ?? null,
            nameEnglish: form.roleName.english,
            nameGujarati: form.roleName.gujarati,
            nameHindi: form.roleName.hindi,
            userId,
        };

        setSaving(true);

        try {
            const res = await addupdaterolemaster(payload);

            const body =
                res?.data && typeof res.data === "object" && "success" in res.data
                    ? res.data
                    : res;

            if (body?.success) {
                onSave?.(body?.data ?? body);

                Swal.fire({
                    icon: "success",
                    title: isEditMode ? "Role Updated" : "Role Saved",
                    text: body?.msg || "Operation completed successfully.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                handleReset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed",
                    text:
                        body?.errorMessage ||
                        body?.msg ||
                        "Something went wrong.",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    err?.response?.data?.errorMessage ||
                    err?.response?.data?.msg ||
                    err?.message,
            });
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
                        {isEditMode ? "Update Role" : "Save Role"}
                    </button>
                </div>
            }
        >
            <div className="px-6 pt-5 pb-4">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-primary">
                            {isEditMode ? "Edit Role" : "Add Role"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Create or update roles used across the system.
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700 mt-1"
                    >
                        <i className="ki-filled ki-cross text-lg"></i>
                    </button>
                </div>
                {/* 
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Name (English)
                        </label>
                        <input
                            type="text"
                            value={form.nameEnglish}
                            onChange={(e) => updateField("nameEnglish", e.target.value)}
                            placeholder="e.g., Admin"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Name (Gujarati)
                        </label>
                        <input
                            type="text"
                            value={form.nameGujarati}
                            onChange={(e) => updateField("nameGujarati", e.target.value)}
                            placeholder="Name (Gujarati)"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Name (Hindi)
                        </label>
                        <input
                            type="text"
                            value={form.nameHindi}
                            onChange={(e) => updateField("nameHindi", e.target.value)}
                            placeholder="Name (Hindi)"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] text-sm"
                        />
                    </div>
                </div> */}
                <div className="mb-6">
                    <MultiLangInputBox
                        label="Role Name"
                        name="roleName"
                        value={form.roleName}
                        onChange={handleRoleNameChange}
                        onTranslate={handleTranslate}
                        required
                    />

                    <p className="text-xs text-gray-400 mt-2">
                        e.g., Administrator, Manager, Staff
                    </p>
                </div>
            </div>
        </CustomModal>
    );
};

export default AddRole;
