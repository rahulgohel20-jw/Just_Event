import { Layers, CheckCircle2, PauseCircle, BarChart3, Eye, Pencil, Trash2, Edit } from "lucide-react";

export const PAGE_HEADER = {
  title: "Trip Master",
  description:
    "Manage trips used across client bookings and itinerary records for precision reporting.",
  addButtonLabel: "Add Trip",
};

export const STATS_CARDS = [
  {
    key: "total",
    label: "Total Trips",
    value: "42",
    subtext: "+4% this month",
    icon: Layers,
  },
  {
    key: "active",
    label: "Active Trips",
    value: "39",
    subtext: "Currently operational",
    icon: CheckCircle2,
  },
  {
    key: "inactive",
    label: "Inactive Trips",
    value: "3",
    subtext: "Pending review",
    icon: PauseCircle,
  },
  {
    key: "usage",
    label: "System Usage",
    value: "92%",
    subtext: "Across all bookings",
    icon: BarChart3,
  },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const getTripColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    id: "srNo",
    accessorKey: "srNo",
    header: "Sr No. ",
    size: 90,
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    id: "tripName",
    accessorKey: "tripName",
    header: "Name (English)",
    cell: ({ row }) => (
      <div>
        <p>{row.original.tripName?.english || "-"}</p>
      </div>
    ),
  },
  {
    id: "tripNameGujarati",
    accessorKey: "tripName.gujarati",
    header: "Name (Gujarati)",
    cell: ({ row }) => row.original.tripName?.gujarati || "-",
  },
  {
    id: "tripNameHindi",
    accessorKey: "tripName.hindi",
    header: "Name (Hindi)",
    cell: ({ row }) => row.original.tripName?.hindi || "-",
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div className="flex items-center justify-start gap-2 text-rose-700">
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

export const TRIP_TABLE_DATA = [
  {
    id: 1,
    srNo: "01",
    tripName: "Client Details",
    status: "active",
    createdDate: "Oct 12, 2023",
  },
  {
    id: 2,
    srNo: "02",
    tripName: "Luxury Partner",
    status: "active",
    createdDate: "Nov 04, 2023",
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { field: "srNo", order: "asc" };