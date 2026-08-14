import { useEffect, useMemo, useState } from "react";
import { Save, Loader2, Search } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import {
  addupadtethemtype,
  Translateapi,
  getallreportkey,
  getalltheme,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  themeName: { english: "", hindi: "", gujarati: "" },
  isAutoAssign: true,
  reportKeyIds: [],
  templateModuleId: null,
};

const AddThemeType = ({ open, onClose, onSave, initialData }) => {
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
        // response shape: { msg, data: [{ id, name, defaultValue, createdAt }], success }
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

   if (initialData) {
      setForm({
        themeName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        isAutoAssign: initialData.isAutoAssign ?? true,
        // "keys" (not "reportKeys") is the array name from the list API.
        // isAssigned comes back null on the list endpoint, so fall back to defaultValue.
        reportKeyIds: (initialData.keys || [])
          .filter((rk) => (rk.isAssigned ?? rk.defaultValue) === true)
          .map((rk) => rk.reportKeyId),
        // templateModuleId comes back as a string ("2") from the list API
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
    onClose();
  };

 const handleSave = async () => {
    // matches the exact payload shape required by /template-mapping/add-update
    const payload = {
      id: initialData?.id ?? null,
      isAutoAssign: form.isAutoAssign,
      nameEnglish: form.themeName.english,
      nameGujarati: form.themeName.gujarati,
      nameHindi: form.themeName.hindi,
      templateModuleId: form.templateModuleId ?? 0,
      reportKeys: reportKeyOptions.map((opt) => ({
        id:
          initialData?.keys?.find((rk) => rk.reportKeyId === opt.value)
            ?.id || null,
        reportKeyId: opt.value,
        isAssigned: form.reportKeyIds.includes(opt.value),
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
          onClose?.();
        },
      });

      if (!success) {
        // stays open so the user can fix the input and retry
        return;
      }
    } catch (err) {
      console.error("Failed to save theme type:", err);
      showApiError(err, {
        title: "Failed",
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
            {isEditMode ? "Update Theme Type" : "Save Theme Type"}
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-primary">
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
          <p className="text-xs text-gray-400 mt-2">
            e.g., Exclusive Theme, Back Office Theme
          </p>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Auto Assign
          </label>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, isAutoAssign: !prev.isAutoAssign }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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

        {/* Report Keys: search + checkbox list */}
        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Report Keys
          </label>

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
            <p className="text-xs text-gray-400">No report keys available.</p>
          ) : filteredReportKeyOptions.length === 0 ? (
            <p className="text-xs text-gray-400">
              No report keys match "{reportKeySearch}".
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredReportKeyOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={form.reportKeyIds.includes(opt.value)}
                    onChange={() => toggleReportKey(opt.value)}
                    className="accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export { AddThemeType };