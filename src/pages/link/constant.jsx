import { DataGridColumnHeader } from "@/components";
import { Tooltip } from "antd";
export const columns = [
  {
    accessorKey: "link_name",
    header: ({ column }) => (
      <DataGridColumnHeader title="Link Name" column={column} />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataGridColumnHeader title="Description" column={column} />
    ),
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataGridColumnHeader title="Url" column={column} />
    ),
  },
  {
    accessorKey: "attachments",
    header: ({ column }) => (
      <DataGridColumnHeader title="Attachments" column={column} />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Copy">
            <button
              className="btn btn-sm btn-icon btn-clear text-success"
              title="Copy"
            >
              <i className="ki-filled ki-copy"></i>
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              className="btn btn-sm btn-icon btn-clear text-primary"
              title="Edit"
              onClick={() => cell.row.original.handleModalOpen()}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
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
    link_name: "Home Page",
    description:
      "The main landing page for the website, providing an overview of services and latest updates.",
    url: "https://www.example.com",
    attachments: ["homepage_banner.png", "logo.svg"],
  },
  {
    link_name: "Donation Page",
    description:
      "A dedicated page where users can donate money, food, and essential supplies to those in need.",
    url: "https://www.example.com/donate",
    attachments: ["donation_form.pdf", "payment_qr.png"],
  },
  {
    link_name: "About Us",
    description:
      "Information about the organization, its mission, team members, and community impact.",
    url: "https://www.example.com/about",
    attachments: ["team_photo.jpg", "mission_statement.docx"],
  },
  {
    link_name: "Contact Support",
    description:
      "Page with a contact form and customer support details for inquiries and assistance.",
    url: "https://www.example.com/contact",
    attachments: ["contact_form_sample.png"],
  },
  {
    link_name: "Membership Benefits",
    description:
      "Details about the premium membership program and exclusive member offers.",
    url: "https://www.example.com/membership",
    attachments: ["membership_brochure.pdf", "benefits_list.docx"],
  },
];
