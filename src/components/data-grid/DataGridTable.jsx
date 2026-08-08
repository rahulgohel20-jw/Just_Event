import { DataGridEmpty } from ".";
import { flexRender } from "@tanstack/react-table";
import { useDataGrid } from ".";
import { cn } from "@/lib/utils";

const DataGridTable = () => {
  const { table, props } = useDataGrid();

  const spacing = {
    header: props.layout?.cellSpacing === "sm" ? "px-3 py-3" : "px-4 py-3.5",
    body: props.layout?.cellSpacing === "sm" ? "px-3 py-3" : "px-4 py-3.5",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-table>
          {/* ── Header ── */}
         <thead>
  {table.getHeaderGroups().map((headerGroup) => (
    <tr
      key={headerGroup.id}
      className="border-b-2 border-gray-300 bg-gray-100"
    >
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          colSpan={header.colSpan}
          className={cn(
            spacing.header,
            "whitespace-nowrap border-r border-gray-300 last:border-r-0 text-xs font-semibold uppercase tracking-wider text-gray-900",
            header.column.columnDef.meta?.headerClassName
          )}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </th>
      ))}
    </tr>
  ))}
</thead>

          {/* ── Body ── */}
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50 ",
                    row.getIsSelected() && "bg-blue-50/70"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        spacing.body,
                        "text-gray-700 border border-gray-200 last:border-r-0",
                        cell.column.columnDef.meta?.cellClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <DataGridEmpty />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { DataGridTable };
