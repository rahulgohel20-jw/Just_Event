import { Trash2, ImagePlus, Pencil } from "lucide-react";

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
  {
    id: "itemName",
    desc: false,
  },
];

export const ESTIMATE_TABLE_DATA = [
  {
    id: "01",
    itemName: "Crystal Cascade Stage Decor",
    description:
      "Premium Austrian crystal backdrops with floral accent borders and warm ambient LED wash.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100",
    size: "01",
    qty: "01",
    sqft: "01",
    rate: "1,25,000",
    discount: 10,
    total: "1,12,500",
  },
  {
    id: "02",
    itemName: "LED Kinetic Sculpture",
    description:
      "3D mapping compatible moving LED light tubes for main hall ceiling architecture.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=100",
    size: "01",
    qty: "01",
    sqft:"01",
    rate: "1,25,000",
    discount: 10,
    total: "1,12,500",
  },
];

export const getEstimateColumns = ({
  onEdit,
  onDelete,
  onDescriptionChange,
  onImageUpload,
}) => [
  {
    accessorKey: "id",
    header: "SR",
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
        <img
          src={row.original.image}
          alt={row.original.itemName}
          className="h-10 w-10 rounded-md object-cover"
        />

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
        defaultValue={row.original.size}
        className="w-14 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none" 
      />
    ),
  },

  {
    accessorKey: "qty",
    header: "QTY",

    cell: ({ row }) => (
      <input
        defaultValue={row.original.qty}
        className="w-14 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },

  {
    accessorKey: "sqft",
    header: "SQ. FT.",

    cell: ({ row }) => (
      <input
        defaultValue={row.original.sqft}
        className="w-14 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },

  {
    accessorKey: "rate",
    header: "RATE / DISC",

    cell: ({ row }) => (
      <div>
        <div className="font-bold text-dark">
          ₹{row.original.rate.toLocaleString()}
        </div>

        <div className="text-xs text-success">
          -{row.original.discount}% Disc
        </div>
      </div>
    ),
  },

  {
    accessorKey: "total",
    header: "TOTAL",

    cell: ({ row }) => (
      <span className="font-semibold text-primary">
        ₹{row.original.total.toLocaleString()}
      </span>
    ),
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
