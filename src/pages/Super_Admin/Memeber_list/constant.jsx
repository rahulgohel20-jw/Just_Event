export const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

export const getMemberColumns = ({ onSelectTheme, onSelectDate }) => [
  {
    id: "srNo",
    header: "Sr No",
    cell: ({ row }) => row.index + 1,
  },
  {
    id: "userCode",
    accessorKey: "userCode",
    header: "User Code",
    cell: ({ getValue }) => (
      <span className="text-green-600 font-medium">{getValue()}</span>
    ),
  },
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => row.original?.userBasicDetails?.companyName ?? "-",
  },
  {
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) =>
      `${row.original?.firstName ?? ""} ${row.original?.lastName ?? ""}`.trim(),
  },
  {
    id: "mobile",
    accessorKey: "contactNo",
    header: "Mobile Number",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="text-blue-600">{getValue()}</span>
    ),
  },
  {
    id: "role",
    header: "Plan",
    cell: ({ row }) =>
      row.original?.userBasicDetails?.role?.nameEnglish ?? "-",
  },
  {
    id: "database",
    header: "Database",
    cell: () => "-",
  },
  {
    id: "theme",
    header: "Themes",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => onSelectTheme(row.original)}
        className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
      >
        Select Theme
      </button>
    ),
  },
  {
    id: "extendedDate",
    header: "Extended Days",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => onSelectDate(row.original)}
        className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
      >
        Select Date
      </button>
    ),
  },
];