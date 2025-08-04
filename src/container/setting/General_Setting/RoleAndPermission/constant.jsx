import { DataGridColumnHeader } from "@/components";
import { Tooltip } from "antd";
export const columns = [
  {
    accessorKey: "role",
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
export const defaultData = [
  {
    role: "Developer",
  },
  {
    role: "Designer",
  },
  {
    role: "Project Manager",
  },
  {
    role: "Tester",
  },
];
