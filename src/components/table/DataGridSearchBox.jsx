import { Search, X } from "lucide-react";
import { useDataGrid } from "@/components"; // ⚠️ confirm export path once DataGridInner is shared

/**
 * Generic search input for any DataGrid with serverSide filtering.
 * Drop this in any master list's `toolbar` — just point it at the
 * column id you want to filter by (usually the name/title column).
 *
 * Usage:
 *   <DataGridSearchBox columnId="functionName" placeholder="Search Function Name..." />
 *   <DataGridSearchBox columnId="nameEnglish" placeholder="Search Tax Name..." />
 */
const DataGridSearchBox = ({
  columnId,
  placeholder = "Search...",
  className = "w-full max-w-xs",
}) => {
  const { table } = useDataGrid();
  const column = table.getColumn(columnId);
  const value = column?.getFilterValue() ?? "";

  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => column?.setFilterValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => column?.setFilterValue("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export { DataGridSearchBox };