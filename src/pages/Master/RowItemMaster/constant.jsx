import { Trash2, Wine, Utensils, Lightbulb, Armchair } from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Item Master",
  description:
    "Centralized inventory management for all raw materials, equipment, and logistical items used across event lifecycle.",
  addButtonLabel: "Add Raw Item",
};

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  { id: "nameEnglish", desc: false },
];

export const UNIT_OPTIONS = [
  { label: "All", value: "" },
  { label: "Kg", value: "Kg" },
  { label: "Nos", value: "Nos" },
  { label: "Box", value: "Box" },
  { label: "Piece", value: "Piece" },
  { label: "Case", value: "Case" },
];

export const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const getCategoryColor = (category) => {
  switch (category) {
    case "Beverages":
      return "bg-blue-100 text-blue-700";
    case "Decor":
      return "bg-purple-100 text-purple-700";
    case "Audio/Visual":
      return "bg-yellow-100 text-yellow-700";
    case "Furniture":
      return "bg-cyan-100 text-cyan-700";
    default:
      return "bg-gray-100";
  }
};

export const getRawItemColumns = ({ onEdit, onDelete }) => [
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
    header: "ITEM NAME",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center my-2">
        <div className="w-10 h-10 rounded-xl bg-primary-inverse flex items-center justify-center text-primary">
          <Wine size={18} />
        </div>
        <div>
          <p className="font-semibold text-dark m-0">{row.original.nameEnglish}</p>
          {row.original.inventoryId && (
            <p className="text-xs text-gray-500 m-0">Inv ID: {row.original.inventoryId}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "rawCategoryNameEnglish",
    header: "MAIN ITEM CATEGORY",
    cell: ({ row }) => (
      <span className={`rounded-md px-3 py-1 text-xs font-medium ${getCategoryColor(row.original.rawCategoryNameEnglish)}`}>
        {row.original.rawCategoryNameEnglish}
      </span>
    ),
  },
  {
    accessorKey: "unitType",
    header: "UNIT",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <span
        className={`rounded-full px-4 py-1 text-xs font-semibold ${
          row.original.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        ● {row.original.status === "active" ? "Active" : "Inactive"}
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

export const supplierColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "srNo",
    header: "Sr.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "supplierName",
    header: "Supplier Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <>₹ {row.original.price}</>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
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