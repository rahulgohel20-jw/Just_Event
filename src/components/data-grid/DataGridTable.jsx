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
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      spacing.header,
                      "whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-gray-600",
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
                    "transition-colors hover:bg-gray-50",
                    row.getIsSelected() && "bg-blue-50/70"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        spacing.body,
                        "text-gray-700",
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
