import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  DEFAULT_MATERIAL_CATEGORIES,
  MOCK_EXECUTION_ITEMS,
  getExecutionColumns,
} from "./constant";
import ManageMaterialsSidebar from "./ManageMaterialsSidebar";
// API integration intentionally removed for now — everything below runs on
// local mock data / local state. Swap MOCK_EXECUTION_ITEMS + the handlers
// below for real fetch/save/delete calls when the endpoints are ready.

/**
 * ExecutionItemsTable
 * ------------------------------------------------------------------
 * Self-contained section for the "Menu Planning Execution" page.
 * Renders decoration/execution items through the shared TableComponent
 * and owns the Manage Materials sidebar modal (opened per-row).
 *
 * Props
 *  - eventId    : string | number   current event (kept for when API wiring returns)
 *  - functionId : string | number   current function within the event
 *  - onAddDecoration : () => void   opens the Add Decoration modal (parent-owned)
 */
const ExecutionItemsTable = ({ eventId, functionId, onAddDecoration }) => {
  const [tableData, setTableData] = useState(MOCK_EXECUTION_ITEMS);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [size] = useState(DEFAULT_PAGINATION_SIZE);

  const [activeItem, setActiveItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleManageMaterials = (record) => {
    setActiveItem(record);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setActiveItem(null);
  };

  // Called by the sidebar on Save — updates the row's materials locally.
  const handleMaterialsSaved = (item, selectedList) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === item.id
          ? { ...row, materials: selectedList, materialsCount: selectedList.length }
          : row
      )
    );
  };

  const handleEdit = (record) => console.log("Edit execution item:", record);

  const handleUploadImage = (record, newImageUrls = []) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, images: [...(row.images || []), ...newImageUrls] }
          : row
      )
    );
  };

  // Called by inline-editable cells (description, size, qty) on commit —
  // local-only update for now, swap in a save/patch API call later.
  const handleUpdateField = (record, field, value) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === record.id ? { ...row, [field]: value } : row))
    );
  };

  const handleDelete = async (record) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this item?",
      text: `This will permanently remove "${record.name}" from the execution plan.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#7A2E45",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    // Local-only removal — no API call for now.
    setTableData((prev) => prev.filter((row) => row.id !== record.id));
    Swal.fire({
      icon: "success",
      title: "Item Deleted",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const columns = useMemo(
    () =>
      getExecutionColumns({
        onManageMaterials: handleManageMaterials,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onUploadImage: handleUploadImage,
        onUpdateField: handleUpdateField,
      }),
    []
  );

  const filteredData = useMemo(() => {
    if (!searchText) return tableData;
    return tableData.filter((row) =>
      row.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tableData, searchText]);

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-xs mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search decorations or items..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={onAddDecoration}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Apply to All Functions
        </button>
      </div>
    </div>
  );

  return (
    <>
      <TableComponent
        columns={columns}
        data={filteredData}
        tableData={filteredData}
        loading={loading}
        paginationSize={size}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      <ManageMaterialsSidebar
        open={sidebarOpen}
        item={activeItem}
        materials={DEFAULT_MATERIAL_CATEGORIES}
        selected={activeItem?.materials ?? []}
        onClose={handleCloseSidebar}
        onSaved={handleMaterialsSaved}
      />
    </>
  );
};

export default ExecutionItemsTable;