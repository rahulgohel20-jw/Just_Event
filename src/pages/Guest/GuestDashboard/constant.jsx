import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip, Dropdown, Menu } from "antd";
import { useState } from "react";

// Reusable Status Dropdown component
const StatusDropdown = ({ initialStatus = "Confirmed" }) => {
  const [status, setStatus] = useState(initialStatus);

  const menu = (
    <Menu
      onClick={(e) => setStatus(e.key)}
      items={[
        { key: "Confirmed", label: "Confirmed" },
        { key: "Tentative", label: "Tentative" },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <div className="flex items-center gap-1 cursor-pointer">
        <span
          className={` flex gap-1 items-center px-2 py-1 text-xs font-medium rounded-md  ${
            status === "Confirmed"
              ? "text-[#0FB709] bg-[#0FB70926]"
              : "text-[#DF0404] bg-[#DF040426]"
          }`}
        >
          {status}
        <span className="  text-primary ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-gray-500"
            fill="black"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
        </span>
      </div>
    </Dropdown>
  );
};

export const columns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column}  />
    ),
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataGridColumnHeader title="Phone Number" column={column}   />
    ),
  },
  {
    accessorKey: "emailid",
    header: ({ column }) => (
      <DataGridColumnHeader title="E-mail ID" column={column}  />
    ),
  },
  {
    accessorKey: "eventAttending",
    header: ({ column }) => (
      <DataGridColumnHeader title="Event Attending" column={column}  />
    ),
  },
  {
    accessorKey: "hotelStatus",
    header: ({ column }) => (
      <DataGridColumnHeader title="Hotel Status" column={column}  />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <StatusDropdown />

          <Tooltip title="Edit">
            <button
              className="btn btn-sm btn-icon btn-clear text-primary border border-[#E3E3E3]"
              title="Edit"
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear text-danger border border-[#E3E3E3]"
              title="Delete"
            >
              <i className="ki-filled ki-trash"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const defaultData = [
  {
    id: 1,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 2,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 3,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 4,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 5,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 6,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 7,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 8,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 9,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 10,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 11,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 12,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 13,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 14,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
  {
    id: 15,
    name: "John Doe",
    mobile: "9876543210",
    emailid: "shree.John@gmail.com",
    eventAttending: "Ceremony, Reception",
    hotelStatus: "Occupied",
  },
];
