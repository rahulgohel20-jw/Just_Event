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

export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORT_BY = "id";
export const DEFAULT_SORT_DIRECTION = "DESC";
export const DEFAULT_SORTING = [{ id: "taxNameEnglish", desc: false }];


export const getTaxColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {String(row.index + 1).padStart(2,)}
      </span>
    ),
  },
  {
    accessorKey: "taxNameEnglish",
    header: "Tax Name",
    cell: ({ getValue }) => (
      <span className="">{getValue()}</span>
    ),
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
    cell: ({ getValue }) => (
      <span className="">
        {getValue()}%
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-500">{getValue() || "-"}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = Boolean(row.original.isActive);
      return (
        <span
         
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-gray-400">
        <button
          className="btn btn-sm btn-icon btn-clear"
          type="button"
          onClick={() => onEdit(row.original)}
        >
          <i className="ki-filled ki-notepad-edit text-third"></i>
        </button>
        <button
          className="btn btn-sm btn-icon btn-clear text-danger"
          type="button"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];