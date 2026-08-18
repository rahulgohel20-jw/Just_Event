import { Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Labour Shift Master",
  description: "",
  addButtonLabel: "Create New",
};

// ⚠️ No API yet — this is placeholder data so the page/table can be built
// and previewed end to end. Swap for a real fetch once the endpoint exists.
export const LABOUR_SHIFT_TABLE_DATA = [
  {
    id: 1,
    shiftName: { english: "Morning", hindi: "", gujarati: "" },
    time: "07:00",
    transportationPrice: "",
    isActive: true,
  },
  {
    id: 2,
    shiftName: { english: "Noon", hindi: "", gujarati: "" },
    time: "11:00",
    transportationPrice: "",
    isActive: true,
  },
  {
    id: 3,
    shiftName: { english: "Evening", hindi: "", gujarati: "" },
    time: "17:00",
    transportationPrice: "",
    isActive: true,
  },
  {
    id: 4,
    shiftName: { english: "NIGHT", hindi: "", gujarati: "" },
    time: "19:00",
    transportationPrice: "",
    isActive: true,
  },
  {
    id: 5,
    shiftName: { english: "Demo", hindi: "", gujarati: "" },
    time: "15:21",
    transportationPrice: "",
    isActive: true,
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "id", desc: false }];

export const getLabourShiftColumns = ({ onEdit, onDelete }) => [
  {
    id: "nameEnglish",
    accessorKey: "nameEnglish",
    header: "Shift Name (EN)",
    cell: ({ row }) => row.original.nameEnglish,
  },
  {
    id: "nameHindi",
    accessorKey: "nameHindi",
    header: "Shift Name (HI)",
    cell: ({ row }) => row.original.nameHindi,
  },
  {
    id: "nameGujarati",
    accessorKey: "nameGujarati",
    header: "Shift Name (GU)",
    cell: ({ row }) => row.original.nameGujarati,
  },
  {
    id: "startTime",
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => row.original.startTime,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(row.original)} className="text-primary">
          <i className="ki-filled ki-notepad-edit text-third"></i>
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="text-red-600"
        >
           <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];