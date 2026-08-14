import { FormattedMessage } from "react-intl";
import { Pencil, Trash2, Check } from "lucide-react";

export const getBankDetailsColumns = ({ onEdit, onDelete }) => [
  {
    header: <FormattedMessage id="BANK_DETAILS.SR_NO" defaultMessage="Sr. No." />,
    accessorKey: "srNo",
    cell: ({ row }) => row.index + 1,
    size: 60,
  },
  {
    header: (
      <FormattedMessage
        id="BANK_DETAILS.ACCOUNT_HOLDER_NAME"
        defaultMessage="Account Holder Name"
      />
    ),
    accessorKey: "accountHolderName",
    cell: ({ row }) => (
      <span
        className="text-primary font-medium cursor-pointer"
        onClick={() => onEdit(row.original)}
      >
        {row.original.accountHolderName}
      </span>
    ),
  },
  {
    header: (
      <FormattedMessage id="BANK_DETAILS.ACCOUNT_NUMBER" defaultMessage="Account Number" />
    ),
    accessorKey: "accountNo",
    cell: ({ row }) => row.original.accountNo || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.BANK_NAME" defaultMessage="Bank Name" />,
    accessorKey: "bankName",
    cell: ({ row }) => row.original.bankName || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.BRANCH_NAME" defaultMessage="Branch Name" />,
    accessorKey: "branchName",
    cell: ({ row }) => row.original.branchName || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.IFSC_CODE" defaultMessage="IFSC Code" />,
    accessorKey: "ifscCode",
    cell: ({ row }) => row.original.ifscCode || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.UPI_ID" defaultMessage="UPI ID" />,
    accessorKey: "upiId",
    cell: ({ row }) => row.original.upiId || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.OP_DATE" defaultMessage="OP Date" />,
    accessorKey: "openingDate",
    cell: ({ row }) => row.original.openingDate || "-",
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.OP_BALANCE" defaultMessage="Op Balance" />,
    accessorKey: "openingBalance",
    cell: ({ row }) => Number(row.original.openingBalance ?? 0),
  },
  {
    header: (
      <FormattedMessage id="BANK_DETAILS.CURRENT_BALANCE" defaultMessage="Current Balance" />
    ),
    accessorKey: "currentBalance",
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">
        {Number(row.original.currentBalance ?? 0)}
      </span>
    ),
  },
  {
    header: <FormattedMessage id="BANK_DETAILS.PRIMARY" defaultMessage="Primary" />,
    accessorKey: "isPrimary",
    cell: ({ row }) =>
      row.original.isPrimary ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary text-white whitespace-nowrap">
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