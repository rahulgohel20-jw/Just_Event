import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Category Master",
  description:
    "Classification and global rules for event inventory.",
  addButtonLabel: "Add Raw Category",
};

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  {
    id: "categoryName",
    desc: false,
  },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ITEM_TYPE_OPTIONS = [
  {label: "All Item", value:""},
  { label: "Perishable", value: "Perishable" },
  { label: "Reusable", value: "Reusable" },
  { label: "Assets", value: "Assets" },
];

export const RAW_CATEGORY_TABLE_DATA = [
  {
    id: 1,
    categoryName: "Standard Equipment",
    itemType: "Perishable",
    editNo: "E-892",
    status: "active",
  },
  {
    id: 2,
    categoryName: "Luxury Perishables",
    itemType: "Reusable",
    editNo: "E-892",
    status: "active",
  },
  {
    id: 3,
    categoryName: "Technical Support Gears",
    itemType: "Assets",
    editNo: "E-892",
    status: "inactive",
  },
  {
    id: 4,
    categoryName: "Branding Collaterals",
    itemType: "Reusable",
    editNo: "E-892",
    status: "active",
  },
];

export const getRawCategoryColumns = ({
  onView,
  onEdit,
  onDelete,
}) => [
    {
      accessorKey: "id",
      header: "SR. NO.",
    },
    {
      accessorKey: "categoryName",
      header: "RAW CATEGORY NAME",
    },
    {
      accessorKey: "itemType",
      header: "ITEM TYPE",
      cell: ({ row }) => (
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
          {row.original.itemType}
        </span>
      ),
    },
    {
      accessorKey: "editNo",
      header: "EDIT NO.",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${row.original.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
            }`}
        >
          {row.original.status === "active"
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "ACTIONS",
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