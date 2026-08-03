import { Trash2 } from "lucide-react";

export const PAGE_HEADER = {
    title: "Raw Category Type Master",
    description:
        "System-wide registry for raw resource categories. Manage classification for streamlined inventory and logistics.",
    addButtonLabel: "Add Raw Category Type",
};

export const RAW_CATEGORY_TABLE_DATA = [
    {
        id: 1,
        categoryName: "Standard Equipment",
        status: "active",
    },
    {
        id: 2,
        categoryName: "Luxury Perishables",
        status: "active",
    },
    {
        id: 3,
        categoryName: "Technical Support Gears",
        status: "inactive",
    },
    {
        id: 4,
        categoryName: "Branding Collaterals",
        status: "active",
    },
];


export const STATUS_FILTER_OPTIONS = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [
    {
        id: "categoryName",
        desc: false,
    },
];
export const getRowMaterialTypeColumns = ({
    onEdit,
    onDelete,
}) => [
        {
            accessorKey: "srNo",
            header: "Sr. No.",
            cell: ({ row }) => (
                <span className="text-sm text-gray-500">
                    {String(row.index + 1).padStart(2, "0")}
                </span>
            ),
        },

        {
            accessorKey: "categoryName",
            header: "Raw Category Type Name",
            cell: ({ row }) => (
                <p className="">
                    {row.original.categoryName}
                </p>
            ),
        },

        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const active = row.original.status === "active";

                return (
                    <span
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium
            ${active
                                ? "bg-success-lighter text-success"
                                : "bg-dark-lighter text-dark-clarity"
                            }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${active ? "bg-success-light" : "bg-dark-clarity"
                                }`}
                        />
                        {active ? "Active" : "Inactive"}
                    </span>
                );
            },
        },

        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const record = row.original;

                return (
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => onEdit(record)}
                            className="btn btn-sm btn-icon btn-clear border rounded-lg"
                        >
                            <i className="ki-filled ki-notepad-edit text-third"></i>
                        </button>

                        <button
                            onClick={() => onDelete(record)}
                            className="btn btn-sm btn-icon btn-clear border rounded-lg text-danger"
                        >
                            <Trash2 size={16} />
                        </button>

                    </div>
                );
            },
        },
    ];
