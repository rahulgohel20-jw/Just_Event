import { DataGrid } from "@/components";

const TableComponent = ({
  columns,
  tableData,
  paginationSize,
  defaultSorting,
  toolbar,
  serverSide,
  onFetchData,
  data,
}) => {
  return (
    <DataGrid
      columns={columns}
      data={serverSide ? data : tableData}
      pagination={{ size: paginationSize }}
      sorting={defaultSorting}
      toolbar={toolbar}
      layout={{ card: true }}
      serverSide={serverSide}
      onFetchData={onFetchData}
    />
  );
};

export { TableComponent };