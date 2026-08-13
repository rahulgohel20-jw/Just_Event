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
    accessorKey: "name",
    cell: ({ row }) => (
      <span className="text-primary cursor-pointer">{row.original.name}</span>
    ),
  },
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.THEME" defaultMessage="Theme" />,
    accessorKey: "theme",
    cell: ({ row }) => row.original.theme || "-",
  },
  {
    header: (
      <FormattedMessage
        id="TEMPLATE_TYPE.NAME_PLATE_TYPE"
        defaultMessage="Name Plate Type"
      />
    ),
    accessorKey: "namePlateType",
    cell: ({ row }) => row.original.namePlateType || "-",
  },
  {
    header: <FormattedMessage id="TEMPLATE_TYPE.DATE_TYPE" defaultMessage="Date Type" />,
    accessorKey: "dateType",
    cell: ({ row }) => row.original.dateType || "-",
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