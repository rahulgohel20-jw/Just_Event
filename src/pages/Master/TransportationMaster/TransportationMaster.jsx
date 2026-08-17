import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import {
  PAGE_HEADER,
  STATUS_FILTER_OPTIONS,
  getTransportationColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { AddTransportationModal } from "./AddTransportationModal";
import { GetAllTransportaion, DeleteTransportation } from "@/services/apiServices";
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";

const TransportationMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransportation, setEditingTransportation] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGINATION_SIZE || 10);
  const userId = Number(localStorage.getItem("userId"));

  const normalizeRow = (row, index) => ({
    id: row.id,
    srNo: String(index + 1).padStart(2, "0"),
    tripBegin: {
      value: row.from?.id ?? null,
      label: row.from?.nameEnglish ?? "",
    },
    tripEnd: {
      value: row.to?.id ?? null,
      label: row.to?.nameEnglish ?? "",
    },
    amount: row.amount ?? "",
    agency: {
      value: row.partyId ?? null,
      label: row.partyName ?? "",
    },
    status: row.status ?? "active",
    createdDate: row.createdDate
      ? new Date(row.createdDate).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "",
  });

  const fetchTransportationList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        page,
        size,
        sortBy: DEFAULT_SORTING?.sortBy || "id",
        sortDirection: DEFAULT_SORTING?.sortDirection || "ASC",
        userId,
      };
      const res = await GetAllTransportaion(payload);
      const list = res?.data?.data?.content || res?.data?.data || res?.data || [];
      setTableData(Array.isArray(list) ? list.map(normalizeRow) : []);
    } catch (err) {
      console.error("Failed to fetch transportation list:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, userId]);

  useEffect(() => {
    fetchTransportationList();
  }, [fetchTransportationList]);

  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row
      )
    );
    // TODO: call status toggle API here, then refetch or update optimistically
  };

  const handleView = (record) => console.log("View transportation:", record);

  const handleEdit = (record) => {
    setEditingTransportation(record);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (record) => {
    const label = `${record.tripBegin?.label || "?"} → ${record.tripEnd?.label || "?"}`;
    const confirmed = await confirmDelete(label);
    if (!confirmed) return;

    try {
      const res = await DeleteTransportation(record.id);
      showApiResult(res, {
        successTitle: "Transportation Deleted",
        onSuccess: fetchTransportationList,
      });
    } catch (err) {
      console.error("Delete transportation failed:", err);
      showApiError(err, { title: "Something went wrong" });
    }
  };

  const handleAddTransportation = () => {
    setEditingTransportation(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTransportation(null);
  };

  const handleSaveTransportation = () => {
    handleCloseModal();
    fetchTransportationList();
  };

  const columns = useMemo(
    () =>
      getTransportationColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const haystack = `${row.tripBegin?.label || ""} ${row.tripEnd?.label || ""} ${row.agency?.label || ""}`.toLowerCase();
      const matchesSearch = haystack.includes(searchText.toLowerCase());
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
          placeholder="Search Origin, Destination, Agency..."
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className=" flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddTransportation}
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

      <AddTransportationModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransportation}
        initialData={editingTransportation}
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

export default TransportationMaster;