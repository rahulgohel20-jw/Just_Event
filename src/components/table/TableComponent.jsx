import { DataGrid } from "@/components";

const TableComponent = ({
  columns,
  data,
  tableData,
  paginationSize,
  defaultSorting,
  toolbar,
}) => {
  console.log("TableComponent Data:", data, columns, paginationSize);

  return (
    <DataGrid
      columns={columns}
      data={tableData}
      pagination={{ size: paginationSize }}
      sorting={defaultSorting}
      toolbar={toolbar}
      layout={{ card: true }}
    />
  );
};

export { TableComponent };
