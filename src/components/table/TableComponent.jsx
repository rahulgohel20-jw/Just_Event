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
  const gridData = serverSide ? data : tableData ?? data ?? [];
  return (
    <DataGrid
      columns={columns}
      data={gridData}
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