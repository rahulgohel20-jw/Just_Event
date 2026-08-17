import { Layers, CheckCircle2, PauseCircle, BarChart3, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Transportation Master",
  description:
    "Manage transport routes, pricing, and provider agencies used across trip bookings.",
  addButtonLabel: "Add Transportation",
};

export const STATS_CARDS = [
  {
    key: "total",
    label: "Total Routes",
    value: "42",
    subtext: "+4% this month",
    icon: Layers,
  },
  {
    key: "active",
    label: "Active Routes",
    value: "39",
    subtext: "Currently operational",
    icon: CheckCircle2,
  },
  {
    key: "inactive",
    label: "Inactive Routes",
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

export const getTransportationColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    id: "srNo",
    accessorKey: "srNo",
    header: "Sr No. ",
    size: 90,
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    id: "tripBegin",
    accessorKey: "tripBegin",
    header: "From",
    cell: ({ row }) => row.original.tripBegin?.label || "-",
  },
  {
    id: "tripEnd",
    accessorKey: "tripEnd",
    header: "to",
    cell: ({ row }) => row.original.tripEnd?.label || "-",
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      row.original.amount !== "" && row.original.amount != null
        ? `${Number(row.original.amount).toFixed(2)}`
        : "-",
  },
  {
    id: "agency",
    accessorKey: "agency",
    header: "Agency",
    cell: ({ row }) => row.original.agency?.label || "-",
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

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { field: "srNo", order: "asc" };