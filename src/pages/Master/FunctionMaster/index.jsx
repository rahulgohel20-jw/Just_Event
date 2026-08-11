import { useMemo, useState, useCallback } from "react";
import { getalllistfuntionmaster, deletefunctionmaster } from "@/services/apiServices";
import { Plus, ChevronDown, LayoutGrid, Heart, Briefcase, Coins } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { DataGridSearchBox } from "@/components/table/DataGridSearchBox";
import { AddFunctionModal } from "../../../partials/modals/AddFunctionModal/AddFunctionModal";
import { ViewFunctionModal } from "../../../partials/modals/AddFunctionModal/ViewFunctionModal";
import {
  PAGE_HEADER,
  STATS_CARDS,
  FUNCTION_TYPE_FILTER_OPTIONS,
  PRICE_RANGE_FILTER_OPTIONS,
  getFunctionColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";

const STAT_ICONS = {
  layout: LayoutGrid,
  heart: Heart,
  briefcase: Briefcase,
  coins: Coins,
};

const FunctionMaster = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState(null);
  const [viewFunction, setViewFunction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
const userId = Number(localStorage.getItem("userId"));
  const mapApiRowToTableRow = (item) => ({
    id: item.id,
    functionName: item.nameEnglish,
    functionNameHindi: item.nameHindi,
    functionNameGujarati: item.nameGujarati,
    timeFrom: item.timeFrom,
    timeTo: item.timeTo,
    userId: item.userId,
    images: item.images || [],
    coverImage:
      item.images?.[0]?.path ||
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop",
    createdAt: item.createdAt,
    uuid: item.uuid,
    status: "active", // ⚠️ no status field in API response
  });

  const handleFetchData = useCallback(async ({ pageIndex, pageSize, columnFilters }) => {
    const nameFilter =
      columnFilters?.find((f) => f.id === "functionName")?.value || "";

    try {
      const res = await getalllistfuntionmaster({
        nameEnglish: nameFilter,
        page: pageIndex,
        size: pageSize,
        sortBy: "id",
        sortDirection: "ASC",
        userId // ⚠️ replace with real logged-in user id
      });
      const body = res?.data ?? res;
      const data = body?.data ?? {};
      return {
        data: (data.content ?? []).map(mapApiRowToTableRow),
        totalCount: data.totalElements ?? 0,
      };
    } catch (err) {
      console.error("Failed to fetch functions:", err);
      return { data: [], totalCount: 0 };
    }
  }, []);

  const handleView = (record) => {
    setViewFunction(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingFunction(record);
    setIsAddModalOpen(true);
  };

  const handleAddFunction = () => {
    setEditingFunction(null);
    setIsAddModalOpen(true);
  };

  const handleSaveFunction = async () => {
    setIsAddModalOpen(false);
    setEditingFunction(null);
    setRefreshTrigger((n) => n + 1);
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.functionName);
    if (!confirmed) return;

    try {
      const res = await deletefunctionmaster(record.id);
      showApiResult(res, {
        successTitle: "Deleted",
        fallbackSuccess: "The function has been removed.",
        errorTitle: "Delete failed",
        onSuccess: () => setRefreshTrigger((n) => n + 1),
      });
    } catch (err) {
      console.error("Failed to delete function:", err);
      showApiError(err, { title: "Delete failed" });
    }
  };

  // Status toggle has no backend field/endpoint yet — flagged, not wired.
  const handleToggleStatus = (record) => {
    console.warn("Status toggle has no backend support yet:", record.id);
  };

  const columns = useMemo(
    () =>
      getFunctionColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl mb-3">
      <DataGridSearchBox columnId="functionName" placeholder="Search Function Name..." />

   
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Page header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddFunction}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        serverSide
        onFetchData={handleFetchData}
        data={[refreshTrigger]}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      {/* Add / Edit Function Modal */}
      <AddFunctionModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFunction(null);
        }}
        onSave={handleSaveFunction}
        initialData={editingFunction}
      />

      {/* View Function Modal */}
      <ViewFunctionModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        functionData={viewFunction}
        onEdit={(fn) => {
          setIsViewModalOpen(false);
          handleEdit(fn);
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const FilterDropdown = ({ label, value, options, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none rounded-lg border border-rose-100 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
    >
      <option value="" disabled hidden>
        {label}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={14}
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
    />
  </div>
);

export default FunctionMaster;