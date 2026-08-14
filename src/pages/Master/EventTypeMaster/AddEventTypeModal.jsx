import { useEffect, useRef, useState } from "react";
import { CloudUpload, Loader2, Save } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { addupadteeventtypemaster } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import MultiLangInputBox from "../../../components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "../../../services/apiServices";

const MAX_FILE_SIZE_MB = 2;
const emptyEventTypeName = { english: "", hindi: "", gujarati: "" };

const AddEventTypeModal = ({ open, onClose, onSave, initialData }) => {
    const [eventTypeName, setEventTypeName] = useState(emptyEventTypeName);
    const [typeImageFile, setTypeImageFile] = useState(null);
    const [typeImagePreview, setTypeImagePreview] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState("");
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const isEditMode = Boolean(initialData);
    const userId = Number(localStorage.getItem("userId")) || 1;

    useEffect(() => {
        if (open && initialData) {
            setEventTypeName({
                english: initialData.nameEnglish || initialData.categoryName?.english || "",
                hindi: initialData.nameHindi || initialData.categoryName?.hindi || "",
                gujarati: initialData.nameGujarati || initialData.categoryName?.gujarati || "",
            });
            setTypeImagePreview(
                initialData.typeImage || initialData.image || initialData.coverImage || ""
            );
            setTypeImageFile(null);
        } else if (open) {
            setEventTypeName(emptyEventTypeName);
            setTypeImageFile(null);
            setTypeImagePreview("");
            setFileError("");
        }
    }, [open, initialData]);

    const processFile = (file) => {
        if (!file) return;
        setFileError("");

        const validType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        if (!validType) {
            setFileError("Only JPG and PNG files are supported.");
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setFileError(`File must be under ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setTypeImageFile(file);
        setTypeImagePreview(previewUrl);
    };

    const handleFileInputChange = (e) => {
        processFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFile(e.dataTransfer.files?.[0]);
    };

    const removeImage = () => {
        setTypeImageFile(null);
        setTypeImagePreview("");
        setFileError("");
    };

    const handleReset = () => {
        setEventTypeName(emptyEventTypeName);
        setTypeImageFile(null);
        setTypeImagePreview("");
        setFileError("");
        onClose?.();
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
            console.error("Failed to translate function name:", err);
            return null;
        }
    };

    const handleSave = async () => {
        if (!eventTypeName?.english?.trim()) {
            return;
        }
        const payload = {
            id: initialData?.id ?? null,
            nameEnglish: eventTypeName.english.trim(),
            nameHindi: eventTypeName.hindi?.trim() || "",
            nameGujarati: eventTypeName.gujarati?.trim() || "",
            userId,
        };

        const formData = new FormData();
        const dataBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        formData.append("data", dataBlob);
        if (typeImageFile) {
            formData.append("image", typeImageFile);
        }

        setSaving(true);
        try {
            const res = await addupadteeventtypemaster(formData);
            const success = showApiResult(res, {
                successTitle: isEditMode ? "Event Type Updated" : "Event Type Saved",
                fallbackSuccess: "Your event type has been saved successfully.",
                errorTitle: "Save Failed",
                onSuccess: () => {
                    const body = res?.data ?? res;
                    onSave?.(body?.data ?? body);
                    handleReset();
                },
            });

            if (!success) return;
        } catch (err) {
            console.error("Failed to save event type:", err);
            showApiError(err, { title: "Save Failed" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <CustomModal
            open={open}
            onClose={handleReset}
            width={500}
            centered
            title={null}
            footer={
                <div className="flex justify-between items-center px-6 pb-6">
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isEditMode ? "Update" : "Save"}
                    </button>
                </div>
            }
        >
            <div className="max-h-[75vh] overflow-y-auto px-4 pb-4 pt-2">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-xl font-semibold text-[#7A2E45]">
                            {isEditMode ? "Edit Event Type" : "Add Event Type"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Create a new event type for your events.
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-gray-500 hover:text-gray-700 mt-1"
                    >
                        <i className="ki-filled ki-cross text-lg"></i>
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <MultiLangInputBox
                            label="Event Type Name"
                            name="eventTypeName"
                            required
                            value={eventTypeName}
                            onChange={(_, updated) => setEventTypeName(updated)}
                            onTranslate={handleTranslate}
                            disabled={saving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Type Image
                        </label>
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`min-h-[180px] rounded-xl border-2 border-dashed p-6 text-center transition-colors ${isDragging
                                ? "border-primary bg-[#FEF6F7]"
                                : "border-gray-300 bg-white hover:border-primary"
                                } cursor-pointer`}
                        >
                            {typeImagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={typeImagePreview}
                                        alt="Event Type"
                                        className="mx-auto h-40 w-40 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute -top-2 -right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7A2E45] text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E5EA] text-[#7A2E45]">
                                        <CloudUpload size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Upload Image</p>
                                        <p className="text-xs text-gray-400">
                                            Recommended size: 800x600px. Max file size: {MAX_FILE_SIZE_MB}MB.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />
                        </div>
                        {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};

export { AddEventTypeModal };
