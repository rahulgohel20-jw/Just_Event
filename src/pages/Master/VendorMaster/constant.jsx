import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Vendor Master",
  description:
    "Manage all vendor profiles, service providers, business details, and financial information for event operations.",
  addButtonLabel: "Add Vendor",
};

export const STATS_CARDS = [
  {
    key: "totalVendors",
    label: "Total Vendors",
    value: "1,258",
    badge: "+12%",
    badgeTone: "positive",
    icon: "users",
  },
  {
    key: "activeVendors",
    label: "Active Vendors",
    value: "842",
    badge: "71%",
    badgeTone: "neutral",
    icon: "check",
  },
  {
    key: "newThisMonth",
    label: "New This Month",
    value: "24",
    badge: "New",
    badgeTone: "positive",
    icon: "trending",
  },
  {
    key: "vendorCategories",
    label: "Vendor Categories",
    value: "18",
    badge: null,
    badgeTone: "neutral",
    icon: "category",
  },
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "decor-styling", label: "Decor & Styling" },
  { value: "audio-visual", label: "Audio Visual" },
  { value: "printing-services", label: "Printing Services" },
];

export const VENDOR_TABLE_DATA = [
  {
    id: 1,
    vendorName: "Savory Selections Ltd.",
    firmId: "#VEN-9021",
    mainCategory: "Catering",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "SS",
  },
  {
    id: 2,
    vendorName: "Prism Vision Studios",
    firmId: "#VEN-8842",
    mainCategory: "Photography",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "PV",
  },
  {
    id: 3,
    vendorName: "Ethereal Spaces Decor",
    firmId: "#VEN-7711",
    mainCategory: "Decor & Styling",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "ES",
  },
  {
    id: 4,
    vendorName: "Sonic Waves AV",
    firmId: "#VEN-6501",
    mainCategory: "Audio Visual",
    status: "inactive",
    mobileNumber: "+1 555 012 3456",
    initials: "SW",
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "vendorName", desc: false }];

const categoryBadgeStyles = {
  Catering: "bg-rose-50 text-rose-700",
  Photography: "bg-purple-50 text-purple-700",
  "Decor & Styling": "bg-pink-50 text-pink-700",
  "Audio Visual": "bg-blue-50 text-blue-700",
  "Printing Services": "bg-amber-50 text-amber-700",
};

export const getVendorColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "vendorName",
    header: "Vendor Name",
    cell: ({ row }) => {
      const { vendorName, firmId, initials } = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{vendorName}</p>
            <p className="text-xs text-gray-400">Firm ID: {firmId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "mainCategory",
    header: "Main Category",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            categoryBadgeStyles[value] || "bg-gray-100 text-gray-700"
          }`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => onToggleStatus(row.original)}
            style={{ backgroundColor: isActive ? "#881337" : "#e5e7eb" }}
            className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none"
          >
            <span
              style={{ transform: isActive ? "translateX(18px)" : "translateX(2px)" }}
              className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
            />
          </button>
          <span
            className={`text-xs font-medium ${
              isActive ? "text-rose-800" : "text-gray-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">{getValue()}</span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-gray-400">
        <button onClick={() => onView(row.original)} className="hover:text-rose-800">
          <Eye size={16} />
        </button>
        <button onClick={() => onEdit(row.original)} className="hover:text-rose-800">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(row.original)} className="hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];