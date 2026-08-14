import { FormattedMessage } from "react-intl";
import { Landmark, Pencil, Trash2, Check } from "lucide-react";

export const getCashOpbColumns = ({ onEdit, onDelete }) => [
  {
    header: (
      <FormattedMessage id="CASH_OPB.ACCOUNT_NAME" defaultMessage="Account Name" />
    ),
    accessorKey: "accountName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Landmark size={18} />
        </div>
        <div>
          <div className="font-semibold text-gray-800">
            {row.original.accountName}
          </div>
          <div className="text-xs text-gray-400">
            {row.original.description || "-"}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: (
      <FormattedMessage id="CASH_OPB.OPENING_BALANCE" defaultMessage="Opening Balance" />
    ),
    accessorKey: "openingBalance",
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">
        {Number(row.original.openingBalance ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    header: (
      <FormattedMessage id="CASH_OPB.CURRENT_BALANCE" defaultMessage="Current Balance" />
    ),
    accessorKey: "currentBalance",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
        {Number(row.original.currentBalance ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    header: <FormattedMessage id="CASH_OPB.PRIMARY" defaultMessage="Primary" />,
    accessorKey: "isPrimary",
    cell: ({ row }) =>
      row.original.isPrimary ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary text-white">
          <Check size={12} />
          Primary
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    header: <FormattedMessage id="COMMON.ACTION" defaultMessage="Actions" />,
    accessorKey: "action",
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          className="btn btn-sm btn-icon hover:opacity-70"
        >
           <i className="ki-filled ki-notepad-edit text-large"></i>
        </button>
        <button
          type="button"
          onClick={() => onDelete(row.original)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];