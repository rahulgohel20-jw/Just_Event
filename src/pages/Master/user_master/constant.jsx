import { Pencil, Home, ShieldCheck, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "User Master",
  addButtonLabel: "Create New",
};

export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORT_BY = "id";
export const DEFAULT_SORT_DIRECTION = "DESC";
export const DEFAULT_SORTING = [];

export const getUserColumns = ({
  onEdit,
  onAssignEvent,
  onVerify,
  onDelete,
  pageIndex,
  pageSize,
}) => [
  {
    header: "Sr. No.",
    accessorKey: "srNo",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  },
  {
    header: "Full Name",
    accessorKey: "fullName",
    cell: ({ row }) =>
      [row.original.firstName, row.original.lastName].filter(Boolean).join(" "),
  },
  {
    header: "City",
    accessorKey: "city",
    cell: ({ row }) => row.original.userBasicDetails?.city?.nameEnglish ?? "-",
  },
  {
    header: "State",
    accessorKey: "state",
    cell: ({ row }) => row.original.userBasicDetails?.state?.nameEnglish ?? "-",
  },
  {
    header: "Country",
    accessorKey: "country",
    cell: ({ row }) => row.original.userBasicDetails?.country?.nameEnglish ?? "-",
  },
  {
    header: "Mobile No",
    accessorKey: "contactNo",
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => row.original.userBasicDetails?.role?.nameEnglish ?? "-",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="text-blue-500 hover:text-blue-600"
          title="Edit"
        >
           <i className="ki-filled ki-notepad-edit text-third"></i>
        </button>
       
       
        {/* <button
          type="button"
          onClick={() => onDelete(row.original)}
          className="text-red-500 hover:text-red-600"
          title="Delete"
        >
          <Trash2 size={16} />
        </button> */}
      </div>
    ),
  },
];