import { TableComponent } from "@/components/table/TableComponent";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function GuestTable({ columns, tableData }) {
  console.log("TableData:", tableData, columns);
  return (
    <div className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_#0000000D]">
      <div className="flex items-center justify-between mb-4 p-4">
        <h2 className="font-semibold text-lg text-[#1A170F]">Guest List</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="rounded-lg bg-[#F9FBFF]"
          />
          <Select
            defaultValue="Newest"
            options={[{ value: "Newest" }, { value: "Oldest" }]}
            className="rounded-lg [&_.ant-select-selector]:!bg-[#F9FBFF]"
          />
        </div>
      </div>
      <TableComponent
        columns={columns}
        tableData={tableData}
        paginationSize={10}
      />
    </div>
  );
}
