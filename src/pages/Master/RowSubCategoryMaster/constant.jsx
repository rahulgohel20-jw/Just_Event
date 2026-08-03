import { Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Sub-Category Master",
  description:
    "Central management for all event sub-categories used in resource allocation and planning.",
  addButtonLabel: "Add Raw Sub-Category",
};

export const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [{ id: "nameEnglish", desc: false }];

export const getRawSubCategoryColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "srNo",
    header: "SR. NO.",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "nameEnglish",
    header: "SUB-CATEGORY NAME",
  },
  {
    accessorKey: "mainCategoryNameEnglish",
    header: "MAIN CATEGORY",
  },
  {
    accessorKey: "isActive",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.isActive ? "true" : "false";
      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium
          }`}
        >
         
          {status === "true" ? "Active" : "Inactive"}
        </span>
      );
    },
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