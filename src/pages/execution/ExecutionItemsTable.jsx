import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Loader2, ChevronDown } from "lucide-react";
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
import { getallmenuitem } from "../../services/apiServices"; // adjust path if ExecutionItemsTable lives elsewhere

const SUGGESTION_PAGE_SIZE = 8;

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

  /* ---- Menu Item quick-add search (same pattern as QuotationPage) ---- */
  const [menuSearch, setMenuSearch] = useState("");
  const [menuSuggestions, setMenuSuggestions] = useState([]);
  const [menuSearching, setMenuSearching] = useState(false);
  const [menuLoadingMore, setMenuLoadingMore] = useState(false);
  const [showMenuSuggestions, setShowMenuSuggestions] = useState(false);
  const [menuPage, setMenuPage] = useState(0);
  const [menuIsLastPage, setMenuIsLastPage] = useState(true);
  const [menuHasLoadedOnce, setMenuHasLoadedOnce] = useState(false);

  const fetchMenuItems = async (query, pageNum, append) => {
    if (append) setMenuLoadingMore(true);
    else setMenuSearching(true);
    try {
      const res = await getallmenuitem({
        page: pageNum,
        size: SUGGESTION_PAGE_SIZE,
        nameEnglish: query,
        isActive: true,
        sortBy: "id",
        sortDirection: "ASC",
      });
      const body = res?.data ?? res;
      const pageData = body?.data ?? body;
      const content = pageData?.content ?? [];
      const last = pageData?.last ?? true;
      setMenuSuggestions((prev) => (append ? [...prev, ...content] : content));
      setMenuIsLastPage(last);
      setMenuPage(pageNum);
      setMenuHasLoadedOnce(true);
    } catch {
      if (!append) setMenuSuggestions([]);
    } finally {
      setMenuSearching(false);
      setMenuLoadingMore(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchMenuItems(menuSearch, 0, false), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuSearch]);

  const handleMenuFocus = () => {
    setShowMenuSuggestions(true);
    if (!menuHasLoadedOnce && !menuSearching) fetchMenuItems(menuSearch, 0, false);
  };

  const handleMenuLoadMore = () => {
    if (menuIsLastPage || menuLoadingMore) return;
    fetchMenuItems(menuSearch, menuPage + 1, true);
  };

const buildItemRow = ({ menuItemId = null, itemName = "New Item", description = "" }) => ({
  id: Date.now() + Math.floor(Math.random() * 1000), 
  estimateItemId: menuItemId, 
  menuItemId,
  srNo: String(items.length + 1).padStart(2, "0"),
  particularName: itemName,
  particularDescription: description || "",
  elementsAndMaterials: "",
  size: "",
  qty: 1,
  images: [],
  imageFiles: [],
  materials: [],
});

  const addMenuItemToTable = (menuItem) => {
    setItems((prev) => [
      ...prev,
      buildItemRow({
        menuItemId: menuItem.id,
        itemName: menuItem.nameEnglish,
        description: menuItem.description,
      }),
    ]);
    setMenuSearch("");
    setShowMenuSuggestions(false);
  };

  const handleAddCustomItem = () => {
    setItems((prev) => [...prev, buildItemRow({ itemName: menuSearch || "New Item" })]);
    setMenuSearch("");
    setShowMenuSuggestions(false);
  };

  /* ---- existing handlers ---- */

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
      text: `This will permanently remove "${record.particularName}" from the execution plan.`,
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
    [items]
  );

  const filteredData = useMemo(() => {
    if (!searchText) return items;
    return items.filter((row) =>
      row.particularName?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [items, searchText]);

  const toolbar = (
    <div className="flex flex-col gap-3">
      {/* Row 1: table filter + existing action buttons */}
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

      {/* Row 2: Menu Item quick-add, mirrors QuotationPage's "Quick Add Items" */}
      <div className="rounded-lg border bg-light-clarity p-4 mb-3">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Quick Add Menu Item
        </label>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search decor, lighting, catering..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              onFocus={handleMenuFocus}
              onBlur={() => setTimeout(() => setShowMenuSuggestions(false), 150)}
              className="h-11 w-full rounded-lg border border-dashed border-gray-300 pl-10 pr-4 text-sm outline-none focus:border-primary text-gray-800"
            />
            {showMenuSuggestions && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-72 overflow-y-auto">
                {menuSearching ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                    <Loader2 size={14} className="animate-spin" />
                    Loading...
                  </div>
                ) : menuSuggestions.length ? (
                  <>
                    {menuSuggestions.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onMouseDown={() => addMenuItemToTable(m)}
                        className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <span>{m.nameEnglish}</span>
                      </button>
                    ))}
                    {!menuIsLastPage && (
                      <button
                        type="button"
                        onMouseDown={handleMenuLoadMore}
                        disabled={menuLoadingMore}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-primary hover:bg-gray-50 disabled:opacity-60"
                      >
                        {menuLoadingMore ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            Loading more...
                          </>
                        ) : (
                          <>
                            <ChevronDown size={13} />
                            Load more
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No items found</div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddCustomItem}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-6 text-sm font-medium hover:bg-gray-50"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
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