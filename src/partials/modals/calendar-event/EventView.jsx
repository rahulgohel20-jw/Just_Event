import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Phone, Pencil, Copy, Trash2, Loader2, X, BadgeCheck } from "lucide-react";
import { EVENT_MODULE_LINKS, buildModuleUrl } from "@/config/eventModuleLinks";
import { deleteeventbyid } from "@/services/apiServices";
import { showApiError, showApiResult, confirmDelete } from "@/utils/swalHelpers";
import { SelectReportTypeModal } from "../Reports_Modal/Selectreporttypemodal";

// Matches the backend EventStatus enum: INQUIRY, TENTATIVE, CONFIRM, CANCEL
const STATUS_STYLES = {
  INQUIRY: { label: "Inquiry", className: "border-blue-400 bg-blue-50 text-blue-700" },
  TENTATIVE: { label: "Tentative", className: "border-gray-300 bg-gray-50 text-gray-600" },
  CONFIRM: { label: "Confirm", className: "border-green-400 bg-green-50 text-green-700" },
  CANCEL: { label: "Cancel", className: "border-red-400 bg-red-50 text-red-700" },
};

const EventViewModal = ({ isModalOpen, setIsModalOpen, eventData, onDeleted }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
 const [reportModalOpen, setReportModalOpen] = useState(false);

  const eventId = eventData?.id ?? null;
  const eventName = eventData?.eventNameEnglish || eventData?.partyNameEnglish || "Event";
  const partyName = eventData?.partyNameEnglish || "";
  const address = eventData?.venueNameEnglish || eventData?.venueAddress || "—";
  const mobile = eventData?.partyMobile || eventData?.mobileNo || "—";
  const eventDate = eventData?.eventStartDate || eventData?.inquiryDate || null;
  const currentStatus = (eventData?.eventStatus || eventData?.status || "").toUpperCase();
  const statusInfo = STATUS_STYLES[currentStatus] || {
    label: currentStatus || "Unknown",
    className: "border-gray-300 bg-gray-50 text-gray-500",
  };
  const handleModuleClick = (link) => {
    if (!eventId) return;
    if (link.action === "openReportModal") {
      setReportModalOpen(true);
      return;
    }
    navigate(buildModuleUrl(link.path, eventId));
    handleModalClose();
  };
  const handleModalClose = () => setIsModalOpen(false);

 
  const handleDelete = async () => {
    if (!eventId) return;

    const confirmed = await confirmDelete(eventName || "this event");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await deleteeventbyid(eventId);
      const success = showApiResult(res, {
        successTitle: "Deleted",
        fallbackSuccess: "Event deleted successfully.",
        errorTitle: "Delete Failed",
      });
      if (success) {
        handleModalClose();
        onDeleted?.(eventId);
      }
    } catch (err) {
      showApiError(err, { title: "Delete Failed" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    isModalOpen && (
    <>
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        centered
        width={860}
        title={
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">{eventName}</h3>
              {partyName && partyName !== eventName && (
                <p className="text-xs text-gray-500 mt-0.5">{partyName}</p>
              )}
            </div>
          </div>
        }
        footer={[
          <div className="flex items-center justify-between px-6 py-3" key="footer-buttons">
            <button
              className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
          </div>,
        ]}
      >
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {/* Info row — date, mobile, address, status in one row */}
          <div className="grid grid-cols-4 gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <InfoRow icon={Calendar} label="Date" value={eventDate ?? "—"} />
            <InfoRow icon={Phone} label="Mobile" value={mobile} />
            <InfoRow icon={MapPin} label="Address" value={address} />
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <BadgeCheck size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Status</p>
                <span
                  className={`mt-0.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Module quick links */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Go to module
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {EVENT_MODULE_LINKS.map((link) => {
  const Icon = link.icon;
  return (
    <button
      key={link.path}
      type="button"
      onClick={() => handleModuleClick(link)}
      disabled={!eventId}
      title={link.title}
      className={
        link.primary
          ? "flex flex-col items-center gap-1.5 rounded-xl bg-primary px-3 py-3.5 text-center text-white shadow-sm transition hover:bg-rose-950 disabled:opacity-50"
          : "flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-3.5 text-center text-gray-700 transition hover:border-primary hover:text-primary disabled:opacity-50"
      }
    >
      <Icon size={18} />
      <span className="text-[11px] font-medium leading-tight">{link.title}</span>
    </button>
  );
})}
            </div>
          </div>

          {/* Secondary actions */}
          <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-gray-100 pt-5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                navigate(eventId ? `/creteevnetname?id=${eventId}` : "/creteevnetname")
              }
              className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              title="Edit"
            >
              <Pencil size={15} />
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || !eventId}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
              title="Delete"
            >
              {deleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </CustomModal>
      <SelectReportTypeModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        eventId={eventId}
        onGenerateReport={(params) => {
          console.log("generate report", params);
        }}
      />
    </>
    )
  );
};

const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-2.5 ${className}`}>
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
      <Icon size={15} />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

export default EventViewModal;