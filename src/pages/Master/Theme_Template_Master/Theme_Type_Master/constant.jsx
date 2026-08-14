import { FormattedMessage } from "react-intl";

export const getTemplateTypeColumns = ({ onEdit, onDelete }) => [
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.SR_NO" defaultMessage="Sr. No." />,
    accessorKey: "srNo",
    cell: ({ row }) => row.index + 1,
    size: 80,
  },
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.NAME" defaultMessage="Name" />,
    accessorKey: "nameEnglish",
    cell: ({ row }) => (
      <span
        className="text-primary cursor-pointer"
        onClick={() => onEdit(row.original)}
      >
        {row.original.nameEnglish}
      </span>
    ),
  },
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.THEME" defaultMessage="Theme" />,
    accessorKey: "templateModuleName",
    cell: ({ row }) => row.original.templateModuleName || "-",
  },
  {
    header: (
      <FormattedMessage
        id="TEMPLATE_TYPE.AUTO_ASSIGN"
        defaultMessage="Auto Assign"
      />
    ),
    accessorKey: "isAutoAssign",
    cell: ({ row }) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          row.original.isAutoAssign
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.isAutoAssign ? "Yes" : "No"}
      </span>
    ),
  },
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.CREATED_AT" defaultMessage="Created At" />,
    accessorKey: "createdAt",
    cell: ({ row }) => row.original.createdAt || "-",
  },
  {
    header: <FormattedMessage id="COMMON.ACTION" defaultMessage="Action" />,
    accessorKey: "action",
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="text-blue-500 hover:text-blue-700"
        >
          <i className="ki-filled ki-pencil text-lg"></i>
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