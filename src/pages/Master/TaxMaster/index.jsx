import { useMemo, useState } from "react";
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
  PAGE_HEADER,
  STATS_CARDS,
  TAX_NAME_FILTER_OPTIONS,
  TAX_TABLE_DATA,
  getTaxColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const STAT_ICONS = {
  receipt: Receipt,
  check: CheckCircle2,
  clock: Clock,
};

const TaxMaster = () => {
  const [tableData, setTableData] = useState(TAX_TABLE_DATA);
  const [searchText, setSearchText] = useState("");
  const [taxNameFilter, setTaxNameFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);

  const handleToggleStatus = (record) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: row.status === "active" ? "inactive" : "active" }
          : row
      )
    );
  };

  const handleView = (record) => console.log("View tax:", record);

  const handleEdit = (record) => {
    setEditingTax(record);
    setIsAddModalOpen(true);
  };

  const handleDelete = (record) => console.log("Delete tax:", record);

  const handleAddTax = () => {
    setEditingTax(null);
    setIsAddModalOpen(true);
  };

  const handleSaveTax = ({ taxName, taxPercentage }) => {
    if (editingTax) {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === editingTax.id
            ? { ...row, taxName, percentage: Number(taxPercentage) }
            : row
        )
      );
    } else {
      const newRow = {
        id: Date.now(), // replace with id from API response
        taxName,
        percentage: Number(taxPercentage),
        status: "active",
      };
      setTableData((prev) => [newRow, ...prev]);
    }
    setIsAddModalOpen(false);
    setEditingTax(null);
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

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch = row.taxName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesTaxName = taxNameFilter
        ? row.taxName.toLowerCase().replace(/\s+/g, "-") === taxNameFilter
        : true;
      return matchesSearch && matchesTaxName;
    });
  }, [tableData, searchText, taxNameFilter]);

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
          className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Tax Name"
          value={taxNameFilter}
          options={TAX_NAME_FILTER_OPTIONS}
          onChange={setTaxNameFilter}
        />

        <IconButton onClick={() => console.log("Refresh")}>
          <RefreshCcw size={16} />
        </IconButton>
        <IconButton onClick={() => console.log("Export")}>
          <Share2 size={16} />
        </IconButton>
        <IconButton onClick={() => console.log("Toggle columns")}>
          <Columns3 size={16} />
        </IconButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-rose-900">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddTax}
          className="flex items-center gap-2 rounded-lg bg-rose-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
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
        data={filteredData}
        tableData={filteredData}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
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

const FilterDropdown = ({ label, value, options, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none rounded-lg border border-rose-100 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
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

export default TaxMaster;