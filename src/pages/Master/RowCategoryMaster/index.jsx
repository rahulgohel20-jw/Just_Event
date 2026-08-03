import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ChevronDown,
} from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  RAW_CATEGORY_TABLE_DATA,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  getRawCategoryColumns,
  ITEM_TYPE_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "./constant";
import AddRowCategory from "../../../partials/modals/add-row-category/AddRowCategory";

const RowCategoryMaster = () => {
  const [tableData, setTableData] = useState(RAW_CATEGORY_TABLE_DATA);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch = row.categoryName
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesType = typeFilter
        ? row.itemType === typeFilter
        : true;

      const matchesStatus = statusFilter
        ? row.status === statusFilter
        : true;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [tableData, searchText, typeFilter, statusFilter]);

  const handleEdit = (row) => {
    setEditingCategory(row);
    setIsModalOpen(true);
  };
  const handleDelete = (row) => console.log("Delete", row);

  const columns = useMemo(
    () =>
      getRawCategoryColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
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
      {/* Item Type */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Select Type"
          value={typeFilter}
          options={ITEM_TYPE_OPTIONS}
          onChange={setTypeFilter}
        />


        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={setStatusFilter}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red=900"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Toolbar */}
      {toolbar}

      {/* Table */}
      <TableComponent
        columns={columns}
        data={filteredData}
        tableData={filteredData}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
      />

      <AddRowCategory
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        initialData={editingCategory}
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