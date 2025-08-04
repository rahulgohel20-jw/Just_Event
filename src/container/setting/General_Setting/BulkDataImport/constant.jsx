import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
export const columns = [
  {
    accessorKey: "Imported ID",

    header: ({ column }) => (
      <DataGridColumnHeader title="Roles" column={column} />
    ),
  },
  {
    accessorKey: "Imported on",

    header: ({ column }) => (
      <DataGridColumnHeader title="Roles" column={column} />
    ),
  },
  {
    accessorKey: "Module",

    header: ({ column }) => (
      <DataGridColumnHeader title="Roles" column={column} />
    ),
  },
  {
    accessorKey: "No. of Records",

    header: ({ column }) => (
      <DataGridColumnHeader title="Roles" column={column} />
    ),
  },
  {
    accessorKey: "Imported By",

    header: ({ column }) => (
      <DataGridColumnHeader title="Roles" column={column} />
    ),
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Edit">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => cell.row.original.handleModalOpen()}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button className="btn btn-sm btn-icon btn-clear" title="Delete">
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
export const defaultData = [];
