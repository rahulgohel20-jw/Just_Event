import { Printer, X, ShieldCheck, Phone, Mail, Pencil } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const ViewVendorModal = ({ open, onClose, vendor, onEdit }) => {
  if (!vendor) return null;

  const {
    initials = "NA",
    firmName,
    category,
    vendorFirmId,
    primaryMobile,
    emailAddress,
    fullAddress,
    city,
    zipCode,
    openingBalance,
    balanceType = "CR",
    gstNo,
    panNo,
    aadharNo,
    tdsRate,
    updatedInfo,
    isVerified,
    vendorName,
  } = vendor;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      width={900}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <div className="flex items-center gap-1.5 text-xs text-[#7A2E45] font-medium">
            {isVerified && (
              <>
                <ShieldCheck size={14} />
                Verified Vendor Entity
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onEdit?.(vendor)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
            >
              <Pencil size={16} />
              Edit Details
            </button>
          </div>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FBF1F3] px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-800">{vendorName}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F7E5EA] text-[#7A2E45] font-medium">
                  {category}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Vendor Code: <span className="text-[#7A2E45] font-medium">123456</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 hover:text-gray-700">
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Vendor Info */}
              <Card>
                <CardHeader title="Vendor Info" />
                <div className="space-y-3">
                  <Field label="Firm Name" value={firmName} />
                  <Field label="Category" value={category} />
                </div>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader title="Contact Details" />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Primary Mobile</p>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                      <Phone size={12} className="text-gray-400" />
                      {primaryMobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email Address</p>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                      <Mail size={12} className="text-gray-400" />
                      {emailAddress}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Business Address */}
            <Card>
              <CardHeader title="Business Address" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Address" value={fullAddress} className="col-span-2" />
                <Field label="City" value={city} />
                <Field label="Zip Code" value={zipCode} />
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="rounded-xl bg-[#FBF1F3] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-3">
                Financial Summary
              </p>

              <div className="rounded-lg bg-white p-3 mb-3">
                <p className="text-xs text-gray-600 mb-1">Opening Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-800">
                    ₹{openingBalance}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-800 text-white font-semibold">
                    {balanceType}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <SummaryRow label="GST No." value={gstNo} />
                <SummaryRow label="PAN" value={panNo} />
                <SummaryRow label="Aadhaar" value={aadharNo} />
                <SummaryRow label="TDS Rate" value={`${tdsRate}%`} />
              </div>

              {updatedInfo && (
                <p className="text-[11px] text-gray-600 mt-3 pt-3 border-t border-rose-100">
                  {updatedInfo}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const Card = ({ children }) => (
  <div className="rounded-xl border border-gray-100 bg-[#FBF1F3] p-4 shadow-sm ">
    {children}
  </div>
);

const CardHeader = ({ title }) => (
  <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45] mb-3">
    {title}
  </p>
);

const Field = ({ label, value, className = "" }) => (
  <div className={className}>
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-gray-600">{label}</span>
    <span className="text-xs font-medium text-gray-800">{value || "—"}</span>
  </div>
);

export { ViewVendorModal };