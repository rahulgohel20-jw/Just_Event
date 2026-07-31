import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  RefreshCcw,
  Share2,
  Columns3,
  ChevronDown,
  Receipt,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { AddTaxModal } from "../../../partials/modals/AddTaxModal/AddTaxModal";
import {
  getalltaxmaster,
  deletetaxmaster,
  getbyidtaxmaster,
} from "../../../services/apiServices"; // adjust path to your actual service
import {
  PAGE_HEADER,
  STATS_CARDS,
  getTaxColumns,
  DEFAULT_PAGE,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORTING,
} from "./constant";
import Swal from "sweetalert2";

const STAT_ICONS = {
  receipt: Receipt,
  check: CheckCircle2,
  clock: Clock,
};

const TaxMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGINATION_SIZE);
  const [totalElements, setTotalElements] = useState(0);

  const searchDebounceRef = useRef(null);
const  STATIC_USER_ID = 1 ;
  const fetchTaxList = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const payload = {
          isActive: null,
          page,
          size: pageSize,
          sortBy: DEFAULT_SORT_BY,
          sortDirection: DEFAULT_SORT_DIRECTION,
          taxNameEnglish: searchText,
          userId: STATIC_USER_ID,
          ...overrides,
        };
        const res = await getalltaxmaster(payload);
        const body = res?.data ?? res; // adjust based on your POST wrapper's response shape
        const content = body?.data?.content ?? [];
        setTableData(content);
        setTotalElements(body?.data?.totalElements ?? content.length);
      } catch (err) {
        console.error("Failed to fetch tax list:", err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );

  useEffect(() => {
    fetchTaxList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Debounce server-side search by tax name
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(DEFAULT_PAGE);
      fetchTaxList({ page: DEFAULT_PAGE });
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleToggleStatus = async (record) => {
    // Optimistic update
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id ? { ...row, isActive: !row.isActive } : row
      )
    );
    try {
      const { addupadtetaxmaster } = await import(
        "../../../services/apiServices" // adjust path as needed
      );
      await addupadtetaxmaster({
        id: record.id,
        isActive: !record.isActive,
        percentage: record.percentage,
        taxNameEnglish: record.taxNameEnglish,
        taxNameGujarati: record.taxNameGujarati,
        taxNameHindi: record.taxNameHindi,
        userId: STATIC_USER_ID,
      });
    } catch (err) {
      console.error("Failed to toggle tax status:", err);
      // Revert on failure
      setTableData((prev) =>
        prev.map((row) =>
          row.id === record.id ? { ...row, isActive: record.isActive } : row
        )
      );
    }
  };

  const handleView = async (record) => {
    try {
      const res = await getbyidtaxmaster(record.id);
      const body = res?.data ?? res; // adjust based on your GET wrapper's response shape
      const taxDetails = body?.data ?? body; // unwrap { msg, data, success }
      console.log("Tax details:", taxDetails);
    } catch (err) {
      console.error("Failed to fetch tax details:", err);
    }
  };

  const handleEdit = async (record) => {
    try {
      const res = await getbyidtaxmaster(record.id);
      const body = res?.data ?? res; // adjust based on your GET wrapper's response shape
      const taxDetails = body?.data ?? body; // unwrap { msg, data, success }
      setEditingTax(taxDetails);
      setIsAddModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch tax details for edit:", err);
    }
  };

 
  const handleAddTax = () => {
    setEditingTax(null);
    setIsAddModalOpen(true);
  };

  const handleSaveTax = async () => {
  setIsAddModalOpen(false);
  setEditingTax(null);
  await fetchTaxList();
};

const getPrimaryColor = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue("--tw-primary")
    .trim() || "#881337"; 

const handleDelete = async (record) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: `Do you want to delete "${record.taxNameEnglish}"? This action cannot be undone.`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "No",
    confirmButtonColor: "#881337",
    cancelButtonColor: "#6b7280",
  });

  if (!result.isConfirmed) return;

  try {
    await deletetaxmaster(record.id);
    Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Tax has been deleted successfully.",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    fetchTaxList();
  } catch (err) {
    console.error("Failed to delete tax:", err);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text:
        err?.response?.data?.errorMessage ||
        err?.message ||
        "Something went wrong. Please try again.",
    });
  }
};

  const columns = useMemo(
    () =>
      getTaxColumns({
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
          placeholder="Search Tax Name..."
          className="w-full rounded-lg border  bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
      
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-6">
      {/* Page header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddTax}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Stat cards */}
      {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS_CARDS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];
          return (
            <div
              key={stat.key}
              className="flex items-center gap-3 rounded-xl border border-rose-50 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-800">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
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
        paginationSize={pageSize}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
        // Server-side pagination - wire these props to whatever TableComponent expects
        pageIndex={page}
        pageCount={Math.ceil(totalElements / pageSize) || 1}
        totalRows={totalElements}
        onPageChange={setPage}
      />

      {/* Add / Edit Tax Modal */}
      <AddTaxModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTax(null);
        }}
        onSave={handleSaveTax}
        initialData={editingTax}
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
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-white text-gray-500 transition hover:bg-rose-50 hover:text-rose-800"
  >
    {children}
  </button>
);

export default TaxMaster;