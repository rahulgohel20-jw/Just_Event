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
  "Flowers",
  "Lighting",
  "Sound",
  "LED Wall",
  "Mandap",
  "Furniture",
  "Artist & Entertainment",
  "Printing",
  "Outsource",
];

export const PRODUCTION_INCHARGE_OPTIONS = [
  { value: "Sarah Jenkins", label: "Sarah Jenkins" },
  { value: "Meera Shah", label: "Meera Shah" },
  { value: "Arjun Patel", label: "Arjun Patel" },
];

export const FUNCTION_NAME_OPTIONS = [
  { value: "Haldi Celebration", label: "Haldi Celebration" },
  { value: "Sangeet Night", label: "Sangeet Night" },
  { value: "Wedding Ceremony", label: "Wedding Ceremony" },
  { value: "Reception", label: "Reception" },
];

export const STATUS_OPTIONS = [
  { value: "remaining", label: "Remaining" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

// Local mock data — no API integration yet. Shape matches what the table
// columns expect directly (already "normalized"), so ExecutionItemsTable
// can use it as-is until a real fetch is wired up.
export const MOCK_EXECUTION_ITEMS = [
  {
    id: "dec-1",
    srNo: "01",
    name: "Marigold Backdrop Floral Wall",
    description:
      "Hand-woven fresh marigold strings on mesh structure, 12ft x 10ft feature wall.",
    size: "12ft x 10ft",
    qty: 2,
    images: ["https://placehold.co/72x72", "https://placehold.co/72x72"],
    materials: ["Flowers", "Lighting", "Sound", "Mandap", "Artist & Entertainment"],
    materialsCount: 5,
  },
  {
    id: "dec-2",
    srNo: "02",
    name: "Brass Urli with Floating Petals",
    description:
      'Handcrafted 24" antique brass urli filled with floating petals for aisle entrance.',
    size: '24" Dia',
    qty: 6,
    images: [],
    materials: [],
    materialsCount: 0,
  },
];

/**
 * Column definitions for the execution items TableComponent (TanStack shape:
 * accessorKey / header / cell). Mirrors getCategoryColumns() from
 * CategoryTypeMaster/constant.js.
 *
 * onUploadImage(item, newImageUrls: string[]) — called after the user picks
 * file(s) in the Images cell; caller is responsible for merging the new
 * URLs into that row's `images`.
 *
 * onUpdateField(item, field, value) — called after an inline-editable cell
 * (description, size, qty) is committed; caller is responsible for merging
 * the new value into that row.
 */
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
    accessorKey: "name",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {row.original.name}
        </p>
        <AlwaysEditableCell
          value={row.original.description}
          placeholder="Add description..."
          multiline
          className="mt-0.5 max-w-sm"
          onCommit={(val) => onUpdateField(row.original, "description", val)}
        />
      </div>
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
        {row.original.materialsCount
          ? `Manage Materials (${row.original.materialsCount})`
          : "Manage Materials"}
      </button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-center gap-3">
        {/* <button
          type="button"
          onClick={() => onEdit(row.original)}
          aria-label="Edit item"
          className="text-gray-400 transition hover:text-primary"
        >
          <Pencil size={16} />
        </button> */}
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

/**
 * AlwaysEditableCell
 * ------------------------------------------------------------------
 * Inline-editable cell used for description / size / qty. Renders the
 * input/textarea directly in the cell at all times — no click-to-open
 * step. Keeps its own draft state while typing so keystrokes don't get
 * clobbered by a parent re-render, and commits (calls onCommit) on
 * blur, or on Enter for single-line fields.
 */
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
    // Local preview only — swap for a real upload call + returned URLs later.
    const urls = files.map((file) => URL.createObjectURL(file));
    onUploadImage(item, urls);
    e.target.value = ""; // allow re-selecting the same file again
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