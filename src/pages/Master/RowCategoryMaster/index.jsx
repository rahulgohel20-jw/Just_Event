import React, { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { confirmDelete, showApiError, showApiResult } from "@/utils/swalHelpers";
import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  getRawCategoryColumns,
  ITEM_TYPE_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "./constant";
import AddRowCategory from "../../../partials/modals/add-row-category/AddRowCategory";
import {
  getAllRawCategoryMaster,
  addupdaterawcategory,
  deleterawcategory,
} from "@/services/apiServices";

const RowCategoryMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(0); // 0-indexed, matches Spring Pageable
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE);
  const [sorting, setSorting] = useState(DEFAULT_SORTING);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const searchDebounceRef = useRef(null);
const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        page: pageIndex,
        pageSize,
        sortBy: sorting?.[0]?.id,
        sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
        ...(typeFilter ? { itemType: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        userId,
      };

      const res = await getAllRawCategoryMaster(payload);
      // Spring Page envelope — same shape confirmed on raw-category-type/list
      const records = res?.data?.data?.content ?? [];
      const total = res?.data?.data?.totalElements ?? 0;

      console.log("Fetched raw categories:", records, "Total:", total);
      setTableData(records);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch raw categories:", err);
      setTableData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, sorting, typeFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (row) => {
    setEditingCategory(row);
    setIsModalOpen(true);
  };

const handleDelete = async (row) => {
    const confirmed = await confirmDelete(
      row.nameEnglish || "this category"
    );
    if (!confirmed) return;

    try {
      const res = await deleterawcategory(row.id);
      showApiResult(res, {
        successTitle: "Category Deleted",
        fallbackSuccess: "Category deleted successfully.",
        onSuccess: () => {
          if (tableData.length === 1 && pageIndex > 0) {
            setPageIndex((p) => p - 1);
          } else {
            fetchData();
          }
        },
      });
    } catch (err) {
      showApiError(err, {
        title: "Something went wrong",
        fallback: "Failed to delete category.",
      });
    }
  };

 const handleSaveCategory = async (formData) => {
    try {
        const payload = {
            nameEnglish: formData.categoryName?.english || "",
            nameHindi: formData.categoryName?.hindi || "",
            nameGujarati: formData.categoryName?.gujarati || "",
            rawCategoryTypeId: formData.rawCategoryTypeId,
            isActive: formData.isActive,
            ...(editingCategory ? { id: editingCategory.id } : {}),
            userId,
        };

        const res = await addupdaterawcategory(payload);
        showApiResult(res, {
            successTitle: editingCategory ? "Category Updated" : "Category Saved",
            onSuccess: () => {
                setIsModalOpen(false);
                setEditingCategory(null);
                fetchData();
            },
        });
    } catch (err) {
        showApiError(err, {
            title: "Something went wrong",
            fallback: "Failed to save category.",
        });
    }
};

  const columns = useMemo(
    () => getRawCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [tableData, pageIndex]
  );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-3">
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Name..."
          className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-dark placeholder:text-dark-clarity focus:outline-none focus:ring-2 focus:ring-primary-inverse"
        />
      </div>
     
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {toolbar}

      <TableComponent
        columns={columns}
        data={tableData}
        tableData={tableData}
        loading={loading}
        manualPagination
        manualSorting
        pageCount={Math.max(1, Math.ceil(totalCount / pageSize))}
        pagination={{ pageIndex, pageSize }}
        onPaginationChange={(updater) => {
          const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
          setPageIndex(next.pageIndex);
          setPageSize(next.pageSize);
        }}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      <AddRowCategory
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        initialData={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

const FilterDropdown = ({ label, value, options, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
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

export default RowCategoryMaster;