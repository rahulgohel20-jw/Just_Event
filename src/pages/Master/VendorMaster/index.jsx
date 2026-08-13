import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCcw,
  Share2,
  Columns3,
  ChevronDown,
  Users,
  CheckCircle2,
  TrendingUp,
  Shapes,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { AddVendorModal } from "../../../partials/modals/AddVendorModal/AddVendorModal";
import { ViewVendorModal } from "../../../partials/modals/AddVendorModal/ViewVendorModal";
import { confirmDelete, showApiResult, showApiError } from "../../../utils/swalHelpers";
import {
  PAGE_HEADER,
  STATS_CARDS,
  STATUS_FILTER,
  getVendorColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import {
  deleteClientMaster,
  getAllClientMaster,
  getClientById,
  getAllCategoryMaster,
} from "../../../services/apiServices";

const STAT_ICONS = {
  users: Users,
  check: CheckCircle2,
  trending: TrendingUp,
  category: Shapes,
};

const VendorMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [viewVendor, setViewVendor] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const userId = Number(localStorage.getItem("userId"));

  // Same source + same "not Customer" rule AddVendorModal uses for its
  // category picker, so the filter dropdown always matches what a vendor
  // can actually be categorized as.
  const fetchCategoryOptions = useCallback(async () => {
    try {
      const res = await getAllCategoryMaster({
        nameEnglish: "",
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDirection: "DESC",
        userId,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? body?.data ?? [];

      const filtered = (Array.isArray(content) ? content : []).filter(
        (item) => item.categoryTypeNameEnglish !== "Customer"
      );

      setCategoryOptions([
        { value: "", label: "All" },
        ...filtered.map((item) => ({ value: item.id, label: item.nameEnglish })),
      ]);
    } catch (err) {
      console.error("Failed to load category filter options:", err);
      setCategoryOptions([{ value: "", label: "All" }]);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategoryOptions();
  }, [fetchCategoryOptions]);

  const normalizeRow = (row) => ({
    id: row.id,
    vendorName: row.nameEnglish || row.nameHindi || row.nameGujarati || "",

    vendorNameEnglish: row.nameEnglish,
    vendorNameHindi: row.nameHindi,
    vendorNameGujarati: row.nameGujarati,

    email: row.email || "",
    mobileNumber: row.mobileNo || "",
    mainCategory: row.categoryNameEnglish || "",
    categoryTypeNameEnglish: row.categoryTypeNameEnglish,

    status: row.isActive === false ? "inactive" : "active",

    initials: (row.nameEnglish || "NA")
      .split(" ")
      .map((x) => x[0])
      .join("")
      .substring(0, 2)
      .toUpperCase(),

    birthDate: row.birthDate,
    anniversary: row.aniversaryDate,
    address: row.address,
    officeNo: row.officeNo,
    openingBalance: row.openingBalance,
    uniqueCode: row.uniqueCode,

    createdDate: row.createdAt,
  });

  const fetchVendorList = useCallback(async () => {
    setLoading(true);

    try {
      const payload = {
        categoryId: categoryFilter ? Number(categoryFilter) : -1,
        isActive: statusFilter === "" ? null : statusFilter === "active",

        nameEnglish: searchText,

        page,
        size,

        sortBy: DEFAULT_SORTING?.sortBy || "id",
        sortDirection: DEFAULT_SORTING?.sortDirection || "DESC",

        uniqueCode: "",
        userId,
      };

      const res = await getAllClientMaster(payload);
      const list = res?.data?.data?.content || res?.data?.data || [];

      const vendorsOnly = Array.isArray(list)
        ? list.filter((item) => item.categoryTypeNameEnglish !== "Customer")
        : [];

      setTableData(vendorsOnly.map((item) => normalizeRow(item)));
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, categoryFilter, statusFilter, page, size]);

  useEffect(() => {
    fetchVendorList();
  }, [fetchVendorList]);

  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row
      )
    );
  };

  const handleView = (record) => {
    setViewVendor({
      ...record,
      firmName: record.vendorName,
      category: record.mainCategory,
      primaryMobile: record.mobileNumber,
      emailAddress: record.email,
      fullAddress: record.address,
      openingBalance: record.openingBalance,
      isVerified: true,
    });
    setIsViewModalOpen(true);
  };

  const handleEdit = async (record) => {
    try {
      const res = await getClientById(record.id);
      const vendor = res?.data?.data ?? res?.data;

      setEditingVendor(vendor);
      setIsAddModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.vendorName || "this vendor");
    if (!confirmed) return;

    try {
      const res = await deleteClientMaster(record.id);
      const success = showApiResult(res, {
        successTitle: "Deleted",
        errorTitle: "Failed",
      });
      if (success) fetchVendorList();
    } catch (err) {
      showApiError(err, { title: "Error" });
    }
  };

  const handleAddVendor = () => setIsAddModalOpen(true);

  const handleSaveVendor = async () => {
    await fetchVendorList();
    setEditingVendor(null);
    setIsAddModalOpen(false);
  };

  const columns = useMemo(
    () =>
      getVendorColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-3">
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Name, Mobile or Email..."
          className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 "
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_FILTER}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="Category Name"
          value={categoryFilter}
          options={categoryOptions}
          onChange={setCategoryFilter}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddVendor}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      <TableComponent
        columns={columns}
        data={tableData}
        tableData={tableData}
        loading={loading}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        toolbar={toolbar}
      />

      <AddVendorModal
        open={isAddModalOpen}
        initialData={editingVendor}
        onClose={() => {
          setEditingVendor(null);
          setIsAddModalOpen(false);
          fetchVendorList();
        }}
        onSave={handleSaveVendor}
      />

      <ViewVendorModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        vendor={viewVendor}
        onEdit={(vendor) => {
          setIsViewModalOpen(false);
          handleEdit(vendor);
        }}
      />
    </div>
  );
};

const IconButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-white text-gray-500 transition hover:bg-rose-50 hover:text-rose-800"
  >
    {children}
  </button>
);

const FilterDropdown = ({ label, value, options, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none rounded-lg border border-rose-100 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 "
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

export default VendorMaster;