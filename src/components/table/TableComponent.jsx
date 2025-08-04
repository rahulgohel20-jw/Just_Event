import { DataGrid } from "@/components";

const TableComponent = ({
  columns,
  data,
  paginationSize,
  defaultSorting,
  toolbar,
}) => {
  return (
    <DataGrid
      columns={columns}
      data={data}
      pagination={{ size: paginationSize }}
      sorting={defaultSorting}
      toolbar={toolbar}
      layout={{ card: true }}
    />
  );
};

export { TableComponent };
