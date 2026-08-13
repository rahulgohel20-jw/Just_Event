import { Printer, X, MapPin, Phone, User, Mail, Globe, Pencil, Instagram, Calendar } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const SUB_VENUE_TYPE_LABELS = {
  RESORT_LAWN: "Resort Lawn",
  // add more mappings as your enum grows; falls back to raw value otherwise
};

const ViewVenueModal = ({ open, onClose, venue, onEdit }) => {
  if (!venue) return null;

  const {
    venueName,
    venueType,
    capacity,
    coverImage,
    images = [],
    status,
    subVenues = [],
    contactNo,
    mobileNo,
    email,
    website,
    instagram,
    addressEnglish,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
    remarks,
    createdAt,
  } = venue;

  const hasCoords = latitude && longitude;
  const mapUrl = hasCoords
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : null;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      width={640}
      centered
      title={null}
      footer={
        <div className="flex justify-end items-center px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Close
          </button>
         
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Hero image with overlay title */}
        <div className="relative h-48 rounded-t-xl overflow-hidden bg-gray-100">
          <img src={coverImage} alt={venueName} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/90 text-[#7A2E45] font-medium">
              {venueType}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/90 text-gray-700 font-medium">
              {capacity?.toLocaleString?.("en-IN")} Guests
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
          
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:text-gray-800"
            >
              <X size={14} />
            </button>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-lg font-semibold text-white">{venueName}</h2>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Venue Overview */}
          <Card>
            <CardHeader title="Venue Overview" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Venue Name" value={venueName} />
              <Field label="Venue Type" value={venueType} />
              <Field label="Total Capacity" value={capacity ? `${capacity.toLocaleString("en-IN")} Guests` : null} />
              <Field
                label="Created On"
                value={createdAt}
                icon={<Calendar size={12} className="text-gray-400" />}
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Sub-Venues */}
            <Card>
              <CardHeader title={`Sub-Venues (${subVenues.length})`} />
              <div className="space-y-2">
                {subVenues.length === 0 && (
                  <p className="text-xs text-gray-400">No sub-venues</p>
                )}
                {subVenues.map((sv) => (
                  <div
                    key={sv.id}
                    className="flex items-center justify-between rounded-lg bg-[#FBF1F3] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-[#7A2E45]" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          {sv.nameEnglish}
                          {sv.shortName && (
                            <span className="text-gray-700 font-normal"> ({sv.shortName})</span>
                          )}
                        </p>
                        <p className="text-[10px] text-gray-700">
                          {SUB_VENUE_TYPE_LABELS[sv.subVenueType] || sv.subVenueType}
                          {sv.capacity != null && ` · ${sv.capacity} Capacity`}
                          {sv.parking != null && ` · ${sv.parking} Parking`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        sv.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {sv.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Point */}
            <Card>
              <CardHeader title="Contact Point" />
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Phone size={12} className="text-gray-400" />
                  {contactNo || "—"}
                </div>
                {mobileNo && mobileNo !== contactNo && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Phone size={12} className="text-gray-400" />
                    {mobileNo} <span className="text-gray-400">(mobile)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Mail size={12} className="text-gray-400" />
                  {email || "—"}
                </div>
                {website && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Globe size={12} className="text-gray-400" />
                    {website}
                  </div>
                )}
                {instagram && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Instagram size={12} className="text-gray-400" />
                    {instagram}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <Card>
              <CardHeader title="Location" />
              <p className="text-sm text-gray-700">{addressEnglish || "—"}</p>
              <p className="text-xs text-gray-400 mt-1">
                {city}, {state}, {country} {pincode && `- ${pincode}`}
              </p>
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-medium text-[#7A2E45] hover:underline"
                >
                  View on Map
                </a>
              )}
            </Card>

            {/* Media Assets */}
            <Card>
              <CardHeader title="Media Assets" />
              {images.length === 0 ? (
                <p className="text-xs text-gray-400">No photos uploaded</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {images.slice(0, 4).map((img) => (
                    <img
                      key={img.id}
                      src={img.path}
                      alt=""
                      className="h-10 w-10 rounded object-cover border border-gray-100"
                    />
                  ))}
                  {images.length > 4 && (
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                      +{images.length - 4}
                    </span>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Internal Remarks */}
          {remarks && (
            <div className="rounded-xl bg-[#FBF1F3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-2">
                Remarks
              </p>
              <p className="text-xs text-gray-600 italic leading-relaxed">"{remarks}"</p>
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
  <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-3">{title}</p>
);

const Field = ({ label, value, icon }) => (
  <div>
    <p className="text-xs text-gray-900 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
      {icon}
      {value || "—"}
    </p>
  </div>
);

export { ViewVenueModal };