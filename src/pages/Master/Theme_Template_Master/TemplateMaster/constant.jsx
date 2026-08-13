export const getThemeColumns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "nameEnglish",
    header: "Name",
    cell: ({ row }) => (
      <span className="text-primary font-medium">
        {row.original.nameEnglish}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => row.original.createdAt || "-",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="text-blue-500 hover:text-blue-700"
        >
          <i className="ki-filled ki-notepad-edit text-lg"></i>
        </button>
        <button
          type="button"
          onClick={() => onDelete(row.original)}
          className="text-red-500 hover:text-red-700"
        >
          <i className="ki-filled ki-trash text-lg"></i>
        </button>
      </div>
    ),
  },
];

export const DEFAULT_LIST_PAYLOAD = {
  isAutoAssign: null,
  nameEnglish: "",
  page: 0,
  size: 10,
  sortBy: "id",
  sortDirection: "DESC",
};