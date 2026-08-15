import { Trash2, ImagePlus, Pencil } from "lucide-react";

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  {
    id: "itemName",
    desc: false,
  },
];

export const ESTIMATE_TABLE_DATA = [];

export const getEstimateColumns = ({
  onEdit,
  onDelete,
  onDescriptionChange,
  onImageUpload,
  onFieldChange, // (id, field, value) => void
}) => [
  {
    accessorKey: "id",
    header: "SR",
    cell: ({ row, table }) => {
      const index = table.getSortedRowModel().rows.findIndex(
        (r) => r.original.id === row.original.id
      );
      return index + 1;
    },
  },

  {
    accessorKey: "itemName",
    header: "ITEM DETAILS",

    cell: ({ row }) => (
      <div className="py-2">
        <h6 className="font-bold text-sm text-dark">
          {row.original.itemName}
        </h6>

        <textarea
          defaultValue={row.original.description}
          rows={3}
          onBlur={(e) =>
            onDescriptionChange &&
            onDescriptionChange(row.original.id, e.target.value)
          }
          className="w-full max-w-xs resize-none rounded border border-primary-clarity px-3 py-2 text-xs text-gray-600 outline-none focus:border-primary"
        />
      </div>
    ),
  },

  {
    accessorKey: "image",
    header: "MEDIA",

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.image ? (
          <img
            src={row.original.image}
            alt={row.original.itemName}
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-md bg-gray-100" />
        )}

        <label
          className="cursor-pointer rounded border-2 p-3 text-gray-600 border-dashed border-primary-clarity hover:bg-primary-clarity/10"
          title="Click to upload image"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              onImageUpload &&
              onImageUpload(row.original.id, e.target.files?.[0])
            }
          />

          <ImagePlus size={14} />
        </label>
      </div>
    ),
  },

  {
    accessorKey: "size",
    header: "SIZE",

    cell: ({ row }) => (
      <input
        value={row.original.size ?? ""}
        onChange={(e) =>
          onFieldChange && onFieldChange(row.original.id, "size", e.target.value)
        }
        className="w-14 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },

  {
    accessorKey: "qty",
    header: "QTY",

    cell: ({ row }) => (
      <input
        type="number"
        min="0"
        value={row.original.qty ?? ""}
        onChange={(e) =>
          onFieldChange && onFieldChange(row.original.id, "qty", e.target.value)
        }
        className="w-16 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },

  {
    accessorKey: "sqft",
    header: "SQ. FT.",

    cell: ({ row }) => (
      <input
        value={row.original.sqft ?? ""}
        onChange={(e) =>
          onFieldChange && onFieldChange(row.original.id, "sqft", e.target.value)
        }
        className="w-16 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },

  {
    accessorKey: "rate",
    header: "RATE",

    cell: ({ row }) => (
      <div className="relative w-24">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
          ₹
        </span>
        <input
          type="number"
          min="0"
          value={row.original.rate ?? ""}
          onChange={(e) =>
            onFieldChange && onFieldChange(row.original.id, "rate", e.target.value)
          }
          className="w-full rounded-lg text-dark font-bold text-xs border h-9 pl-5 pr-2 border-primary-clarity outline-none"
        />
      </div>
    ),
  },

  {
    accessorKey: "discountRate",
    header: "DISC %",

    cell: ({ row }) => (
      <div className="relative w-16">
        <input
          type="number"
          min="0"
          max="100"
          value={row.original.discountRate ?? ""}
          onChange={(e) =>
            onFieldChange &&
            onFieldChange(row.original.id, "discountRate", e.target.value)
          }
          className="w-full rounded-lg text-dark font-bold text-xs border h-9 text-center pr-4 border-primary-clarity outline-none"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
          %
        </span>
      </div>
    ),
  },

  {
    accessorKey: "total",
    header: "TOTAL",

    cell: ({ row }) => {
      const qty = Number(row.original.qty || 0);
      const rate = Number(row.original.rate || 0);
      const discountRate = Number(row.original.discountRate || 0);
      const total = qty * rate * (1 - discountRate / 100);

      return (
        <span className="font-semibold text-primary">
          ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "ACTIONS",

    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="p-2 text-gray-500"
        >
          <Pencil size={15}/>
        </button>

        <button
          onClick={() => onDelete(row.original)}
         className="p-2 text-gray-500"
        >
          <Trash2 size={15} />
        </button>
      </div>
    ),
  },
];