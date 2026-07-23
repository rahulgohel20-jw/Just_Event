import { Printer, X, MapPin, Phone, User, Mail, Globe, Pencil } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const ViewVenueModal = ({ open, onClose, venue, onEdit }) => {
  if (!venue) return null;

  const {
    venueName,
    venueType,
    capacity,
    coverImage,
    tagline,
    operationalHours,
    subVenues = [],
    primaryContact,
    phone,
    email,
    website,
    fullAddress,
    city,
    state,
    photoCount,
    internalRemarks,
  } = venue;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      width={640}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit?.(venue)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <Pencil size={16} />
            Edit Venue Details
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Hero image with overlay title */}
        <div className="relative h-48 rounded-t-xl overflow-hidden">
          <img src={coverImage} alt={venueName} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/90 text-[#7A2E45] font-medium">
              {venueType}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/90 text-gray-700 font-medium">
              {capacity?.toLocaleString?.("en-IN")} Guests
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-800">
              <Printer size={14} />
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-800"
            >
              <X size={14} />
            </button>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg font-semibold text-white">{venueName}</h2>
            {tagline && <p className="text-xs text-rose-100 mt-0.5">{tagline}</p>}
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Venue Overview */}
          <Card>
            <CardHeader title="Venue Overview" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Venue Name" value={venueName} />
              <Field label="Venue Type" value={venueType} />
              <Field label="Total Capacity" value={`${capacity?.toLocaleString?.("en-IN")} Guests`} />
              <Field label="Operational Hours" value={operationalHours} />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Sub-Venues */}
            <Card>
              <CardHeader title="Sub-Venues" />
              <div className="space-y-2">
                {subVenues.map((sv, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[#FBF1F3] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#7A2E45]" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{sv.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {sv.underRenovation
                            ? "Under Renovation"
                            : `${sv.code} · ${sv.capacity} Capacity`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Point */}
            <Card>
              <CardHeader title="Contact Point" />
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-gray-400" />
                  <span className="text-gray-500">Primary Contact</span>
                </div>
                <p className="text-sm font-medium text-gray-800">{primaryContact}</p>
                <div className="flex items-center gap-1.5 text-gray-700 mt-2">
                  <Phone size={12} className="text-gray-400" />
                  {phone}
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Mail size={12} className="text-gray-400" />
                  {email}
                </div>
                {website && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Globe size={12} className="text-gray-400" />
                    {website}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <Card>
              <CardHeader title="Location" />
              <p className="text-sm text-gray-700">{fullAddress}</p>
              <p className="text-xs text-gray-400 mt-1">
                {city}, {state}
              </p>
            </Card>

            {/* Media Assets */}
            <Card>
              <CardHeader title="Media Assets" />
              <button className="text-xs font-medium text-[#7A2E45] hover:underline">
                View All {photoCount} Photos
              </button>
            </Card>
          </div>

          {/* Internal Remarks */}
          {internalRemarks && (
            <div className="rounded-xl bg-[#FBF1F3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-2">
                Internal Remarks
              </p>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "{internalRemarks}"
              </p>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const Card = ({ children }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">{children}</div>
);

const CardHeader = ({ title }) => (
  <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-3">
    {title}
  </p>
);

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export { ViewVenueModal };