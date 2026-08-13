import React, { useState } from "react";
import { translateText } from "@/utils/translate";
import { CustomModal } from "../custom-modal/CustomModal";
import MultiLangInputBox from "../form-inputs/input/Multilanginputbox";

const EMPTY_NOTES = { english: "", hindi: "", gujarati: "" };

export default function AddNotesModal({ open, onClose, onSave, initialValue }) {
  const [notes, setNotes] = useState(initialValue || EMPTY_NOTES);

  const handleChange = (name, updatedValue) => {
    setNotes(updatedValue);
  };

  const handleSave = () => {
    if (!notes.english.trim()) return; // required field guard
    onSave?.(notes);
    onClose?.();
  };

  const handleCancel = () => {
    setNotes(initialValue || EMPTY_NOTES);
    onClose?.();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleCancel}
      title="Add Notes"
      centered
      width={760}
      footer={
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!notes.english.trim()}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50"
          >
            Save
          </button>
        </div>
      }
    >
      <div className="px-6 pt-4 pb-2">
      <MultiLangInputBox
  label="Notes"
  name="notes"
  value={notes}
  onChange={handleChange}
  onTranslate={translateText}
  required
  multiline
  rows={4}
/>
      </div>
    </CustomModal>
  );
}