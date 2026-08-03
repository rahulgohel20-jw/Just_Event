import { Trash2 } from "lucide-react";

export const PAGE_HEADER = {
    title: "Unit Master",
    description:
        "Central repository for all measurement units used across operations.",
    addButtonLabel: "Add Unit",
};

export const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
    {
        id: "unitNameEnglish",
        desc: false,
    },
];

export const getUnitColumns = ({ onEdit, onDelete }) => [
    {
        accessorKey: "srNo",
        header: "SR. NO.",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">
                {String(row.index + 1).padStart(2, "0")}
            </span>
        ),
    },
    {
        accessorKey: "unitNameEnglish",
        header: "UNIT NAME",
    },
    {
        accessorKey: "symbolEnglish",
        header: "SYMBOL",
        cell: ({ row }) => (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                {row.original.symbolEnglish}
            </span>
        ),
    },
    {
        accessorKey: "isActive",
        header: "STATUS",
        cell: ({ row }) => (
            <span
                className={`rounded-full px-3 py-1 text-xs flex gap-2 items-center w-max font-medium `}
            >
                <span
                    className={`w-2 h-2 rounded-full ${
                        row.original.isActive === "active" ? "bg-success" : "bg-dark-clarity"
                    }`}
                >
                    {" "}
                </span>
                {row.original.isActive === "active" ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        id: "actions",
        header: "ACTIONS",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(row.original)}
                    className="btn btn-sm btn-icon btn-clear border rounded-lg"
                >
                    <i className="ki-filled ki-notepad-edit text-third"></i>
                </button>

                <button
                    onClick={() => onDelete(row.original)}
                    className="btn btn-sm btn-icon btn-clear border rounded-lg text-danger"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        ),
    },
];