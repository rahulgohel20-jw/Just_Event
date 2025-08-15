import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import { useState } from "react";
function Log() {
  const [tableData, setTableData] = useState(defaultData);
  return (
    <div>
      <TableComponent
        columns={columns}
        tableData={tableData}
        paginationSize={10}
      />
    </div>
  );
}

export default Log;
