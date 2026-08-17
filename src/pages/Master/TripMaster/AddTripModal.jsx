import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";
import { AddTrip } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const emptyTripName = { english: "", hindi: "", gujarati: "" };

const AddTripModal = ({ open, onClose, onSave, initialData }) => {
  const [tripName, setTripName] = useState(emptyTripName);
  const [saving, setSaving] = useState(false);
  const isEditMode = Boolean(initialData);
  const UserId = localStorage.getItem("userId")

  useEffect(() => {
    if (open && initialData) {
      setTripName({
        english: initialData.tripName?.english || initialData.nameEnglish || "",
        hindi: initialData.tripName?.hindi || initialData.nameHindi || "",
        gujarati: initialData.tripName?.gujarati || initialData.nameGujarati || "",
      });
    } else if (open && !initialData) {
      setTripName(emptyTripName);
    }
  }, [open, initialData]);

  const handleTranslate = async (englishText) => {
    try {
      const res = await Translateapi(englishText);
      const data = res?.data?.data || res?.data || {};
      return {
        hindi: data.hindi || data.hi || "",
        gujarati: data.gujarati || data.gu || "",
      };
    } catch (err) {
      console.error("Translate API failed:", err);
      return null;
    }
  };

  const handleReset = () => {
    setTripName(emptyTripName);
    onClose();
  };

  const handleSave = async () => {
    if (!tripName.english?.trim()) return;

    const payload = {
      id: isEditMode && initialData?.id ? initialData.id : null,
      nameEnglish: tripName.english,
      nameGujarati: tripName.gujarati,
      nameHindi: tripName.hindi,
      userId: UserId,
    };

    setSaving(true);
    try {
      const res = await AddTrip(payload);

      showApiResult(res, {
        successTitle: isEditMode ? "Trip Updated" : "Trip Saved",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          handleReset();
        },
      });
    } catch (err) {
      console.error("Save trip failed:", err);
      showApiError(err, { title: "Something went wrong" });
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
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
          >
            <i className="ki-filled ki-note text-base"></i>
            {saving ? "Saving..." : isEditMode ? "Update Trip" : "Save Trip"}
          </button>
        </div>
      }
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Trip" : "Add Trip"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update this trip's name."
                : "Create a new trip for organizing client bookings and itineraries."}
            </p>
          </div>
          <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 mt-1">
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-5" />

        <div className="mb-4">
          <MultiLangInputBox
            label="Trip Name"
            name="tripName"
            value={tripName}
            onChange={(_, updated) => setTripName(updated)}
            onTranslate={handleTranslate}
            required
            disabled={saving}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export { AddTripModal };