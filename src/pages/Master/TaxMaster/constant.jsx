import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Tax Master",
  description:
    "Manage GST, CGST, SGST, IGST, and other taxation percentages used throughout the event management system.",
  addButtonLabel: "Add Tax",
};

export const STATS_CARDS = [
  {
    key: "totalTaxTypes",
    label: "Total Tax Types",
    value: "8",
    icon: "receipt",
  },
  {
    key: "activeTaxes",
    label: "Active Taxes",
    value: "7",
    icon: "check",
  },
  {
    key: "recentlyUpdated",
    label: "Recently Updated",
    value: "Today",
    icon: "clock",
  },
];

export const TAX_NAME_FILTER_OPTIONS = [
  { value: "cgst", label: "CGST" },
  { value: "sgst", label: "SGST" },
  { value: "igst", label: "IGST" },
  { value: "service-tax", label: "Service Tax" },
];

export const TAX_TABLE_DATA = [
  {
    id: 1,
    taxName: "CGST",
    percentage: 9,
    status: "active",
  },
  {
    id: 2,
    taxName: "SGST",
    percentage: 9,
    status: "active",
  },
  {
    id: 3,
    taxName: "IGST",
    percentage: 18,
    status: "active",
  },
  {
    id: 4,
    taxName: "Service Tax",
    percentage: 5,
    status: "inactive",
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "taxName", desc: false }];

export const getTaxColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
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
    accessorKey: "taxName",
    header: "Tax Name",
    cell: ({ getValue }) => (
      <span className="text-sm font-semibold text-gray-800">{getValue()}</span>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ getValue }) => (
      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
        {getValue()}%
      </span>
    ),
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