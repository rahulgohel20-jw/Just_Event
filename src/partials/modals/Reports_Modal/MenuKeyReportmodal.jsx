import { useEffect, useState } from "react";
import { Select } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { getreportpdf } from "@/services/apiServices";

const FONT_OPTIONS = [
  { value: "default", label: "Default" },

];

const LANGUAGES = [
  { code: "english", label: "English" },
  { code: "hindi", label: "Hindi" },
  { code: "gujarati", label: "ગુજરાતી" },
];

const MenuKeyReportmodal = ({ open, onClose, template, eventId, functionId, onGenerate }) => {
  const [language, setLanguage] = useState("english");

  const [categoryFontFamily, setCategoryFontFamily] = useState("default");
  const [itemFontFamily, setItemFontFamily] = useState("default");
  const [sloganFontFamily, setSloganFontFamily] = useState("default");

  const [categoryFontSize, setCategoryFontSize] = useState("default");
  const [itemFontSize, setItemFontSize] = useState("default");
  const [sloganFontSize, setSloganFontSize] = useState("default");

  const [keyToggles, setKeyToggles] = useState({}); // { [reportKeyId]: boolean }

   // seed toggles from the template's reportKeys whenever a new template opens
  useEffect(() => {
    if (!open || !template) return;
    const initial = {};
    (template.reportKeys ?? []).forEach((k) => {
      initial[k.reportKeyName] = !!k.isEnabled;
    });
    setKeyToggles(initial);
    setLanguage("english");
  }, [open, template]);

  const reportKeys = template?.reportKeys ?? [];
  const allChecked =
    reportKeys.length > 0 && reportKeys.every((k) => keyToggles[k.reportKeyName]);

  const toggleOne = (name) => {
    setKeyToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleAll = (checked) => {
    const next = {};
    reportKeys.forEach((k) => {
      next[k.reportKeyName] = checked;
    });
    setKeyToggles(next);
  };

 

   const handleGenerate = () => {
    const payload = {
      adminTemplateModuleId: template?.templateModuleId,
      eventFunctionId: functionId ?? 0,
      eventId: eventId ?? 0,
      reportKeys: keyToggles,
      userId: Number(localStorage.getItem("userId")) || 0,
    };
    console.log("getreportpdf payload:", payload);

        getreportpdf(payload)
      .then((res) => {
        const body = res?.data ?? res;
        const url = body?.data;
        if (url) window.open(url, "_blank");
        onGenerate?.(body);
      })
      .catch((err) => {
        console.error("Failed to generate report:", err);
        console.error("Response body:", err?.response?.data);
      });
  };


  return (
    <CustomModal open={open} onClose={onClose} centered width={640} title={template?.name ?? "Report Settings"}>
      <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
        {/* Language */}
       

      

               {/* Check all */}
        <div className="mt-1 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm font-semibold text-gray-800">Check All Options</span>
          <Toggle checked={allChecked} onChange={toggleAll} />
        </div>

        {/* Key list */}
        <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-gray-100">
          {reportKeys.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-400">
              No report keys for this template.
            </div>
          ) : (
            reportKeys.map((k, idx) => {
              const name = k.reportKeyName;
              return (
                <div
                  key={name}
                  className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 ${
                    idx !== reportKeys.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <span className="text-sm text-gray-700">{name}</span>
                  <Toggle checked={!!keyToggles[name]} onChange={() => toggleOne(name)} />
                </div>
              );
            })
          )}
        </div>

        {/* Generate */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
          >
            Generate Report
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

const FontField = ({ label, value, onChange }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    <Select className="w-full" value={value} onChange={onChange} options={FONT_OPTIONS} />
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? "bg-primary" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

export { MenuKeyReportmodal };