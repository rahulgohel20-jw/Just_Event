import { Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Category Master",
  description: "Classification and global rules for event inventory.",
  addButtonLabel: "Add Raw Category",
};

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  {
    id: "nameEnglish",
    desc: false,
  },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ITEM_TYPE_OPTIONS = [
  { label: "All Item", value: "" },
  { label: "Perishable", value: "Perishable" },
  { label: "Reusable", value: "Reusable" },
  { label: "Assets", value: "Assets" },
];

export const getRawCategoryColumns = ({ onEdit, onDelete }) => [
    {
        accessorKey: "srNo",
        header: "SR. NO.",
        cell: ({ row }) => (
            <span >
                {String(row.index + 1).padStart(2, "0")}
            </span>
        ),
    },
    {
        accessorKey: "nameEnglish",
        header: "RAW CATEGORY NAME",
    },
    {
        accessorKey: "rawCategoryTypeId",
        header: "RAW CATEGORY TYPE",
        cell: ({ row }) => (
            <span >
                {row.original.rawCategoryTypeNameEnglish}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => (
            <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                    row.original.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                }`}
            >
                {row.original.status === "active" ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        id: "actions",
        header: "ACTIONS",
        enableSorting: false,
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
    },
];