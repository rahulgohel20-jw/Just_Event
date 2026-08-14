import { DataGrid } from "@/components";

const TableComponent = ({
  columns,
  tableData,
  paginationSize,
  defaultSorting,
  toolbar,
  serverSide,
  totalCount,
  onFetchData,
  data,
}) => {
  const gridData = serverSide ? data : tableData ?? data ?? [];
  return (
    <DataGrid
      columns={columns}
      data={gridData}
      pagination={{ size: paginationSize , total: totalCount}}
      sorting={defaultSorting}
      toolbar={toolbar}
      layout={{ card: true }}
      serverSide={serverSide}
      onFetchData={onFetchData}
    />
  );
};

export { TableComponent };