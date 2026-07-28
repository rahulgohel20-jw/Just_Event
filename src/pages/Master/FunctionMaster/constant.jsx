import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Function Master",
  description:
    "Manage all event functions, timings, pricing, images, and event categories across your enterprise portfolio.",
  addButtonLabel: "Add Function",
};

export const STATS_CARDS = [
  {
    key: "totalFunctions",
    label: "Total Functions",
    value: "86",
    trend: "12% vs last month",
    trendTone: "positive",
    icon: "layout",
  },
  {
    key: "weddingFunctions",
    label: "Wedding Functions",
    value: "42",
    trend: "48.8% of total volume",
    trendTone: "neutral",
    icon: "heart",
  },
  {
    key: "corporateFunctions",
    label: "Corporate Functions",
    value: "24",
    trend: "High-margin segments",
    trendTone: "neutral",
    icon: "briefcase",
  },
  {
    key: "avgFunctionPrice",
    label: "Avg. Function Price",
    value: "₹15,000",
    trend: "8% yield increase",
    trendTone: "positive",
    icon: "coins",
  },
];

export const FUNCTION_TYPE_FILTER_OPTIONS = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
  { value: "corporate", label: "Corporate" },
];

export const PRICE_RANGE_FILTER_OPTIONS = [
  { value: "0-10000", label: "₹0 - ₹10,000" },
  { value: "10000-20000", label: "₹10,000 - ₹20,000" },
  { value: "20000-50000", label: "₹20,000 - ₹50,000" },
  { value: "50000+", label: "₹50,000+" },
];

export const FUNCTION_TABLE_DATA = [
  {
    id: 1,
    functionName: "Mehendi Ceremony",
    segment: "Wedding Segment",
    type: "Bride",
    status: "active",
    timeFrom: "09:00 AM",
    timeTo: "12:00 PM",
    price: 12000,
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    functionName: "Annual Gala Dinner",
    segment: "Corporate Segment",
    type: "Corporate",
    status: "active",
    timeFrom: "09:00 AM",
    timeTo: "12:00 PM",
    price: 25000,
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    functionName: "Baraat Procession",
    segment: "Wedding Segment",
    type: "Groom",
    status: "active",
    timeFrom: "09:00 AM",
    timeTo: "12:00 PM",
    price: 18000,
    coverImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    functionName: "Annual Gala Dinner",
    segment: "Corporate Segment",
    type: "Bride",
    status: "inactive",
    timeFrom: "09:00 AM",
    timeTo: "12:00 PM",
    price: 25000,
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop",
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "functionName", desc: false }];

const typeBadgeStyles = {
  Bride: "bg-rose-50 text-rose-700",
  Groom: "bg-blue-50 text-blue-700",
  Corporate: "bg-purple-50 text-purple-700",
};

export const getFunctionColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
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
    accessorKey: "functionName",
    header: "Function Name",
    cell: ({ row }) => {
      const { functionName, segment, coverImage } = row.original;
      return (
        <div className="flex items-center  gap-3">
          
          <div>
            <p className="text-sm font-medium items-center text-gray-800">{functionName}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span
          
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
           
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.timeFrom} - {row.original.timeTo}
      </span>
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
         <button onClick={() => onView(row.original)} className="btn btn-sm btn-icon btn-clear">
          <i className="ki-filled ki-eye  text-primary"></i>
        </button>
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