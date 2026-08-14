import { Pencil, Trash2 } from "lucide-react";

export const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [
  {
    id: "id",
    desc: true,
  },
];

export const getMenuItemColumns = ({
  pageIndex,
  pageSize,
  onEdit,
  onDelete,
}) => [
  {
    header: "Sr. No.",
    accessorKey: "srNo",
    cell: ({ row }) =>
      String(pageIndex * pageSize + row.index + 1).padStart(2, "0"),
  },

  {
    header: "Menu Item Name",
    accessorKey: "nameEnglish",
    cell: ({ row }) => (
      <span className="text-primary font-medium">
        {row.original.nameEnglish || "-"}
      </span>
    ),
  },

  {
    header: "Category",
    accessorKey: "menuCategoryNameEnglish",
    cell: ({ row }) =>
      row.original.menuCategoryNameEnglish || "-",
  },

  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => (
      <span className="text-gray-600 line-clamp-1">
        {row.original.description || "-"}
      </span>
    ),
  },

  {
    header: "Status",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return isActive ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Inactive
        </span>
      );
    },
  },

  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-start gap-2 text-rose-700">
        <button
          type="button"
          onClick={() => onEdit?.(row.original)}
          className="text-blue-500 hover:text-blue-700"
        >
             <i className="ki-filled ki-notepad-edit text-large"></i>
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(row.original)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];