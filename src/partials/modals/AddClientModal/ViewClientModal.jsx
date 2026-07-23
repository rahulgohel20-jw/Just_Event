import {
  Printer,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Landmark,
  Calendar,
  CreditCard,
  Clock,
  StickyNote,
  Plus,
  Pencil,
} from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const ViewClientModal = ({ open, onClose, client, onEdit, onAddNote }) => {
  if (!client) return null;

  const {
    initials = "NA",
    fullName,
    accountType = "Customer",
    accountStatus = "Active Account",
    relationshipStatus = "Standard",
    clientSince,
    loyaltyScore,
    clientCategory,
    birthDate,
    anniversary,
    primaryMobile,
    emailAddress,
    homeAddress,
    orderAddress,
    gstNumber,
    panNumber,
    aadharNumber,
    openingBalance,
    balanceType = "CR",
    totalEvents,
    totalRevenue,
    avgOrderValue,
    internalNote,
  } = client;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
       width={900}
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
            onClick={() => onEdit?.(client)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <Pencil size={16} />
            Edit Client Details
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#FBF1F3] px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7A2E45] text-sm font-semibold text-white">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F7E5EA] text-[#7A2E45] font-medium">
                  {accountType}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700">
              <Printer size={18} />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="md:col-span-2 space-y-4">
            {/* Personal Info */}
            <Card>
              <CardHeader icon={<User size={13} />} title="Personal Info" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name" value={fullName} />
                <Field label="Client Category" value={clientCategory} />
                <Field label="Birth Date" value={birthDate} icon={<Calendar size={12} />} />
                <Field label="Anniversary" value={anniversary} icon={<Calendar size={12} />} />
              </div>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader icon={<Phone size={13} />} title="Contact Details" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <IconBadge icon={<Phone size={14} />} />
                  <div>
                    <p className="text-xs text-gray-600">Primary Mobile</p>
                    <p className="text-sm font-medium text-gray-800">{primaryMobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IconBadge icon={<Mail size={14} />} />
                  <div>
                    <p className="text-xs text-gray-600">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{emailAddress}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader icon={<MapPin size={13} />} title="Address Information" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Home Address" value={homeAddress} icon={<MapPin size={12} />} />
                <Field label="Order Address" value={orderAddress} icon={<MapPin size={12} />} />
              </div>
            </Card>

            {/* Government & Financial */}
            <Card>
              <CardHeader icon={<Landmark size={13} />} title="Government & Financial" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="GST Number" value={gstNumber} />
                <Field label="PAN Number" value={panNumber} />
                <Field label="Aadhar Number" value={aadharNumber} />
                <div>
                  <p className="text-xs text-gray-400 mb-1">Opening Balance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      ₹ {openingBalance}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                      {balanceType}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Relationship status */}
            <div className="rounded-xl bg-[#7A2E45] text-white p-4">
              <p className="text-xs text-rose-200 mb-1">Relationship Status</p>
              <p className="text-lg font-semibold mb-3">{relationshipStatus}</p>
              <div className="flex items-center justify-between text-xs text-rose-100 border-t border-white/20 pt-3">
                <span>Client Since</span>
                <span className="font-medium text-white">{clientSince}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-rose-100 mt-2">
                <span>Loyalty Score</span>
                <span className="font-medium text-white">{loyaltyScore}/100</span>
              </div>
            </div>

            {/* Stat cards */}
            <StatCard icon={<Clock size={16} />} label="Total Events" value={totalEvents} />
            <StatCard icon={<CreditCard size={16} />} label="Total Revenue" value={`₹ ${totalRevenue}`} />
            <StatCard icon={<Clock size={16} />} label="Avg. Order Value" value={`₹ ${avgOrderValue}`} />

            {/* Internal notes */}
            <div className="rounded-xl bg-[#FBF1F3] p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <StickyNote size={13} className="text-[#7A2E45]" />
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">
                  Internal Notes
                </p>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "{internalNote}"
              </p>
              <button
                onClick={() => onAddNote?.(client)}
                className="flex items-center gap-1 text-xs font-medium text-[#7A2E45] mt-2 hover:underline"
              >
                <Plus size={12} />
                Add New Note
              </button>
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
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">{children}</div>
);

const CardHeader = ({ icon, title }) => (
  <div className="flex items-center gap-1.5 mb-3">
    <span className="text-[#7A2E45]">{icon}</span>
    <p className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">
      {title}
    </p>
  </div>
);

const Field = ({ label, value, icon }) => (
  <div>
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
      {icon && <span className="text-gray-400">{icon}</span>}
      {value || "—"}
    </p>
  </div>
);

const IconBadge = ({ icon }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBF1F3] text-[#7A2E45]">
    {icon}
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-xl bg-[#FBF1F3] p-4 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#7A2E45]">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export { ViewClientModal };