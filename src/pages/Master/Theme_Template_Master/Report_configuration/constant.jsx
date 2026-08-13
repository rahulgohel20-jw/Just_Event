// ReportKeyMaster.constants.js
import { Pencil, Trash2 } from "lucide-react";

export const REPORT_KEY_TABLE_HEADERS = ({ onEdit, onDelete }) => [
  {
    accessorKey: "srNo",
    header: "SR. NO.",
    cell: ({ row }) => (
      <span className="text-dark-light">
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => (
      <span className="font-medium text-dark">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "defaultValue",
    header: "DEFAULT",
    cell: ({ row }) => (
      <span
        className={`px-2.5 py-1 rounded-md text-xs font-medium ${
          row.original.defaultValue
            ? "bg-success/10 text-success"
            : "bg-dark/10 text-dark-light"
        }`}
      >
        {row.original.defaultValue ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ row }) => (
      <span className="text-dark-light">{row.original.createdAt}</span>
    ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(row.original)}
          title="Edit"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        >
         <i className="ki-filled ki-notepad-edit text-third"></i>
        </button>
       
      </div>
    ),
  },
];