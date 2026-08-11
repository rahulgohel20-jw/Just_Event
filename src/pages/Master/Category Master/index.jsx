import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { confirmDelete, showApiError, getPrimaryColor } from "../../../utils/swalHelpers";
import { TableComponent } from "@/components/table/TableComponent";
import { AddCategoryModal } from "../../../partials/modals/AddCategoryModal/AddCategoryModal";
import {
  PAGE_HEADER,
  STATUS_FILTER_OPTIONS,
  CATEGORY_NAME_FILTER_OPTIONS,
  getCategoryColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { getAllCategoryMaster, deletecategorymaster } from "@/services/apiServices";

const CategoryMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGINATION_SIZE || 10);
const userId = Number(localStorage.getItem("userId"));

  // Normalize an API row into the shape the table/columns expect
  const normalizeRow = (row, index) => ({
    id: row.id,
    srNo: String(index + 1).padStart(2, "0"),
    categoryName: {
      english: row.nameEnglish || "",
      hindi: row.nameHindi || "",
      gujarati: row.nameGujarati || "",
    },
    categoryTypeId: row.categoryTypeId,
    mainCategory: row.categoryTypeNameEnglish || "",
    status: row.isActive === false ? "inactive" : "active",
    createdDate: row.createdAt || "",
  });

  const fetchCategoryList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nameEnglish: searchText || "",
        page,
        size,
        sortBy: DEFAULT_SORTING?.sortBy || "id",
        sortDirection: DEFAULT_SORTING?.sortDirection || "DESC",
        userId: userId,
      };
      const res = await getAllCategoryMaster(payload);
      const list = res?.data?.data?.content || res?.data?.data || res?.data || [];
      setTableData(Array.isArray(list) ? list.map(normalizeRow) : []);
    } catch (err) {
      console.error("Failed to fetch category list:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, page, size]);

  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

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

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.categoryName?.english || "this category");
    if (!confirmed) return;

    try {
      await deletecategorymaster(record.id);
      Swal.fire({
        icon: "success",
        title: "Category Deleted",
        confirmButtonColor: getPrimaryColor(),
        timer: 1500,
        showConfirmButton: false,
      });
      fetchCategoryList();
    } catch (err) {
      showApiError(err, { title: "Something went wrong", fallback: "Failed to delete category." });
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  // Modal already calls addupdatecategorymaster itself and returns via onSave —
  // just refetch the list so it reflects server state.
  const handleSaveCategory = () => {
    handleCloseModal();
    fetchCategoryList();
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
      const englishName = row.categoryName?.english || "";
      const matchesSearch = englishName
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

     
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className=" flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
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

      <TableComponent
        columns={columns}
        data={filteredData}
        tableData={filteredData}
        loading={loading}
        paginationSize={size}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      <AddCategoryModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
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

export default CategoryMaster;