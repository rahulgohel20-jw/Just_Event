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
    header: "Sr. No.",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
      const { image, itemNameEnglish } = row.original;
      return image ? (
        <img
          src={image}
          alt={itemNameEnglish}
          className="h-10 w-10 rounded-md object-cover border border-gray-200"
        />
      ) : (
        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
          N/A
        </div>
      );
    },
  },
  {
    accessorKey: "itemName",
    header: "Raw Item",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-gray-800">
        {row.original.itemNameEnglish}
      </span>
    ),
  },
  {
    accessorKey: "mainCategory",
    header: "Raw Material Category",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
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
          <button className="btn btn-sm btn-icon btn-clear text-danger" type="button" onClick={() => onDelete?.(record)}>
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
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