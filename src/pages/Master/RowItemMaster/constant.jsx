import {
  Eye,
  Pencil,
  Trash2,
  Wine,
  Utensils,
  Lightbulb,
  Armchair,
} from "lucide-react";

export const PAGE_HEADER = {
  title: "Raw Item Master",
  description:
    "Centralized inventory management for all raw materials, equipment, and logistical items used across event lifecycle.",
  addButtonLabel: "Add Raw Item",
};

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  {
    id: "itemName",
    desc: false,
  },
];

export const CATEGORY_OPTIONS = [
    { label: "All", value: "" },
  { label: "Beverages", value: "Beverages" },
  { label: "Decor", value: "Decor" },
  { label: "Audio/Visual", value: "Audio/Visual" },
  { label: "Furniture", value: "Furniture" },
];

export const UNIT_OPTIONS = [
  { label: "All", value: "" },
  { label: "Case (24)", value: "Case (24)" },
  { label: "Piece", value: "Piece" },
  { label: "Unit", value: "Unit" },
  { label: "Set (10)", value: "Set (10)" },
];

export const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export const RAW_ITEM_TABLE_DATA = [
  {
    id: 1,
    itemName: "Premium Sparkling Water",
    inventoryId: "RI-00912",
    category: "Beverages",
    unit: "Case (24)",
    editNo: "E-892",
    status: "active",
    icon: "beverage",
  },
  {
    id: 2,
    itemName: "Silk Table Linens - Maroon",
    inventoryId: "RI-00945",
    category: "Decor",
    unit: "Piece",
    editNo: "E-892",
    status: "active",
    icon: "decor",
  },
  {
    id: 3,
    itemName: "LED Stage Spotlights (RGB)",
    inventoryId: "RI-01022",
    category: "Audio/Visual",
    unit: "Unit",
    editNo: "E-892",
    status: "inactive",
    icon: "light",
  },
  {
    id: 4,
    itemName: "Ghost Chairs (Acrylic)",
    inventoryId: "RI-00882",
    category: "Furniture",
    unit: "Set (10)",
    editNo: "E-892",
    status: "active",
    icon: "chair",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "beverage":
      return <Wine size={18} />;

    case "decor":
      return <Utensils size={18} />;

    case "light":
      return <Lightbulb size={18} />;

    case "chair":
      return <Armchair size={18} />;

    default:
      return <Wine size={18} />;
  }
};

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

export const getRawItemColumns = ({
  onView,
  onEdit,
  onDelete,
}) => [
  {
    accessorKey: "id",
    header: "SR. NO.",
  },

  {
    accessorKey: "itemName",
    header: "ITEM NAME",

    cell: ({ row }) => (
      <div className="flex gap-3 items-center my-2">
        <div className="w-10 h-10 rounded-xl bg-primary-inverse flex items-center justify-center text-primary">
          {getIcon(row.original.icon)}
        </div>

        <div>
          <p className="font-semibold text-dark m-0">
            {row.original.itemName}
          </p>

          <p className="text-xs text-gray-500 m-0">
            Inv ID: {row.original.inventoryId}
          </p>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "category",
    header: "MAIN ITEM CATEGORY",

    cell: ({ row }) => (
      <span
        className={`rounded-md px-3 py-1 text-xs font-medium ${getCategoryColor(
          row.original.category
        )}`}
      >
        {row.original.category}
      </span>
    ),
  },

  {
    accessorKey: "unit",
    header: "UNIT",
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
        className={`rounded-full px-4 py-1 text-xs font-semibold ${
          row.original.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        ●{" "}
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


export const supplierColumns = [
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