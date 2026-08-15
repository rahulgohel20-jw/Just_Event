import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  DEFAULT_MATERIAL_CATEGORIES,
  getExecutionColumns,
} from "./constant";
import ManageMaterialsSidebar from "./ManageMaterialsSidebar";

/**
 * ExecutionItemsTable
 * ------------------------------------------------------------------
 * Controlled version: `items` and `setItems` are owned by ExecutionPage,
 * which fetches via GetAllEventExecution and saves via AddEventExecution.
 * This component only renders + edits the array it's given.
 */
const ExecutionItemsTable = ({ items, setItems, loading, onAddDecoration }) => {
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

  const handleMaterialsSaved = (item, selectedList) => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === item.id
          ? { ...row, materials: selectedList, materialsCount: selectedList.length }
          : row
      )
    );
  };

  const handleEdit = (record) => console.log("Edit execution item:", record);

  // Keep both a displayable preview URL (image.images) and the raw File
  // objects (image.imageFiles) so ExecutionPage can attach them to
  // FormData on save — mirrors QuotationPage's handleImageUpload pattern.
  const handleUploadImage = (record, files = []) => {
    if (!files.length) return;
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setItems((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? {
              ...row,
              images: [...(row.images || []), ...previewUrls],
              imageFiles: [...(row.imageFiles || []), ...files],
            }
          : row
      )
    );
  };

  const handleUpdateField = (record, field, value) => {
    setItems((prev) =>
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

    setItems((prev) => prev.filter((row) => row.id !== record.id));
    Swal.fire({ icon: "success", title: "Item Deleted", timer: 1500, showConfirmButton: false });
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
    [items] // recompute if handlers close over stale `items`-derived data
  );

  const filteredData = useMemo(() => {
    if (!searchText) return items;
    return items.filter((row) => row.name?.toLowerCase().includes(searchText.toLowerCase()));
  }, [items, searchText]);

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-xs mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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