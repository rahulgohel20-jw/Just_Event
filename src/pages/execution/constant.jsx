import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, ImagePlus, Boxes } from "lucide-react";

export const PAGE_HEADER = {
  title: "Menu Planning Execution",
  description:
    "Manage decoration items, linked materials and execution details for this function.",
  addButtonLabel: "Add Decoration",
};

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = { sortBy: "id", sortDirection: "ASC" };

export const DEFAULT_MATERIAL_CATEGORIES = [
  "FLOWERS",
  "LIGHTING",
  "SOUND",
  "LED_WALL",
  "MANDAP",
  "FURNITURE",
  "ARTIST_ENTERTAINMENT",
  "PRINTING",
  "OUTSOURCE",
  "PURCHASE_ITEM",
  "SFX",
  "NEW_MAKING",
  "GODOWN",
];

export const PRODUCTION_INCHARGE_OPTIONS = [
  { value: "Sarah Jenkins", label: "Sarah Jenkins" },
  { value: "Meera Shah", label: "Meera Shah" },
  { value: "Arjun Patel", label: "Arjun Patel" },
];

export const STATUS_OPTIONS = [
  { value: "REMAINING", label: "Remaining" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  {value: "ON_HOLD" ,label:"On Hold"}
];

export const MATERIAL_OPTIONS = [
  { value: "FLOWERS", label: "Flowers" },
  { value: "LIGHTING", label: "Lighting" },
  { value: "SOUND", label: "Sound" },
  { value: "LED_WALL", label: "LED Wall" },
  { value: "MANDAP", label: "Mandap" },
  { value: "FURNITURE", label: "Furniture" },
  { value: "ARTIST_ENTERTAINMENT", label: "Artist / Entertainment" },
  { value: "PRINTING", label: "Printing" },
  { value: "OUTSOURCE", label: "Outsource" },
  { value: "PURCHASE_ITEM", label: "New Purchase" },
 { value: "SFX", label: "SFX" },
  { value: "GODOWN", label: "Godown" },
   { value: "NEW_MAKING", label: "New Making" },
];


export const getExecutionColumns = ({
  onManageMaterials,
  onEdit,
  onDelete,
  onUploadImage,
  onUpdateField,
}) => [
  {
    id: "srNo",
    header: "Sr",
    accessorKey: "srNo",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.srNo}</span>
    ),
  },
  {
    id: "particular",
    header: "Particular Name & Description",
    accessorKey: "particularName",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {row.original.particularName}
        </p>
        <AlwaysEditableCell
          value={row.original.particularDescription}
          placeholder="Add description..."
          multiline
          className="mt-0.5 max-w-sm"
          onCommit={(val) => onUpdateField(row.original, "particularDescription", val)}
        />
      </div>
    ),
  },
  {
    id: "elementsAndMaterials",
    header: "Elements & Materials",
    accessorKey: "elementsAndMaterials",
    cell: ({ row }) => (
      <AlwaysEditableCell
        value={row.original.elementsAndMaterials}
        placeholder="Enter elements & materials..."
        multiline
        className="max-w-[12rem]"
        onCommit={(val) => onUpdateField(row.original, "elementsAndMaterials", val)}
      />
    ),
  },
  {
    id: "size",
    header: "Size",
    accessorKey: "size",
    cell: ({ row }) => (
      <AlwaysEditableCell
        value={row.original.size}
        placeholder="Add size..."
        className="max-w-[7rem]"
        onCommit={(val) => onUpdateField(row.original, "size", val)}
      />
    ),
  },
  {
    id: "qty",
    header: "Qty",
    accessorKey: "qty",
    cell: ({ row }) => (
      <AlwaysEditableCell
        value={row.original.qty}
        type="tel"
        placeholder="0"
        className="max-w-[5rem]"
        onCommit={(val) => {
          const num = Number(val);
          onUpdateField(row.original, "qty", Number.isNaN(num) ? 0 : num);
        }}
      />
    ),
  },
  {
    id: "images",
    header: "Images",
    cell: ({ row }) => (
      <ImagesCell item={row.original} onUploadImage={onUploadImage} />
    ),
  },
  {
    id: "materialSummary",
    header: "Material Summary",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => onManageMaterials(row.original)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-rose-950"
      >
        <Boxes size={14} />
        {row.original.materials?.length
          ? `Manage Materials (${row.original.materials.length})`
          : "Manage Materials"}
      </button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => onDelete(row.original)}
          aria-label="Delete item"
          className="text-gray-400 transition text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];


const AlwaysEditableCell = ({
  value,
  onCommit,
  type = "text",
  placeholder = "—",
  multiline = false,
  className = "",
  inputClassName = "",
}) => {
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const commit = () => {
    const next = typeof draft === "string" ? draft.trim() : draft;
    if (next !== (value ?? "")) {
      onCommit(next);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const sharedProps = {
    value: draft,
    onChange: (e) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: handleKeyDown,
    placeholder,
    className:
      "w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 " +
      inputClassName,
  };

  return (
    <div className={className}>
      {multiline ? (
        <textarea {...sharedProps} rows={2} className={sharedProps.className + " resize-none"} />
      ) : (
        <input {...sharedProps} type={type} min={type === "number" ? 0 : undefined} />
      )}
    </div>
  );
};

const ImagesCell = ({ item, onUploadImage }) => {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    onUploadImage(item, files);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-1.5">
      {item.images?.length > 0 && (
        <div className="flex items-center">
          {item.images.slice(0, 2).map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="-ml-2 h-9 w-9 rounded-md border-2 border-white object-cover shadow-sm first:ml-0"
            />
          ))}
          {item.images.length > 2 && (
            <span className="-ml-2 flex h-9 w-9 items-center justify-center rounded-md border-2 border-white bg-gray-100 text-[11px] font-medium text-gray-500 shadow-sm">
              +{item.images.length - 2}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={
          item.images?.length
            ? "flex h-9 w-9 items-center justify-center rounded-md border border-dashed border-gray-200 text-gray-400 transition hover:border-primary hover:text-primary"
            : "flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:border-primary hover:text-primary"
        }
        aria-label="Upload image"
      >
        <ImagePlus size={14} />
        {!item.images?.length && "Upload"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
};