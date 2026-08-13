import { Eye, Pencil, Trash2 } from "lucide-react";

export const PAGE_HEADER = {
  title: "Venue Master",
  description:
    "Manage your premium venue network, sub-spaces, and logistical capacities across all operational regions.",
  addButtonLabel: "Add Venue",
};

export const STATS_CARDS = [
  { key: "totalVenues", label: "Total Venues", value: "185", icon: "building" },
  { key: "subVenues", label: "Sub Venues", value: "420", icon: "layers" },
  { key: "totalCapacity", label: "Total Capacity", value: "52,400", icon: "users" },
  { key: "available", label: "Available", value: "142", icon: "check" },
];

export const VENUE_TYPE_FILTER_OPTIONS = [
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "banquet", label: "Banquet" },
  { value: "farmhouse", label: "Farmhouse" },
];

export const CITY_FILTER_OPTIONS = [
  { value: "ahmedabad", label: "Ahmedabad" },
  { value: "udaipur", label: "Udaipur" },
  { value: "mumbai", label: "Mumbai" },
];

export const STATE_FILTER_OPTIONS = [
  { value: "gujarat", label: "Gujarat" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "maharashtra", label: "Maharashtra" },
];

export const VENUE_TABLE_DATA = [
  {
    id: 1,
    venueName: "Grand Hyatt",
    venueType: "HOTEL",
    subVenueCount: 8,
    capacity: 1200,
    status: "active",
    mobileNumber: "+1 555 012 3456",
    city: "Ahmedabad",
    state: "Gujarat",
    coverImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    venueName: "The Taj Lakeview",
    venueType: "RESORT",
    subVenueCount: 12,
    capacity: 1100,
    status: "active",
    mobileNumber: "+1 555 012 3456",
    city: "Udaipur",
    state: "Rajasthan",
    coverImage:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    venueName: "Elite Banquet",
    venueType: "BANQUET",
    subVenueCount: 5,
    capacity: 1300,
    status: "active",
    mobileNumber: "+1 555 012 3456",
    city: "Mumbai",
    state: "Maharashtra",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    venueName: "The Taj Lakeview",
    venueType: "RESORT",
    subVenueCount: 10,
    capacity: 800,
    status: "inactive",
    mobileNumber: "+1 555 012 3456",
    city: "Ahmedabad",
    state: "Gujarat",
    coverImage:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&h=200&fit=crop",
  },
];

export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_SORTING = [{ id: "venueName", desc: false }];

const venueTypeBadgeStyles = {
  HOTEL: "bg-blue-50 text-blue-700",
  RESORT: "bg-emerald-50 text-emerald-700",
  BANQUET: "bg-purple-50 text-purple-700",
  FARMHOUSE: "bg-amber-50 text-amber-700",
};

export const getVenueColumns = ({ onView, onEdit, onDelete, onToggleStatus }) => [
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
  accessorKey: "coverImage",
  header: "Image",
  cell: ({ row }) => {
    const { venueName, coverImage } = row.original;

    return (
      <img
        src={coverImage}
        alt={venueName}
        className="h-11 w-11 rounded-lg object-cover"
      />
    );
  },
},
{
  accessorKey: "venueName",
  header: "Venue Name",
  cell: ({ getValue }) => (
    <span className="text-sm font-medium text-gray-800">
      {getValue()}
    </span>
  ),
},
  {
    accessorKey: "subVenueCount",
    header: "Sub-Venues",
    cell: ({ getValue }) => (
      <span className="">
        {getValue()} Sub Venues
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ getValue }) => (
      <span >
        {getValue().toLocaleString("en-IN")} Guests
      </span>
    ),
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
            style={{ backgroundColor: isActive ? "#881337" : "#e5e7eb" }}
            className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none"
          >
            <span
              style={{ transform: isActive ? "translateX(18px)" : "translateX(2px)" }}
              className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
            />
          </button>
          <span
            className={`text-xs font-medium ${
              isActive ? "text-rose-800" : "text-gray-400"
            }`}
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
      <span >{getValue()}</span>
    ),
  },
  {
    accessorKey: "addressEnglish",
    header: "Address",
    cell: ({ row }) => (
      <div>
        <p >{row.original.city}</p>
      
      </div>
    ),
  },
 {
  accessorKey: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex items-center justify-start gap-2 text-rose-700">
      <button onClick={() => onView(row.original)} className="btn btn-sm btn-icon btn-clear">
        <i className="ki-filled ki-eye text-primary"></i>
      </button>
      <button className="btn btn-sm btn-icon btn-clear" type="button" onClick={() => onEdit?.(row.original)}>
        <i className="ki-filled ki-notepad-edit text-third"></i>
      </button>
      <button className="btn btn-sm btn-icon btn-clear text-danger" type="button" onClick={() => onDelete?.(row.original)}>
        <Trash2 size={16} />
      </button>
    </div>
  ),
},
];