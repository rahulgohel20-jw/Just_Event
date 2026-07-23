import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCcw,
  Share2,
  Columns3,
  ChevronDown,
  LayoutGrid,
  Heart,
  Briefcase,
  Coins,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { AddFunctionModal } from "../../../partials/modals/AddFunctionModal/AddFunctionModal";
import { ViewFunctionModal } from "../../../partials/modals/AddFunctionModal/ViewFunctionModal";
import {
  PAGE_HEADER,
  STATS_CARDS,
  FUNCTION_TYPE_FILTER_OPTIONS,
  PRICE_RANGE_FILTER_OPTIONS,
  FUNCTION_TABLE_DATA,
  getFunctionColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const STAT_ICONS = {
  layout: LayoutGrid,
  heart: Heart,
  briefcase: Briefcase,
  coins: Coins,
};

const FunctionMaster = () => {
  const [tableData, setTableData] = useState(FUNCTION_TABLE_DATA);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRangeFilter, setPriceRangeFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState(null);
  const [viewFunction, setViewFunction] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
    setViewFunction(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingFunction(record);
    setIsAddModalOpen(true);
  };

  const handleDelete = (record) => console.log("Delete function:", record);

  const handleAddFunction = () => {
    setEditingFunction(null);
    setIsAddModalOpen(true);
  };

  const handleSaveFunction = (formValues) => {
    if (editingFunction) {
      setTableData((prev) =>
        prev.map((row) =>
          row.id === editingFunction.id
            ? {
                ...row,
                functionName: formValues.functionName,
                type: formValues.functionType?.label || row.type,
                timeFrom: formValues.timeFrom,
                timeTo: formValues.timeTo,
                price: Number(formValues.price) || 0,
                coverImage: formValues.coverImagePreview || row.coverImage,
              }
            : row
        )
      );
    } else {
      const newRow = {
        id: Date.now(), // replace with id from API response
        functionName: formValues.functionName,
        segment: "New Segment",
        type: formValues.functionType?.label || "General",
        status: "active",
        timeFrom: formValues.timeFrom,
        timeTo: formValues.timeTo,
        price: Number(formValues.price) || 0,
        coverImage:
          formValues.coverImagePreview ||
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop",
      };
      setTableData((prev) => [newRow, ...prev]);
    }
    setIsAddModalOpen(false);
    setEditingFunction(null);
  };

  const columns = useMemo(
    () =>
      getFunctionColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch = row.functionName
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesType = typeFilter
        ? row.type.toLowerCase() === typeFilter
        : true;
      const matchesPrice = priceRangeFilter
        ? isWithinPriceRange(row.price, priceRangeFilter)
        : true;
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [tableData, searchText, typeFilter, priceRangeFilter]);

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
          placeholder="Search Function Name..."
          className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Function Type"
          value={typeFilter}
          options={FUNCTION_TYPE_FILTER_OPTIONS}
          onChange={setTypeFilter}
        />
        <FilterDropdown
          label="Price Range"
          value={priceRangeFilter}
          options={PRICE_RANGE_FILTER_OPTIONS}
          onChange={setPriceRangeFilter}
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
          onClick={handleAddFunction}
          className="flex items-center gap-2 rounded-lg bg-rose-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      {/* Stat cards */}
      {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_CARDS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];
          const trendColor =
            stat.trendTone === "positive" ? "text-emerald-600" : "text-gray-400";
          return (
            <div
              key={stat.key}
              className="rounded-xl border border-rose-50 bg-white p-4 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-800 mb-3">
                <Icon size={18} />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-rose-800">{stat.value}</p>
              <p className={`text-xs mt-1 ${trendColor}`}>
                {stat.trendTone === "positive" && "↗ "}
                {stat.trend}
              </p>
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

      {/* Add / Edit Function Modal */}
      <AddFunctionModal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFunction(null);
        }}
        onSave={handleSaveFunction}
        initialData={editingFunction}
      />

      {/* View Function Modal */}
      <ViewFunctionModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        functionData={viewFunction}
        onEdit={(fn) => {
          setIsViewModalOpen(false);
          handleEdit(fn);
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isWithinPriceRange = (price, rangeValue) => {
  if (rangeValue === "50000+") return price >= 50000;
  const [min, max] = rangeValue.split("-").map(Number);
  return price >= min && price <= max;
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

export default FunctionMaster;