import { useEffect, useMemo, useState } from "react";
import { Save, Loader2, Search, ArrowRight, ArrowLeft, Check, KeyRound } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  addupadtethemtype,
  Translateapi,
  getallreportkey,
  getalltheme,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import Swal from "sweetalert2";

const initialFormState = {
  themeName: { english: "", hindi: "", gujarati: "" },
  isAutoAssign: true,
  reportKeyIds: [],
  templateModuleId: null,
};

const STEPS = [
  { id: 1, label: "Theme details" },
  { id: 2, label: "Report keys" },
];

const AddThemeType = ({ open, onClose, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [reportKeyOptions, setReportKeyOptions] = useState([]);
  const [reportKeySearch, setReportKeySearch] = useState("");
  const [templateModuleOptions, setTemplateModuleOptions] = useState([]);
  const [templateModuleLoading, setTemplateModuleLoading] = useState(false);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    const loadReportKeys = async () => {
      try {
        const res = await getallreportkey();
        const body = res?.data ?? res;
        const list = body?.data ?? [];
        setReportKeyOptions(
          list.map((item) => ({
            label: item.name,
            value: item.id,
            defaultValue: item.defaultValue,
          }))
        );
      } catch (err) {
        console.error("Failed to load report keys:", err);
        setReportKeyOptions([]);
      }
    };

    const loadTemplateModules = async () => {
      setTemplateModuleLoading(true);
      try {
        const res = await getalltheme({ page: 0, size: 100 });
        const body = res?.data ?? res;
        const content = body?.data?.content ?? body?.content ?? [];
        setTemplateModuleOptions(
          content.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      } catch (err) {
        console.error("Failed to load template modules:", err);
        setTemplateModuleOptions([]);
      } finally {
        setTemplateModuleLoading(false);
      }
    };

    loadReportKeys();
    loadTemplateModules();
    setReportKeySearch("");
    setStep(1);

    if (initialData) {
      setForm({
        themeName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        isAutoAssign: initialData.isAutoAssign ?? true,
        reportKeyIds: (initialData.keys || []).map((rk) => rk.reportKeyId),
        templateModuleId: initialData.templateModuleId
          ? Number(initialData.templateModuleId)
          : null,
      });
    } else {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const filteredReportKeyOptions = useMemo(() => {
    const query = reportKeySearch.trim().toLowerCase();
    if (!query) return reportKeyOptions;
    return reportKeyOptions.filter((opt) =>
      opt.label?.toLowerCase().includes(query)
    );
  }, [reportKeyOptions, reportKeySearch]);

  const handleThemeNameChange = (name, updatedValue) => {
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
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
      console.error("Failed to translate theme type name:", err);
      return null;
    }
  };

  const toggleReportKey = (reportKeyId) => {
    setForm((prev) => {
      const exists = prev.reportKeyIds.includes(reportKeyId);
      return {
        ...prev,
        reportKeyIds: exists
          ? prev.reportKeyIds.filter((id) => id !== reportKeyId)
          : [...prev.reportKeyIds, reportKeyId],
      };
    });
  };

  const handleTemplateModuleChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setForm((prev) => ({ ...prev, templateModuleId: value }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setReportKeySearch("");
    setStep(1);
    onClose();
  };

  const handleNext = () => {
    if (!form.themeName.english?.trim()) {
      Swal.fire("Required", "Please enter the theme type name in English.", "warning");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSave = async () => {
    const payload = {
      id: initialData?.id ?? null,
      isAutoAssign: form.isAutoAssign,
      nameEnglish: form.themeName.english,
      nameGujarati: form.themeName.gujarati,
      nameHindi: form.themeName.hindi,
      templateModuleId: form.templateModuleId ?? 0,
      reportKeys: reportKeyOptions
        .filter((opt) => form.reportKeyIds.includes(opt.value))
        .map((opt) => ({
          id:
            initialData?.keys?.find((rk) => rk.reportKeyId === opt.value)
              ?.id || null,
          reportKeyId: opt.value,
        })),
    };

    setSaving(true);
    try {
      const res = await addupadtethemtype(payload);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Theme Type Updated" : "Theme Type Saved",
        fallbackSuccess: "Operation completed successfully.",
        errorTitle: "Failed",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          setForm(initialFormState);
          setStep(1);
          onClose?.();
        },
      });

      if (!success) return;
    } catch (err) {
      console.error("Failed to save theme type:", err);
      showApiError(err, { title: "Failed" });
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
            onClick={step === 1 ? handleReset : handleBack}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#F7E5EA] text-primary font-medium transition-colors disabled:opacity-60"
          >
            {step === 2 && <ArrowLeft size={16} />}
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step === 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
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
              {isEditMode ? "Update Theme Type" : "Save Theme Type"}
            </button>
          )}
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl  text-primary">
              {isEditMode ? "Edit Theme Type" : "Add Theme Type"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create or update theme types used for template assignment.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step === s.id
                      ? "bg-primary text-white"
                      : step > s.id
                      ? "bg-[#F7E5EA] text-primary"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    step === s.id ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 transition-colors ${
                    step > s.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: theme details */}
        {step === 1 && (
          <div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Template Module
              </label>
              <select
                value={form.templateModuleId ?? ""}
                onChange={handleTemplateModuleChange}
                disabled={templateModuleLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
              >
                <option value="">
                  {templateModuleLoading ? "Loading..." : "Select Template Module"}
                </option>
                {templateModuleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <MultiLangInputBox
                label="Theme Type Name"
                name="themeName"
                value={form.themeName}
                onChange={handleThemeNameChange}
                onTranslate={handleTranslate}
                required
              />
            
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Auto Assign
                </p>
                <p className="text-xs text-gray-400">
                  Automatically assign this theme to new templates.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, isAutoAssign: !prev.isAutoAssign }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  form.isAutoAssign ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isAutoAssign ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: report keys */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7E5EA] text-primary">
                  <KeyRound size={15} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Select the report keys for this theme
                  </p>
                  <p className="text-xs text-gray-400">
                    {form.reportKeyIds.length} of {reportKeyOptions.length} selected
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mb-3">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={reportKeySearch}
                onChange={(e) => setReportKeySearch(e.target.value)}
                placeholder="Search report keys..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {reportKeyOptions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No report keys available.
              </p>
            ) : filteredReportKeyOptions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No report keys match "{reportKeySearch}".
              </p>
            ) : (
              <div className="rounded-lg border border-gray-200 max-h-64 overflow-y-auto divide-y divide-gray-100">
                {filteredReportKeyOptions.map((opt) => {
                  const checked = form.reportKeyIds.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className="text-sm text-gray-700">{opt.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleReportKey(opt.value)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          checked ? "bg-primary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            checked ? "translate-x-4.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export { AddThemeType };