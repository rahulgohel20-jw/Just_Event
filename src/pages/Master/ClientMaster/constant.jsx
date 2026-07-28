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

export const CATEGORY_NAME_FILTER_OPTIONS = [
  { value: "corporate", label: "Corporate" },
  { value: "wedding", label: "Wedding" },
  { value: "vip", label: "VIP" },
  { value: "social", label: "Social" },
];

export const CLIENT_TABLE_DATA = [
  {
    id: 1,
    clientName: "Morgan Sterling",
    email: "morgan@sterling.co",
    mainCategory: "Corporate",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "MS",
  },
  {
    id: 2,
    clientName: "Julianna Pierce",
    email: "j.pierce@weddingly.com",
    mainCategory: "Wedding",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "JP",
  },
  {
    id: 3,
    clientName: "Arthur Knight",
    email: "knight@royal.vip",
    mainCategory: "VIP",
    status: "active",
    mobileNumber: "+1 555 012 3456",
    initials: "AK",
  },
  {
    id: 4,
    clientName: "Sarah Lane",
    email: "sarah.lane@outlook.com",
    mainCategory: "Social",
    status: "inactive",
    mobileNumber: "+1 555 012 3456",
    initials: "SL",
  },
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
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-800">
            {initials}
          </div>
          <div className="flex item-center mt-2">
            <p>{clientName}</p>
            
          </div>
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
        <span
        
        >
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
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => onToggleStatus(row.original)}
            style={{
              backgroundColor: isActive ? "#881337" : "#e5e7eb",
            }}
            className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none"
          >
            <span
              style={{
                transform: isActive ? "translateX(18px)" : "translateX(2px)",
              }}
              className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
            />
          </button>
          <span
           
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
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
      <div className="flex items-center justify-start gap-3 text-gray-400">
          <button type="button" onClick={() => onView?.(record)} className="text-green-700">
            <Eye size={18} />
          </button>
          <button type="button" onClick={() => onEdit?.(record)} className="text-blue-700">
            <Edit size={18} />
          </button>
          <button type="button" onClick={() => onDelete?.(record)} className="text-red-700">
            <Trash2 size={18} />
          </button>
        </div>
    ),
  },
  
];