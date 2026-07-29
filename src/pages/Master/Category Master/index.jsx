import { useMemo, useState } from "react";
import { Plus, Search, RefreshCcw, Share2, Columns3, ChevronDown } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { AddCategoryModal } from "../../../partials/modals/AddCategoryModal/AddCategoryModal";
import {
  PAGE_HEADER,
  STATS_CARDS,
  STATUS_FILTER_OPTIONS,
  CATEGORY_NAME_FILTER_OPTIONS,
  CATEGORY_TABLE_DATA,
  getCategoryColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const CategoryMaster = () => {
  const [tableData, setTableData] = useState(CATEGORY_TABLE_DATA);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row
      )
    );
  };

  const handleView = (record) => console.log("View category:", record);

  const handleEdit = (record) => {
    setEditingCategory(record);
    setIsAddModalOpen(true);
  };

  const handleDelete = (record) => console.log("Delete category:", record);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = ({ categoryName, mainCategory }) => {
    if (editingCategory) {
      // Update existing row
      setTableData((prev) =>
        prev.map((row) =>
          row.id === editingCategory.id
            ? { ...row, categoryName, mainCategory }
            : row
        )
      );
    } else {
      // Create new row
      const newRow = {
        id: Date.now(), // replace with real id from API response
        srNo: String(tableData.length + 1).padStart(2, "0"),
        categoryName,
        mainCategory,
        status: "active",
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      setTableData((prev) => [newRow, ...prev]);
    }
    handleCloseModal();
  };

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch = row.categoryName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesStatus = statusFilter ? row.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [tableData, searchText, statusFilter]);

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl  p-3">
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
       <input
  type="text"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="Search Category..."
  className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
/>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_FILTER_OPTIONS}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="Category Name"
          value={categoryFilter}
          options={CATEGORY_NAME_FILTER_OPTIONS}
          onChange={setCategoryFilter}
        />

       
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-6">
      {/* Page header */}
      <div className=" flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Stat cards */}


      {/* Table */}
      <TableComponent
        columns={columns}
        data={filteredData}
        tableData={filteredData}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      {/* Add / Edit Category Modal */}
      <AddCategoryModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const IconButton = ({ children, onClick }) => (
 <button
  type="button"
  onClick={onClick}
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
>
    {children}
  </button>
);

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

export default CategoryMaster;