import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";
import { ContentLoader } from "@/components/loaders/ContentLoader";
import { confirmDelete, showApiResult, showApiError } from "../../../utils/swalHelpers";
import {
  PAGE_HEADER,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  getPlanColumns,
} from "./constant";
import AddPlan from "./AddPlan";
import { getAllPlanMaster, getbyidplan, deleteplan } from "@/services/apiServices";

const userId = Number(localStorage.getItem("userId"));

const PlanMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState({ last: true, totalElements: 0, totalPages: 0 });

  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchPlanList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nameEnglish: searchText,
        page,
        size: DEFAULT_PAGINATION_SIZE,
        sortBy: DEFAULT_SORTING.sortBy,
        sortDirection: DEFAULT_SORTING.sortDirection,
        userId,
      };

      const res = await getAllPlanMaster(payload);
      const data = res?.data?.data;
      const list = data?.content || [];

      setTableData(Array.isArray(list) ? list : []);
      setPageMeta({
        last: data?.last ?? true,
        totalElements: data?.totalElements ?? list.length,
        totalPages: data?.totalPages ?? 1,
      });
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, page]);

  useEffect(() => {
    fetchPlanList();
  }, [fetchPlanList]);

  useEffect(() => {
    setPage(0);
  }, [searchText]);

  const handleEdit = async (row) => {
    try {
      const res = await getbyidplan(row.id);
      const item = res?.data?.data ?? res?.data;
      setEditingItem(item);
      setIsModalOpen(true);
    } catch (err) {
      showApiError(err);
    }
  };

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nameEnglish);
    if (!confirmed) return;

    try {
      const res = await deleteplan(row.id);
      showApiResult(res, { onSuccess: fetchPlanList });
    } catch (err) {
      showApiError(err);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    await fetchPlanList();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => getPlanColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  return (
    <div className="min-h-screen p-6 mt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl py-3">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by plan name..."
            className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="min-h-[300px] relative">
          <ContentLoader />
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          No plans found.
        </div>
      ) : (
        <TableComponent
          columns={columns}
          data={tableData}
          tableData={tableData}
          loading={false}
          paginationSize={DEFAULT_PAGINATION_SIZE}
        />
      )}

      <AddPlan
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          fetchPlanList();
        }}
        onSave={handleSaveItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default PlanMaster;