import { useEffect, useRef, useState } from "react";
import {
  User,
  PartyPopper,
  ListChecks,
  CalendarClock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Select } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { getbyeventid, getalltheme , getByModuleIdlistoftheme  ,getreportpdf } from "@/services/apiServices";
import { useAuthStore } from "@/store/useAuthStore";
import { MenuKeyReportmodal } from "./MenuKeyReportmodal";
import {  showApiError } from "@/utils/swalHelpers"; // ← adjust path if needed
import { ReportPdfViewerModal } from "./ReportPdfViewerModal"; // ← adjust path

const toId = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

const THEME_LIST_PAYLOAD = {
  isAutoAssign: null,
  nameEnglish: "",
  page: 0,
  size: 10,
  sortBy: "id",
  sortDirection: "DESC",
};

const SelectReportTypeModal = ({ open, onClose, eventId, onGenerateReport , mode , estimateId   }) => {
  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  const [themes, setThemes] = useState([]);
  const [loadingThemes, setLoadingThemes] = useState(false);

  const [selectedFunctionId, setSelectedFunctionId] = useState(null); // null = "All Functions"
  const [activeThemeId, setActiveThemeId] = useState(null);
const [showItineraryReport, setShowItineraryReport] = useState(false);
  const tabStripRef = useRef(null);
  const [reports, setReports] = useState([]);
const [loadingReports, setLoadingReports] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState(null);
const [menuModalOpen, setMenuModalOpen] = useState(false);
const userId = useAuthStore((state) => state.userId);
const [pdfUrl, setPdfUrl] = useState(null);
const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!open || !eventId) return;
    setLoadingEvent(true);
    getbyeventid(eventId)
      .then((res) => {
        const body = res?.data ?? res;
        const data = body?.data ?? body;
        setEventData(data);
      })
      .catch((err) => {
        console.error("Failed to load event details:", err);
        setEventData(null);
      })
      .finally(() => setLoadingEvent(false));
  }, [open, eventId]);

   useEffect(() => {
    if (!open) return;
    setLoadingThemes(true);
    getalltheme(THEME_LIST_PAYLOAD)
      .then((res) => {
        let list = res?.data?.data?.content ?? [];

       if (mode === "estimate") {
        list = list.filter((t) => t.nameEnglish === "Estimate");
      } else if (mode === "itinerary") {
        list = list.filter((t) => t.nameEnglish === "Itinerary Theme");
      }  else if (mode === "Execution") {
  list = list.filter((t) => t.nameEnglish === "Production Report");
  
} else if (mode === "flower") {
  list = list.filter((t) => t.nameEnglish === "Flower Report");
}
        // add more mode branches here as other pages start using this modal

        setThemes(list);
        setActiveThemeId(list.length ? list[0].id : null);
      })
      .catch((err) => {
        console.error("Failed to load themes:", err);
        setThemes([]);
        setActiveThemeId(null);
      })
      .finally(() => setLoadingThemes(false));
  }, [open, mode]);

  useEffect(() => {
    if (open) {
      setSelectedFunctionId(null);
    }
  }, [open]);

  const functionOptions = [
    { value: "all", label: "All Functions" },
    ...(eventData?.eventFunctions?.map((f) => ({
      value: String(toId(f.id)),
      label: f.nameEnglish,
    })) ?? []),
  ];

 useEffect(() => {
  if (!open || activeThemeId == null) {
    setReports([]);
    return;
  }
  setLoadingReports(true);

  const payload = {
    page: 0,
    size: 10,
    sortBy: "template_master_id",
    sortDirection: "ASC",
    templateModuleId: activeThemeId,
    userId: Number(localStorage.getItem("userId")) || null,
  };
  console.log("getByModuleIdlistoftheme payload:", payload);

  getByModuleIdlistoftheme(payload)
    .then((res) => {
      const list = res?.data?.data?.content ?? [];
      setReports(list);
    })
    .catch((err) => {
      console.error("Failed to load templates for module:", err);
      console.error("Response body:", err?.response?.data);
      setReports([]);
    })
    .finally(() => setLoadingReports(false));
}, [open, activeThemeId, userId]);

  const selectedFunctionLabel =
    selectedFunctionId == null
      ? "All Function"
      : eventData?.eventFunctions?.find((f) => toId(f.id) === selectedFunctionId)
          ?.nameEnglish ?? "All Function";

  const eventDateTime =
    eventData?.eventStartDate
      ? `${eventData.eventStartDate}${eventData?.eventStartTime ? ` ${eventData.eventStartTime}` : ""}`
      : "—";

  const activeTheme = themes.find((t) => t.id === activeThemeId) ?? null;
  const activeReports = [];

  const scrollTabs = (dir) => {
    tabStripRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

const handleGenerate = (report) => {
  const hasReportKeys = Array.isArray(report.reportKeys) && report.reportKeys.length > 0;

  if (hasReportKeys) {
    setSelectedTemplate(report);
    setMenuModalOpen(true);
    return;
  }

  const payload = {
    adminTemplateModuleId: report.id,
    estimateId: estimateId ?? 0,
    eventFunctionId: selectedFunctionId ?? -1,
    eventId: Number(eventId) || 0,
    reportKeys: {},
    userId: Number(localStorage.getItem("userId")) || 0,
  };
  console.log("getreportpdf payload:", payload);

  getreportpdf(payload)
    .then((res) => {
      const body = res?.data ?? res;
      const url = body?.data;
      const ok = body?.success !== false;

      if (ok && url) {
        setPdfUrl(url);
        setPreviewOpen(true);
        onGenerateReport?.(body);
      } else {
        showApiError({ response: { data: body } }, { title: "Failed to generate report" });
      }
    })
    .catch((err) => {
      console.error("Failed to generate report:", err);
      console.error("Response body:", err?.response?.data);
      showApiError(err, { title: "Failed to generate report" });
    });
};

const handleMenuGenerate = (result) => {
  onGenerateReport?.(result);
  setMenuModalOpen(false);
  setSelectedTemplate(null);
   
};
  return (
       <>
    <CustomModal
      open={open}
      onClose={onClose}
      centered
      width={860}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText size={16} className="text-white" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">Select Report Type</h2>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
        {/* Event info strip */}
        <div
          className={`flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl bg-gray-50 px-5 py-4 ${
            loadingEvent ? "opacity-50" : ""
          }`}
        >
          <InfoItem icon={User} label="Party Name" value={eventData?.partyNameEnglish} />
          <InfoItem icon={PartyPopper} label="Event Name" value={eventData?.eventNameEnglish} />
          <InfoItem icon={ListChecks} label="Function" value={selectedFunctionLabel} />
          <InfoItem icon={CalendarClock} label="Event Date & Time" value={eventDateTime} />
          <InfoItem icon={MapPin} label="Venue" value={eventData?.venueNameEnglish} />
        </div>

        {/* Function dropdown */}
        <div className="mt-5 max-w-xs">
          <label className="mb-1 block text-sm font-medium text-gray-700">Select Function</label>
          <Select
            className="w-full"
            value={selectedFunctionId == null ? "all" : String(selectedFunctionId)}
            onChange={(val) => setSelectedFunctionId(val === "all" ? null : toId(val))}
            options={functionOptions}
          />
        </div>

        {/* Theme tabs */}
       {/* Theme tabs */}
<div className="mt-5 flex items-center gap-1 border-b border-gray-100">
  <button
    type="button"
    onClick={() => scrollTabs(-1)}
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50"
  >
    <ChevronLeft size={14} />
  </button>

  <div ref={tabStripRef} className="flex flex-1 gap-6 overflow-x-hidden px-1">
    {loadingThemes ? (
      <span className="py-2.5 text-sm text-gray-400">Loading themes…</span>
    ) : themes.length === 0 ? (
      <span className="py-2.5 text-sm text-gray-400">No themes found.</span>
    ) : (
      themes.map((theme) => {
        const isActive = theme.id === activeThemeId;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => setActiveThemeId(theme.id)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 pb-2.5 pt-1 text-lg font-medium transition ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-gray-500  hover:text-gray-700"
            }`}
          >
            <FileText size={14} className={isActive ? "text-primary" : "text-gray-400"} />
            {theme.nameEnglish}
          </button>
        );
      })
    )}
  </div>

  <button
    type="button"
    onClick={() => scrollTabs(1)}
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50"
  >
    <ChevronRight size={14} />
  </button>
</div>

        {/* Report list */}
   
<div className="mt-4 flex flex-col gap-3">
  {!activeTheme ? (
    <div className="flex items-center justify-center py-12 text-md text-gray-400">
      {loadingThemes ? "Loading…" : "Select a theme."}
    </div>
  ) : loadingReports ? (
    <div className="flex items-center justify-center py-12 text-sm text-gray-400">
      Loading…
    </div>
  ) : reports.length === 0 ? (
    <div className="flex items-center justify-center py-12 text-sm text-gray-400">
      No reports available for this theme yet.
    </div>
  ) : (
    reports.map((report) => (
      <div
        key={report.id}
        className="flex items-center justify-between rounded-xl border border-gray-400 px-4 py-3.5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center   rounded-lg bg-gray-50">
            <FileText size={16} className="text-primary" />
          </div>
          <span className="text-md font-medium text-gray-800">{report.name}</span>
        </div>
        <button
          type="button"
          onClick={() => handleGenerate(report)}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white "
        >
          Generate Report
        </button>
      </div>
    ))
  )}
</div>
      </div>
     
    </CustomModal>
    <MenuKeyReportmodal
  open={menuModalOpen}
  onClose={() => {
    setMenuModalOpen(false);
    setSelectedTemplate(null);
  }}
  template={selectedTemplate}
  eventId={eventId}
  estimateId={estimateId}
  functionId={selectedFunctionId}
  mode={mode}
  onGenerate={handleMenuGenerate}
/>
<ReportPdfViewerModal
  open={previewOpen}
  onClose={() => { setPreviewOpen(false); setPdfUrl(null); }}
  pdfUrl={pdfUrl}
  title="Report Preview"
/>
</>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon size={16} className="text-primary" />
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-500">{value ?? "—"}</p>
    </div>
  </div>
);

export { SelectReportTypeModal };