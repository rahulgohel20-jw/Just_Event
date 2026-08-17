import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Phone, Pencil, Copy, Trash2 } from "lucide-react";
import { EVENT_MODULE_LINKS, buildModuleUrl } from "@/config/eventModuleLinks";

// Guessed field name for status — swap for the real one once confirmed.
// Falls back to "Pending" so the chip row still has something highlighted.
const STATUS_CHIPS = [
  { value: "inquiry", label: "Inquiry", activeClass: "border-blue-400 bg-blue-50 text-blue-700" },
  { value: "completed", label: "Completed", activeClass: "border-green-400 bg-green-50 text-green-700" },
  { value: "pending", label: "Pending", activeClass: "border-amber-400 bg-amber-50 text-amber-700" },
];

const EventViewModal = ({ isModalOpen, setIsModalOpen, eventData }) => {
  const navigate = useNavigate();

  const eventId = eventData?.id ?? null;
  const eventName = eventData?.eventNameEnglish || eventData?.partyNameEnglish || "Event";
  const partyName = eventData?.partyNameEnglish || "";
  const address = eventData?.venueNameEnglish || eventData?.venueAddress || "—";
  const mobile = eventData?.partyMobile || eventData?.mobileNo || "—";
  const eventDate = eventData?.eventStartDate || eventData?.inquiryDate || null;
  const currentStatus = (eventData?.eventStatus || eventData?.status || "pending").toLowerCase();

  const handleModalClose = () => setIsModalOpen(false);

  const handleModuleClick = (path) => {
    if (!eventId) return;
    navigate(buildModuleUrl(path, eventId));
    handleModalClose();
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Event Details"
        width={760}
        footer={[
          <div className="flex items-center justify-between" key="footer-buttons">
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              title="Delete"
            >
              <Trash2 size={14} />
              Delete
            </button>
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
        {/* Header summary */}
        <div className="flex items-start justify-between gap-4 pb-5">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{eventName}</h3>
            {partyName && partyName !== eventName && (
              <p className="mt-0.5 text-sm text-gray-500">{partyName}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {STATUS_CHIPS.map((chip) => (
              <span
                key={chip.value}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  currentStatus === chip.value
                    ? chip.activeClass
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 sm:grid-cols-2">
          <InfoRow icon={Calendar} label="Date" value={eventDate ?? "—"} />
          <InfoRow icon={Phone} label="Mobile" value={mobile} />
          <InfoRow icon={MapPin} label="Address" value={address} className="sm:col-span-2" />
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
                  onClick={() => handleModuleClick(link.path)}
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
            onClick={() => navigate("/add-event", { state: { eventId } })}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            title="Edit"
          >
            <Pencil size={15} />
            Edit
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            title="Copy Order"
          >
            <Copy size={15} />
            Copy Order
          </button>
        </div>
      </CustomModal>
    )
  );
};

const InfoRow = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-2.5 ${className}`}>
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
      <Icon size={15} />
    </div>
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default EventViewModal;