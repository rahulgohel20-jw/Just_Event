import { Layers, CheckCircle2, PauseCircle, BarChart3, Eye, Pencil, Trash2, Edit } from "lucide-react";


export const PAGE_HEADER = {
  title: "Category Master",
  description:
    "Manage categories used across client registrations and event records for precision reporting.",
  addButtonLabel: "Add Category",
};


export const STATS_CARDS = [
  {
    key: "total",
    label: "Total Categories",
    value: "42",
    subtext: "+4% this month",
    icon: Layers,
  },
  {
    key: "active",
    label: "Active Categories",
    value: "39",
    subtext: "Currently operational",
    icon: CheckCircle2,
  },
  {
    key: "inactive",
    label: "Inactive Categories",
    value: "3",
    subtext: "Pending review",
    icon: PauseCircle,
  },
  {
    key: "usage",
    label: "System Usage",
    value: "92%",
    subtext: "Across all events",
    icon: BarChart3,
  },
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
    header: "SR. NO.",
    size: 90,
    cell: ({ getValue }) => <span >{getValue()}</span>,
  },
  {
    id: "categoryName",
    accessorKey: "categoryName",
    header: "CATEGORY NAME",
    cell: ({ row }) => (
      <div>
        <p >{row.original.categoryName}</p>
      </div>
    ),
  },
  {
    id: "mainCategory",
    accessorKey: "mainCategory",
    header: "MAIN CATEGORY",
    cell: ({ getValue }) => (
      <span>
        {getValue()}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "STATUS",
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
              record.status === "active" ? "bg-rose-800" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                record.status === "active" ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </span>
          <span
            className={`text-sm font-medium ${
              record.status === "active" ? "text-gray-800" : "text-gray-400"
            }`}
          >
            {record.status === "active" ? "Active" : "Inactive"}
          </span>
        </button>
      );
    },
  },
  {
    id: "createdDate",
    accessorKey: "createdDate",
    header: "CREATED DATE",
    cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableSorting: false,
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="flex items-center justify-start gap-3 text-gray-400">
          <button type="button" onClick={() => onView?.(record)} className="text-green-700">
            <Eye size={18} />
          </button>
          <button type="button" onClick={() => onEdit?.(record)} className="text-blue-700">
            <Edit size={18} />
          </button>
          <button type="button" onClick={() => onDelete?.(record)} className="text-red-700">
            <Trash2 size={18} />
          </button>
        </div>
      );
    },
  },
];


export const CATEGORY_TABLE_DATA = [
  {
    id: 1,
    srNo: "01",
    categoryName: "Client Details",
    categoryDescription: "Primary user profile type",
    mainCategory: "Customer",
    status: "active",
    createdDate: "Oct 12, 2023",
  },
  {
    id: 2,
    srNo: "02",
    categoryName: "Luxury Partner",
    categoryDescription: "High-end vendor category",
    mainCategory: "VIP",
    status: "active",
    createdDate: "Nov 04, 2023",
  },
  {
    id: 3,
    srNo: "03",
    categoryName: "Fortune 500",
    categoryDescription: "Enterprise-level corporate leads",
    mainCategory: "Corporate",
    status: "active",
    createdDate: "Dec 20, 2023",
  },
  {
    id: 4,
    srNo: "04",
    categoryName: "Legacy Accounts",
    categoryDescription: "Inactive historical data",
    mainCategory: "Standard",
    status: "inactive",
    createdDate: "Jan 05, 2024",
  },
];


export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { field: "srNo", order: "asc" };