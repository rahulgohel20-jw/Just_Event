import { Trash2, Star } from "lucide-react";

export const PAGE_HEADER = {
  title: "Plan Master",
  description: "Manage pricing plans, features, and billing cycles.",
  addButtonLabel: "Add Plan",
};

export const BILLING_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export const DEFAULT_PAGINATION_SIZE = 100;
export const DEFAULT_SORTING = { sortBy: "id", sortDirection: "DESC" };

export const emptyFeature = () => ({
  featureTextEnglsih: "", // ⚠️ typo matches the API payload exactly ("Englsih") — keep as-is or the field won't map
  featureTextHindi: "",
  featureTextGujarati: "",
});

export const getPlanColumns = ({ onEdit, onDelete }) => [
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
    accessorKey: "nameEnglish",
    header: "Plan Name",
    cell: ({ row }) => {
      const { nameEnglish, isPopular } = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{nameEnglish}</span>
          {isPopular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <Star size={11} fill="currentColor" />
              Popular
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "billingCycle",
    header: "Billing Cycle",
    cell: ({ getValue }) => (
      <span className="capitalize">{(getValue() || "").toLowerCase()}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const { price, originalPrice } = row.original;
      return (
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">₹{price}</span>
          {originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600 line-clamp-1 max-w-xs block">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: "features",
    header: "Features",
    enableSorting: false,
    cell: ({ getValue }) => {
      const count = (getValue() || []).length;
      return <span className="text-sm text-gray-500">{count} feature{count !== 1 ? "s" : ""}</span>;
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