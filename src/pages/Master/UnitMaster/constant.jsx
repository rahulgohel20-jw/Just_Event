import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
    title: "Unit Master",
    description:
        "Central repository for all measurement units used across operations.",
    addButtonLabel: "Add Unit",
};

export const STATUS_OPTIONS = [
    { label: "All Status", value: "" },
    {
        label: "Active",
        value: "active",
    },
    {
        label: "Inactive",
        value: "inactive",
    },
];
export const DEFAULT_PAGINATION_SIZE = 10;

export const DEFAULT_SORTING = [
    {
        id: "unitName",
        desc: false,
    },
];

export const UNIT_TABLE_DATA = [
    {
        id: 1,
        unitName: "Nos",
        symbol: "Nos",
        status: "active",
    },
    {
        id: 2,
        unitName: "Kilogram",
        symbol: "Kg",
        status: "active",
    },
    {
        id: 3,
        unitName: "Box",
        symbol: "box",
        status: "inactive",
    },
    {
        id: 4,
        unitName: "Litre",
        symbol: "L",
        status: "active",
    },
];

export const getUnitColumns = ({ onEdit, onDelete }) => [
    {
        accessorKey: "id",
        header: "SR. NO.",
    },
    {
        accessorKey: "unitName",
        header: "UNIT NAME",
    },
    {
        accessorKey: "symbol",
        header: "SYMBOL",
        cell: ({ row }) => (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                {row.original.symbol}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => (
            <span
                className={`rounded-full px-3 py-1 text-xs flex gap-2 items-center w-max font-medium ${row.original.status === "active"
                    ? "bg-success-lighter text-success"
                    : "bg-gray-100 text-gray-600"
                    }`}
            >
                <span className={`w-2 h-2 rounded-full ${row.original.status === 'active' ? "bg-success" : "bg-dark-clarity"}`}> </span>
                {row.original.status === "active" ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        id: "actions",
        header: "ACTIONS",
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