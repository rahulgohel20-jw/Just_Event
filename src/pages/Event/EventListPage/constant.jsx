import { Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export const columns = [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "event_id",
    header: "Event ID",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "event_date",
    header: "Event Date",
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    meta: {
      headerClassName: "w-[18%]",
      cellClassName: "w-[18%]",
    },
  },
  {
    accessorKey: "event_type",
    header: "Event Type",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "proforma_invoice",
    header: "Proforma Invoice",
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },
  {
    accessorKey: "quotation",
    header: "Quotation",
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },
  {
    accessorKey: "action",
    header: "Action (Inline)",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Event">
            <Link to="/add-event">
              <button className="btn btn-sm btn-icon btn-clear" title="Edit">
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Link>
          </Tooltip>
        <Popconfirm
              title="Are you sure to copy this item?"
              onConfirm={() => console.log('confirm')
              }
              onCancel={() => console.log('Cancelled')}
              okText="Yes"
              cancelText="No"
            >
          <Tooltip className="cursor-pointer" title="Copy Event">
            <button className="btn btn-sm btn-icon btn-clear" title="Copy">
              <i className="ki-filled ki-copy text-success"></i>
            </button>
          </Tooltip>
          </Popconfirm>
          <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => console.log('confirm')
              }
              onCancel={() => console.log('Cancelled')}
              okText="Yes"
              cancelText="No"
            >
          <Tooltip className="cursor-pointer" title="Remove Event">
            <button className="btn btn-sm btn-icon btn-clear" title="Remove">
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>
        </Popconfirm>
          <Tooltip title="Menu Preparation">
            <Link to="/menu-preparation">
              <button
                className="btn btn-sm btn-icon btn-clear"
                title="Menu Preparation"
              >
                <i className="ki-filled ki-notepad text-warning"></i>
              </button>
            </Link>
          </Tooltip>

          <Tooltip title="Menu Allocation">
            <Link to="/menu-allocation">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Menu Allocation"
            >
              <i className="ki-filled ki-grid  text-info"></i>
            </button>
            </Link>
          </Tooltip>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "action_menu",
    header: "Actions (Menu)",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const menuRef = useRef(null);

      const toggleMenu = () => setOpen((prev) => !prev);
      const closeMenu = () => setOpen(false);

      // Detect click outside
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu();
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

      return (
        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="btn btn-sm btn-icon btn-clear"
            title="More Actions"
          >
            <i className="ki-filled ki-dots-horizontal text-gray-600"></i>
          </button>

          {open && (
            <div className="absolute z-50 flex flex-col bg-white border rounded shadow-lg right-0 mt-2 min-w-[160px] text-sm">
              <Link
                to="/add-event"
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={closeMenu}
              >
                <i className="ki-filled ki-notepad-edit text-primary"></i> Edit
              </Link>
              <Popconfirm
              title="Are you sure to copy this item?"
              onConfirm={() => console.log('confirm')
              }
              onCancel={() => console.log('Cancelled')}
              okText="Yes"
              cancelText="No"
            >
              <button
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-start"
                // onClick={closeMenu}
              >
                <i className="ki-filled ki-copy text-success"></i> Copy
              </button>
              </Popconfirm>
              <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => closeMenu
              }
              onCancel={() => console.log('Cancelled')}
              okText="Yes"
              cancelText="No"
            >
              <button
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-start"
                // onClick={closeMenu}
              >
                <i className="ki-filled ki-trash text-danger"></i> Remove
              </button>
              </Popconfirm>
              <Link
                to="/menu-preparation"
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={closeMenu}
              >
                <i className="ki-filled ki-notepad text-warning"></i> Menu Prep
              </Link>
              <Link
                to="/menu-allocation"
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={closeMenu}
              >
                <i className="ki-filled ki-grid text-info"></i> Menu Allocate
              </Link>
            </div>
          )}
        </div>
      );
    },
    meta: {
      headerClassName: "w-[5%] text-center",
      cellClassName: "w-[5%] text-center",
    },
  },
];

export const defaultData = [
  {
    sr_no: 1,
    event_id: "EVT005",
    event_date: "2024-06-05",
    customer: "Amit Sharma",
    event_type: "Wedding",
    quotation: "QTN-005",
  },
  {
    sr_no: 2,
    event_id: "EVT006",
    event_date: "2024-06-06",
    customer: "Priya Singh",
    event_type: "Reception",
    quotation: "QTN-006",
  },
  {
    sr_no: 3,
    event_id: "EVT007",
    event_date: "2024-06-07",
    customer: "Rahul Verma",
    event_type: "Engagement",
    quotation: "QTN-007",
  },
  {
    sr_no: 4,
    event_id: "EVT008",
    event_date: "2024-06-08",
    customer: "Sneha Patel",
    event_type: "Birthday",
    quotation: "QTN-008",
  },
  {
    sr_no: 5,
    event_id: "EVT009",
    event_date: "2024-06-09",
    customer: "Vikram Joshi",
    event_type: "Anniversary",
    quotation: "QTN-009",
  },
  {
    sr_no: 6,
    event_id: "EVT010",
    event_date: "2024-06-10",
    customer: "Neha Gupta",
    event_type: "Corporate",
    quotation: "QTN-010",
  },
];
