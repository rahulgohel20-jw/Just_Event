import React, { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Select } from "antd";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { BILLING_CYCLE_OPTIONS } from "./constant";
import { addupdateplan, Translateapi } from "@/services/apiServices";

const emptyFeature = () => ({
  featureText: { english: "", hindi: "", gujarati: "" },
});

const initialFormState = {
  planName: { english: "", hindi: "", gujarati: "" },
  description: "",
  billingCycle: null,
  price: "",
  originalPrice: "",
  isPopular: false,
  features: [emptyFeature()],
};

const AddPlan = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const userId = Number(localStorage.getItem("userId"));

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        planName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        description: initialData.description || "",
        billingCycle: initialData.billingCycle ?? null,
        price: initialData.price ?? "",
        originalPrice: initialData.originalPrice ?? "",
        isPopular: initialData.isPopular ?? false,
        features:
          initialData.features && initialData.features.length > 0
            ? initialData.features.map((f) => ({
                featureText: {
                  english: f.featureTextEnglsih || "",
                  hindi: f.featureTextHindi || "",
                  gujarati: f.featureTextGujarati || "",
                },
              }))
            : [emptyFeature()],
      });
    } else {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlanNameChange = (name, updatedValue) => {
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleFeatureTextChange = (index, _name, updatedValue) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, featureText: updatedValue } : f
      ),
    }));
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
      console.error("Failed to translate:", err);
      return null;
    }
  };

  const addFeatureRow = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, emptyFeature()] }));
  };

  const removeFeatureRow = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.length > 1 ? prev.features.filter((_, i) => i !== index) : prev.features,
    }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        id: initialData?.id ?? null,
        nameEnglish: form.planName.english,
        nameHindi: form.planName.hindi,
        nameGujarati: form.planName.gujarati,
        description: form.description,
        billingCycle: form.billingCycle,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || 0,
        isPopular: Boolean(form.isPopular),
        userId,
        features: form.features
          .filter((f) => f.featureText.english?.trim())
          .map((f) => ({
            featureTextEnglsih: f.featureText.english, // ⚠️ typo kept intentionally — matches the API payload field name
            featureTextHindi: f.featureText.hindi,
            featureTextGujarati: f.featureText.gujarati,
          })),
      };

      const res = await addupdateplan(data);

      showApiResult(res, {
        successTitle: isEditMode ? "Plan Updated" : "Plan Added",
        onSuccess: async () => {
          await onSave?.();
          handleReset();
        },
      });
    } catch (err) {
      showApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={800}
      centered
      title={null}
      footer={
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-primary-clarity text-primary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isEditMode ? "Update Plan" : "Save"}
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-6 pt-2 pb-4">
        <div className="flex justify-between items-start mb-6 pt-2">
          <div>
            <h2 className="text-xl font-semibold text-dark m-0">
              {isEditMode ? "Edit Plan" : "Add Plan"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Enter the plan details below</p>
          </div>
          <button onClick={handleReset}>
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="mb-6">
          <MultiLangInputBox
            label="Plan Name"
            name="planName"
            value={form.planName}
            onChange={handlePlanNameChange}
            onTranslate={handleTranslate}
            required
          />
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium mb-2 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Billing Cycle</label>
            <Select
              value={form.billingCycle}
              onChange={(value) => updateField("billingCycle", value)}
              options={BILLING_CYCLE_OPTIONS}
              placeholder="Select Billing Cycle"
              size="large"
              className="w-full"
            />
          </div>
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => updateField("isPopular", e.target.checked)}
              />
              Mark as Popular
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0"
              className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Original Price</label>
            <input
              type="number"
              value={form.originalPrice}
              onChange={(e) => updateField("originalPrice", e.target.value)}
              placeholder="0"
              className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-primary-clarity p-5 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">Features</h3>
            <button
              type="button"
              onClick={addFeatureRow}
              className="flex items-center gap-1 rounded-lg bg-primary text-white px-3 py-1.5 text-sm"
            >
              <Plus size={14} />
              Add Feature
            </button>
          </div>

          <div className="space-y-4">
            {form.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex-1">
                  <MultiLangInputBox
                    label={`Feature ${index + 1}`}
                    name={`feature-${index}`}
                    value={feature.featureText}
                    onChange={(name, updatedValue) => handleFeatureTextChange(index, name, updatedValue)}
                    onTranslate={handleTranslate}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeatureRow(index)}
                  disabled={form.features.length === 1}
                  className="btn btn-sm btn-icon btn-clear text-danger disabled:opacity-30 mt-8"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddPlan;