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
  Gift,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { AddClientModal } from "../../../partials/modals/AddClientModal/AddClientModal";
import { confirmDelete, showApiResult, showApiError } from "../../../utils/swalHelpers";
import {
  PAGE_HEADER,
  STATS_CARDS,
  CITY_FILTER_OPTIONS,
  CATEGORY_NAME_FILTER_OPTIONS,
  getClientColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  STATUS_FILTER,
} from "./constant";
import { ViewClientModal } from "../../../partials/modals/AddClientModal/ViewClientModal";
import { deleteClientMaster, getAllClientMaster, getClientById } from "../../../services/apiServices";
import Swal from "sweetalert2";

const STAT_ICONS = {
  users: Users,
  check: CheckCircle2,
  trending: TrendingUp,
  gift: Gift,
};

const CityMaster = () => null; // placeholder guard (unused)

const ClientMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingClient, setEditingClient] = useState(null);
  const [viewClient, setViewClient] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const userId = Number(localStorage.getItem("userId"));

  const normalizeRow = (row, index) => ({
    id: row.id,
    clientName:
      row.nameEnglish ||
      row.nameHindi ||
      row.nameGujarati ||
      "",

    clientNameEnglish: row.nameEnglish,
    clientNameHindi: row.nameHindi,
    clientNameGujarati: row.nameGujarati,

    email: row.email || "",

    mobileNumber: row.mobileNo || "",

    mainCategory: row.categoryNameEnglish || "",

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

  const fetchClientList = useCallback(async () => {
    setLoading(true);

    try {
      const payload = {
        categoryTypeId : 1,
        categoryId: categoryFilter ? Number(categoryFilter) : null,
        isActive:
          statusFilter === ""
            ? null
            : statusFilter === "active",

        nameEnglish: searchText,

        page,
        size,

        sortBy: DEFAULT_SORTING?.sortBy || "id",
        sortDirection:
          DEFAULT_SORTING?.sortDirection || "DESC",

        uniqueCode: "",
        userId,
      };

      const res = await getAllClientMaster(payload);
      const list =
        res?.data?.data?.content ||
        res?.data?.data ||
        [];

      setTableData(
        Array.isArray(list)
          ? list.map((item, index) =>
            normalizeRow(item, index)
          )
          : []
      );
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchText,
    categoryFilter,
    statusFilter,
    page,
    size,
  ]);
  useEffect(() => {
    fetchClientList();
  }, [fetchClientList]);
  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row
      )
    );
  };

 const handleView = async (record) => {
    try {
      const res = await getClientById(record.id);
      const client = res?.data?.data ?? res?.data;

      setViewClient({
        id: client.id,
        fullName: client.nameEnglish || client.nameHindi || client.nameGujarati || "",
        initials: (client.nameEnglish || "NA")
          .split(" ")
          .map((x) => x[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
        accountType: client.categoryNameEnglish || "—",
        accountStatus: client.isActive === false ? "Inactive Account" : "Active Account",
        clientCategory: client.categoryNameEnglish || "—",
        birthDate: client.birthDate || "",
        anniversary: client.aniversaryDate || "",
        primaryMobile: client.mobileNo || "",
        officeNumber: client.officeNo || "",
        emailAddress: client.email || "",
        homeAddress: client.address || "",
        gstNumber: client.gstNo || "",
        panNumber: client.panCardNo || "",
        aadharNumber: client.aadharCardNo || "",
        openingBalance: client.openingBalance ?? "",
        balanceType: client.opbType || "CR",
        uniqueCode: client.uniqueCode || "",
        createdDate: client.createdAt || "",
        kycDetails: client.kycDetails || [],
      });
      setIsViewModalOpen(true);
    } catch (err) {
      showApiError(err, { title: "Failed", fallback: "Failed to load client details." });
    }
  };

  const handleEdit = async (record) => {
    try {
      const res = await getClientById(record.id);

      const client =
        res?.data?.data ??
        res?.data;

      setEditingClient(client);
      setIsAddModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.clientName || "this client");
    if (!confirmed) return;

    try {
      const res = await deleteClientMaster(record.id);
      const success = showApiResult(res, {
        successTitle: "Deleted",
        errorTitle: "Failed",
      });
      if (success) fetchClientList();
    } catch (err) {
      showApiError(err, { title: "Error" });
    }
  };

  const handleAddClient = () => setIsAddModalOpen(true);


  const handleSaveClient = async () => {
    await fetchClientList();   // Refresh table
    setEditingClient(null);
    setIsAddModalOpen(false);  // Close modal
  };
  const columns = useMemo(
    () =>
      getClientColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
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
          placeholder="Search by Name, Mobile or Email..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

  
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
<h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddClient}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red=900"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Stat cards */}
      {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CARDS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];
          const badgeTone =
            stat.badgeTone === "positive"
              ? "text-rose-700 bg-rose-50"
              : stat.badgeTone === "warning"
              ? "text-amber-700 bg-transparent"
              : "text-gray-500 bg-transparent";
          return (
            <div
              key={stat.key}
              className="rounded-xl border border-rose-50 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-800">
                  <Icon size={18} />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeTone}`}>
                  {stat.badge}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div> */}

      {/* Table */}
      <TableComponent
        columns={columns}
        data={tableData}
        tableData={tableData}
        loading={loading}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      {/* Add Client Modal */}
      <AddClientModal
        open={isAddModalOpen}
        initialData={editingClient}
        onClose={() => {
          setEditingClient(null);
          setIsAddModalOpen(false);
          fetchClientList();
        }}
        onSave={handleSaveClient}
      />
      <ViewClientModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        client={viewClient}
        onEdit={(client) => {
          setIsViewModalOpen(false);
          handleEdit(client);
        }}
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

export default ClientMaster;