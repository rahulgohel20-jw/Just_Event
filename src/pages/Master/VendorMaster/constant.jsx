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

export const STATUS_FILTER = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "decor-styling", label: "Decor & Styling" },
  { value: "audio-visual", label: "Audio Visual" },
  { value: "printing-services", label: "Printing Services" },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { sortBy: "id", sortDirection: "DESC" };

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
      const { vendorName, initials } = row.original;
      return (
        <div className="flex items-center gap-3">
        
          <div>
            <p className="">{vendorName}</p>
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
      return <span>{value}</span>;
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
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="flex items-center justify-start gap-2 text-rose-700">
          <button onClick={() => onView(record)} className="btn btn-sm btn-icon btn-clear">
            <i className="ki-filled ki-eye text-primary"></i>
          </button>
          <button className="btn btn-sm btn-icon btn-clear" type="button" onClick={() => onEdit?.(record)}>
            <i className="ki-filled ki-notepad-edit text-third"></i>
          </button>
          <button className="tn btn-sm btn-icon btn-clear text-danger" type="button" onClick={() => onDelete?.(record)}>
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];