import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, ChevronDown, Trash2, Edit } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import {
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
  STATUS_FILTER_OPTIONS,
} from "../Category Master/constant";
import { AddEventTypeModal } from "./AddEventTypeModal";
import {
  getAllEventTypemaster,
  deletecategorytypemaster,
  deleteEventTypeMaster,
} from "../../../services/apiServices";
import {
  confirmDelete,
  showApiResult,
  showApiError,
} from "@/utils/swalHelpers";

const EventTypeMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGINATION_SIZE || 100);

  const normalizeRow = (row, index) => ({
    id: row.id,
    srNo: String(index + 1).padStart(2, "0"),
    categoryName: {
      english: row.nameEnglish || "",
    },
    status: row.status ?? "active",
    nameEnglish: row.nameEnglish || "",
    imgPath: row.imgPath || "",
  });

  const fetchEventTypeList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nameEnglish: searchText || "",
        page,
        size,
        sortBy: DEFAULT_SORTING?.sortBy || "id",
        sortDirection: DEFAULT_SORTING?.sortDirection || "ASC",
        userId: 1, // static for now
      };
      const res = await getAllEventTypemaster(payload);
      const list =
        res?.data?.data?.content || res?.data?.data || res?.data || [];
      setTableData(Array.isArray(list) ? list.map(normalizeRow) : []);
    } catch (err) {
      console.error("Failed to fetch event type list:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, page, size]);

  useEffect(() => {
    fetchEventTypeList();
  }, [fetchEventTypeList]);

  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row,
      ),
    );
    // TODO: call status toggle API here, then refetch or update optimistically
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(
      record.categoryName?.english || "this category",
    );
    if (!confirmed) return;

    try {
      const res = await deleteEventTypeMaster(record.id);
      showApiResult(res, {
        successTitle: "Category Deleted",
        onSuccess: fetchEventTypeList,
      });
    } catch (err) {
      console.error("Delete category failed:", err);
      showApiError(err, { title: "Something went wrong" });
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

  const handleSaveCategory = () => {
    handleCloseModal();
    fetchEventTypeList();
  };

  const columns = useMemo(
    () => [
      {
        id: "srNo",
        accessorKey: "srNo",
        header: "Sr No.",
        size: 80,
      },
      {
        id: "imgPath",
        accessorKey: "imgPath",
        header: "Image",
        size: 120,
        cell: ({ row }) => {
          const url = row.original.imgPath;
          return url ? (
            <img
              src={url}
              alt={row.original.nameEnglish}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            "-"
          );
        },
      },
      {
        id: "nameEnglish",
        accessorKey: "nameEnglish",
        header: "Event Type Name",
        cell: ({ getValue }) => <span>{getValue() || "-"}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex items-center justify-start gap-2 text-rose-700">
              <button
                className="btn btn-sm btn-icon btn-clear"
                type="button"
                onClick={() => handleEdit(record)}
              >
                <i className="ki-filled ki-notepad-edit text-third"></i>
              </button>
              <button
                className="btn btn-sm btn-icon btn-clear text-danger"
                type="button"
                onClick={() => handleDelete(record)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleEdit],
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const englishName = row.nameEnglish || "";
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
          placeholder="Search Types..."
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
          <h1 className="text-2xl text-primary">Event Type Master</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Manage event types used while creating events. These tyeps help
            organize your portfolio and streamline reporting.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          Add Event Type
        </button>
      </div>

      <TableComponent
        columns={columns}
        data={filteredData}
        loading={loading}
        paginationSize={size}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      <AddEventTypeModal
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

export default EventTypeMaster;
