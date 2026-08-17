import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { DataGridSearchBox } from "@/components/table/DataGridSearchBox";
import {
  PAGE_HEADER,
  getLabourShiftColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";
import { AddLabourShiftModal } from "./Addlabourshiftmodal";
import { getalllabourshift, deletelabourshift } from "@/services/apiServices";

const LabourShiftMaster = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGINATION_SIZE,
  });
  const [sorting, setSorting] = useState(DEFAULT_SORTING);
  const [searchText, setSearchText] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  const userId = Number(localStorage.getItem("userId"));

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    try {
      const sortCol = sorting?.[0]?.id ?? "id";
      const sortDir = sorting?.[0]?.desc ? "DSCE" : "ASC";

      const payload = {
        nameEnglish: searchText || "",
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sortCol,
        sortDirection: sortDir,
        userId,
      };

      const res = await getalllabourshift(payload);
      const body = res?.data?.data ?? res?.data ?? {};

      setRows(body?.content ?? []);
      setTotalElements(body?.totalElements ?? 0);
    } catch (err) {
      console.error("Failed to fetch labour shifts:", err);
      showApiError(err, { title: "Failed to load shifts" });
      setRows([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, searchText, userId]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  // debounce search -> reset to first page whenever the term changes
  useEffect(() => {
    const handle = setTimeout(() => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 400);
    return () => clearTimeout(handle);
  }, [searchText]);

  const handleAddShift = () => {
    setEditingShift(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setEditingShift(record);
    setIsFormOpen(true);
  };

  const handleSaveShift = () => {
    setIsFormOpen(false);
    setEditingShift(null);
    fetchShifts();
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.nameEnglish);
    if (!confirmed) return;

    try {
      const res = await deletelabourshift(record.id);
      const success = showApiResult(res, {
        successTitle: "Deleted",
        fallbackSuccess: "The shift has been removed.",
        errorTitle: "Failed",
      });
      if (success) {
        fetchShifts();
      }
    } catch (err) {
      console.error("Failed to delete labour shift:", err);
      showApiError(err, { title: "Failed" });
    }
  };

  const columns = useMemo(
    () =>
      getLabourShiftColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl mb-3">
      <DataGridSearchBox
        placeholder="Search Shift..."
        value={searchText}
        onChange={setSearchText}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Page header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          {PAGE_HEADER.description && (
            <p className="mt-1 max-w-xl text-sm text-gray-500">
              {PAGE_HEADER.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddShift}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        data={rows}
        loading={loading}
        manualPagination
        pageCount={Math.ceil(totalElements / pagination.pageSize) || 1}
        pagination={pagination}
        onPaginationChange={setPagination}
        manualSorting
        sorting={sorting}
        onSortingChange={setSorting}
        toolbar={toolbar}
      />

      {/* Create / Edit Shift Modal */}
      <AddLabourShiftModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingShift(null);
        }}
        onSave={handleSaveShift}
        initialData={editingShift}
      />
    </div>
  );
};

export default LabourShiftMaster;