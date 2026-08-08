import { Layers, CheckCircle2, PauseCircle, BarChart3, Eye, Pencil, Trash2, Edit } from "lucide-react";


export const PAGE_HEADER = {
  title: "Category Master Type",
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
    header: "Sr No. ",
    size: 90,
    cell: ({ getValue }) => <span >{getValue()}</span>,
  },
  {
    id: "categoryName",
    accessorKey: "categoryName",
    header: "Name (English)",
    cell: ({ row }) => (
      <div>
            <p>{row.original.categoryName?.english || "-"}</p>
      </div>
    ),
  },
{
  id: "categoryNameGujarati",
  accessorKey: "categoryName.gujarati",
  header: "Name (Gujarati)",
  cell: ({ row }) => row.original.categoryName?.gujarati || "-",
},
{
  id: "categoryNameHindi",
  accessorKey: "categoryName.hindi",
  header: "Name (Hindi)",
  cell: ({ row }) => row.original.categoryName?.hindi || "-",
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