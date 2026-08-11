import React, { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  STATUS_OPTIONS,
  getRawSubCategoryColumns,
} from "./constant";
import AddRawSubCategory from "../../../partials/modals/add-rowsubcategory/AddRowSubCategory";
import {
  getAllRawSubCategoryMaster,
  addupdaterawsubcategory,
  deleterawsubcategory,
  getAllRawCategoryMaster,
} from "@/services/apiServices";

const RawSubCategoryMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE);
  const [sorting, setSorting] = useState(DEFAULT_SORTING);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
const userId = Number(localStorage.getItem("userId"));

  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Category", value: "" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const searchDebounceRef = useRef(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  // Load Main Category filter options once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllRawCategoryMaster({ page: 0, pageSize: 100, isActive: true , userId });
        const records = res?.data?.data?.content ?? [];
        setCategoryOptions([
          { label: "All Category", value: "" },
          ...records.map((r) => ({ label: r.nameEnglish, value: r.id })),
        ]);
      } catch (err) {
        console.error("Failed to fetch raw categories for filter:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        page: pageIndex,
        pageSize,
        sortBy: sorting?.[0]?.id,
        sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
        ...(categoryFilter ? { rawCategoryId: categoryFilter } : {}),
        ...(statusFilter ? { isActive: statusFilter === "active" } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        userId,
      };

      const res = await getAllRawSubCategoryMaster(payload);
      const records = res?.data?.data?.content ?? [];
      const total = res?.data?.data?.totalElements ?? 0;

      setTableData(records);
      setTotalCount(total);
    } catch (err) {
      console.error("Failed to fetch raw sub-categories:", err);
      setTableData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, sorting, categoryFilter, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (row) => {
    setEditingSubCategory(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      await deleterawsubcategory(row.id);
      if (tableData.length === 1 && pageIndex > 0) {
        setPageIndex((p) => p - 1);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete sub-category:", err);
    }
  };

  const handleAddSubCategory = () => {
    setEditingSubCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveSubCategory = async (formData) => {
    try {
      const payload = {
        nameEnglish: formData.subCategoryName?.english || "",
        nameHindi: formData.subCategoryName?.hindi || "",
        nameGujarati: formData.subCategoryName?.gujarati || "",
        mainCategoryId: formData.mainCategoryId,
        isActive: formData.isActive,
        userId,
        ...(editingSubCategory ? { id: editingSubCategory.id } : {}),
      };

      await addupdaterawsubcategory(payload);
      setIsModalOpen(false);
      setEditingSubCategory(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save sub-category:", err);
    }
  };

  const columns = useMemo(
    () => getRawSubCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [tableData, pageIndex]
  );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-3">
      <div className="relative w-full max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Main Category"
          value={categoryFilter}
          options={categoryOptions}
          onChange={(val) => {
            setCategoryFilter(val);
            setPageIndex(0);
          }}
        />

        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(val) => {
            setStatusFilter(val);
            setPageIndex(0);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 mt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>

        <button
          type="button"
          onClick={handleAddSubCategory}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm"
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

      <AddRawSubCategory
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubCategory(null);
        }}
        initialData={editingSubCategory}
        onSave={handleSaveSubCategory}
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

export default RawSubCategoryMaster;