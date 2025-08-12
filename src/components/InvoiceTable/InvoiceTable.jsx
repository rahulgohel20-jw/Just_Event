import { TableComponent } from "@/components/table/TableComponent";
import { Select } from "antd";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

export default function InvoiceTable({ columns, tableData }) {
  console.log("TableData:", tableData, columns);
  return (
    <div className="bg-white rounded-2xl shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between mb-4 p-4">
        <div className="flex gap-2 w-fit">
          <Select
            defaultValue="All Invoice"
            options={[
              { value: "All Invoice" },
              { value: "Draft" },
              { value: "Save/Send" },
              { value: "Paid" },
            ]}
            className="rounded-lg [&_.ant-select-selector]:!bg-[#F9FBFF] w-fit"
          />
        </div>
        <div>
          <Button
            icon={
              <DownloadOutlined style={{ fontSize: "18px", color: "white" }} />
            }
            className="bg-[#96644D] rounded-lg text-white border-[#845A12] font-semibold 
                       hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-[#845A12] 
                       shadow-addGuest flex items-center gap-2"
          >
            Download
          </Button>
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
