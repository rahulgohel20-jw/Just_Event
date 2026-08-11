import { Edit, Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Client Master",
  description:
    "Manage client information, contact details, and account records for all event customers.",
  addButtonLabel: "Add Client",
};

export const STATS_CARDS = [
  {
    key: "totalClients",
    label: "Total Clients",
    value: "258",
    badge: "+12%",
    badgeTone: "positive",
    icon: "users",
  },
  {
    key: "activeClients",
    label: "Active Clients",
    value: "184",
    badge: "71%",
    badgeTone: "neutral",
    icon: "check",
  },
  {
    key: "newThisMonth",
    label: "New This Month",
    value: "24",
    badge: "New",
    badgeTone: "positive",
    icon: "trending",
  },
  {
    key: "upcomingBirthdays",
    label: "Upcoming Birthdays",
    value: "08",
    badge: "Upcoming",
    badgeTone: "warning",
    icon: "gift",
  },
];

export const CITY_FILTER_OPTIONS = [
  { value: "mumbai", label: "Mumbai" },
  { value: "ahmedabad", label: "Ahmedabad" },
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" },
];
export const STATUS_FILTER = [
   { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]
export const CATEGORY_NAME_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "corporate", label: "Corporate" },
  { value: "wedding", label: "Wedding" },
  { value: "vip", label: "VIP" },
  { value: "social", label: "Social" },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "clientName", desc: false }];

const categoryBadgeStyles = {
  Corporate: "bg-blue-50 text-blue-700",
  Wedding: "bg-rose-50 text-rose-700",
  VIP: "bg-amber-50 text-amber-700",
  Social: "bg-purple-50 text-purple-700",
};

export const getClientColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
  {
    accessorKey: "srNo",
    header: "Sr. No.",
    cell: ({ row }) => (
      <span >
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
    cell: ({ row }) => {
      const { clientName, email, initials } = row.original;
      return (
          <div className="flex item-center mt-2">
            <p>{clientName}</p>
          </div>
      );
    },
  },
  {
    accessorKey: "mainCategory",
    header: "Main Category",
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <span>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
          <span>
            {isActive ? "Active" : "Inactive"}
          </span>
      );
    },
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ getValue }) => (
      <span className="text-sm text-gray-600">{getValue()}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-start gap-2 text-rose-700">
         <button onClick={() => onView(row.original)} className="btn btn-sm btn-icon btn-clear">
          <i className="ki-filled ki-eye  text-primary"></i>
        </button>
          <button className="btn btn-sm btn-icon btn-clear" type="button" onClick={() => onEdit?.(record)} >
            <i className="ki-filled ki-notepad-edit text-third"></i>
          </button>
          <button  className=" tn btn-sm btn-icon btn-clear text-danger" type="button" onClick={() => onDelete?.(record)} >
            <Trash2 size={16} />
          </button>
        </div>
    ),
  },

];