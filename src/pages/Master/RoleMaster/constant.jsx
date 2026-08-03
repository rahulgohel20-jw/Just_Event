import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Role Master",
  description: "Manage all the roles used across the system.",
  addButtonLabel: "Add Role",
};

export const STATS_CARDS = [
  { key: "total", label: "Total Roles", value: 0, icon: "receipt" },
  { key: "active", label: "Active Roles", value: 0, icon: "check" },
  { key: "recent", label: "Added This Month", value: 0, icon: "clock" },
];

export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_DIRECTION = "DESC";
export const DEFAULT_SORTING = [{ id: "createdAt", desc: true }];

// API already returns createdAt pre-formatted (e.g. "03/08/2026"),
// so we just display it as-is instead of re-parsing with new Date().
const formatDate = (value) => value || "-";

export const getRoleColumns = ({ onView, onEdit, onDelete, pageIndex = 0, pageSize = DEFAULT_PAGINATION_SIZE }) => [
  {
    id: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
    size: 80,
  },
  {
    accessorKey: "nameEnglish",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">
        {row.original?.nameEnglish || "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-gray-600">{formatDate(row.original?.createdAt)}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="btn btn-sm btn-icon btn-clear border rounded-lg"
        >
          <i className="ki-filled ki-notepad-edit text-third"></i>
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="btn btn-sm btn-icon btn-clear border rounded-lg text-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    size: 130,
  },
];
