import { useMemo, useState } from "react";
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
import {
  PAGE_HEADER,
  STATS_CARDS,
  CATEGORY_FILTER_OPTIONS,
  VENDOR_TABLE_DATA,
  getVendorColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const STAT_ICONS = {
  users: Users,
  check: CheckCircle2,
  trending: TrendingUp,
  category: Shapes,
};

const VendorMaster = () => {
  const [tableData, setTableData] = useState(VENDOR_TABLE_DATA);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
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
    // In production, fetch full vendor detail from API using record.id
    setViewVendor({
      ...record,
      firmName: "Apex Media Firm",
      category: record.mainCategory,
      primaryMobile: record.mobileNumber,
      emailAddress: "contact@apexmedia.in",
      fullAddress:
        "402, Signature Towers, Industrial Area Phase II, Near Metro Station, New Delhi - 110020, India",
      city: "New Delhi",
      zipCode: "110020",
      openingBalance: "25,000",
      balanceType: "CR",
      gstNo: "07AAACR1234F1Z1",
      panNo: "AAACR1234F",
      aadharNo: "4567 •••• 8901",
      tdsRate: "2.00",
      updatedInfo: "Updated Oct 24, 2023 by Admin",
      isVerified: true,
    });
    setIsViewModalOpen(true);
  };

  const handleEdit = (record) => console.log("Edit vendor:", record);
  const handleDelete = (record) => console.log("Delete vendor:", record);

  const handleAddVendor = () => setIsAddModalOpen(true);

  const handleSaveVendor = (formValues) => {
    const newRow = {
      id: Date.now(), // replace with id from API response
      vendorName: formValues.vendorName,
      firmId: formValues.vendorCode,
      mainCategory: formValues.category?.label || "General",
      status: "active",
      mobileNumber: formValues.mobile1,
      initials: formValues.vendorName
        ? formValues.vendorName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "NA",
    };
    setTableData((prev) => [newRow, ...prev]);
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

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchesSearch =
        row.vendorName.toLowerCase().includes(searchText.toLowerCase()) ||
        row.mobileNumber.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = categoryFilter
        ? row.mainCategory.toLowerCase().replace(/\s+/g, "-") === categoryFilter
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [tableData, searchText, categoryFilter]);

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
          className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Category Name"
          value={categoryFilter}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={setCategoryFilter}
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
          onClick={handleAddVendor}
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
                {stat.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeTone}`}>
                    {stat.badge}
                  </span>
                )}
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
        data={filteredData}
        tableData={filteredData}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
      />

      {/* Add Vendor Modal */}
      <AddVendorModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveVendor}
      />

      {/* View Vendor Modal */}
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

export default VendorMaster;