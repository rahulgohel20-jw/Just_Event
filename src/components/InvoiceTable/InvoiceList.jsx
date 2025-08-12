import { Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const invoices = [
  {
    id: 1,
    name: "Swapnil",
    invoiceNo: "INV - 001",
    date: "07/08/2025",
    location: "Sofa",
    amount: "₹ 20,000",
  },
  {
    id: 2,
    name: "Zeinab",
    invoiceNo: "INV - 002",
    date: "07/08/2025",
    location: "Sofa",
    amount: "₹ 20,000",
  },
  {
    id: 3,
    name: "Aarya",
    invoiceNo: "INV - 003",
    date: "07/08/2025",
    location: "Sofa",
    amount: "₹ 20,000",
  },
];

export default function InvoiceList() {
  const menu = (
    <Menu>
      <Menu.Item key="3">Delete</Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white  rounded-2xl p-4 w-full max-w-xs h-auto  shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black">
          <option>All Invoice</option>
          <option>Draft</option>
          <option>Save/Send</option>
          <option>Paid</option>
        </select>
        <Dropdown overlay={menu} trigger={["click"]}>
          <button className="bg-[#FDE7C7] text-[#A57353] p-2 rounded-lg hover:bg-none">
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>

      {/* Invoice Items */}
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{inv.name}</p>
                <p className="text-xs text-gray-500">
                  {inv.invoiceNo} - {inv.date} - {inv.location}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800">{inv.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
