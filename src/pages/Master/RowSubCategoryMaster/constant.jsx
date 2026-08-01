import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Sub-Category Master",
  description:
    "Central management for all event sub-categories used in resource allocation and planning.",
  addButtonLabel: "Add Raw Sub-Category",
};

export const RAW_SUBCATEGORY_TABLE_DATA = [
  {
    id: 1,
    srNo: "01",
    subCategoryName: "Fine Dining Catering",
    mainCategory: "Hospitality",
    status: "active",
  },
  {
    id: 2,
    srNo: "02",
    subCategoryName: "Audio Visual Tech",
    mainCategory: "Technical Production",
    status: "active",
  },
  {
    id: 3,
    srNo: "03",
    subCategoryName: "Floral Arrangement",
    mainCategory: "Decoration",
    status: "inactive",
  },
  {
    id: 4,
    srNo: "04",
    subCategoryName: "Digital Registration",
    mainCategory: "Technology",
    status: "active",
  },
];

export const CATEGORY_OPTIONS = [
  { label: "All Category", value: "" },
  { label: "Hospitality", value: "Hospitality" },
  { label: "Technical Production", value: "Technical Production" },
  { label: "Decoration", value: "Decoration" },
  { label: "Technology", value: "Technology" },
];

export const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [{ id: "srNo", desc: false }];

export const getRawSubCategoryColumns = ({
  onView,
  onEdit,
  onDelete,
}) => [
  {
    accessorKey: "srNo",
    header: "SR. NO.",
  },
  {
    accessorKey: "subCategoryName",
    header: "SUB-CATEGORY NAME",
  },
  {
    accessorKey: "mainCategory",
    header: "MAIN CATEGORY",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-current"></span>
          {status === "active" ? "Active" : "Inactive"}
        </span>
      );
    },
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