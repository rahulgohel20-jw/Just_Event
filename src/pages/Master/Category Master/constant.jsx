import { Layers, CheckCircle2, PauseCircle, BarChart3, Eye, Trash2, Edit } from "lucide-react";

export const PAGE_HEADER = {
  title: "Category Master",
  description:
    "Manage categories used across client registrations and event records for precision reporting.",
  addButtonLabel: "Add Category",
};

export const STATS_CARDS = [
  { key: "total", label: "Total Categories", value: "42", subtext: "+4% this month", icon: Layers },
  { key: "active", label: "Active Categories", value: "39", subtext: "Currently operational", icon: CheckCircle2 },
  { key: "inactive", label: "Inactive Categories", value: "3", subtext: "Pending review", icon: PauseCircle },
  { key: "usage", label: "System Usage", value: "92%", subtext: "Across all events", icon: BarChart3 },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const CATEGORY_NAME_FILTER_OPTIONS = [
  { label: "All Categories", value: "" },
  { label: "Client Details", value: "client-details" },
  { label: "Luxury Partner", value: "luxury-partner" },
  { label: "Fortune 500", value: "fortune-500" },
  { label: "Legacy Accounts", value: "legacy-accounts" },
];

export const getCategoryColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    id: "srNo",
    accessorKey: "srNo",
    header: "Sr No. ",
    size: 90,
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    id: "categoryNameEnglish",
    accessorKey: "categoryName",
    header: "Name (English)",
    cell: ({ row }) => <p>{row.original.categoryName?.english || "-"}</p>,
  },
  {
    id: "categoryNameGujarati",
    accessorKey: "categoryNameGujarati",
    header: "Name (Gujarati)",
    cell: ({ row }) => <span>{row.original.categoryName?.gujarati || "-"}</span>,
  },
  {
    id: "categoryNameHindi",
    accessorKey: "categoryNameHindi",
    header: "Name (Hindi)",
    cell: ({ row }) => <span>{row.original.categoryName?.hindi || "-"}</span>,
  },
  {
    id: "mainCategory",
    accessorKey: "mainCategory",
    header: "Main Category",
    cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <button
          type="button"
          onClick={() => onToggleStatus?.(record)}
          className="flex items-center gap-2"
        >
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              record.status === "active" ? "bg-rose-800" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                record.status === "active" ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </span>
          <span className="text-sm font-medium">
            {record.status === "active" ? "Active" : "Inactive"}
          </span>
        </button>
      );
    },
  },
  {
    id: "createdDate",
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const record = row.original;
      return (
         <div className="flex items-center justify-start gap-2 text-rose-700">
        
          <button className="btn btn-sm btn-icon btn-clear" type="button" onClick={() => onEdit?.(record)} >
            <i className="ki-filled ki-notepad-edit text-third"></i>
          </button>
          <button  className=" tn btn-sm btn-icon btn-clear text-danger" type="button" onClick={() => onDelete?.(record)} >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { field: "id", order: "desc" };