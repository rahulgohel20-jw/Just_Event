  import { useMemo, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import {
    Plus,
    Search,
    RefreshCcw,
    Share2,
    Columns3,
    ChevronDown,
    Building2,
    Layers,
    Users,
    CheckCircle2,
  } from "lucide-react";
  import { TableComponent } from "@/components/table/TableComponent";
  import { ViewVenueModal } from "../../../partials/modals/AddVenuePage/ViewVenueModal";
  import {
    PAGE_HEADER,
    STATS_CARDS,
    VENUE_TYPE_FILTER_OPTIONS,
    CITY_FILTER_OPTIONS,
    STATE_FILTER_OPTIONS,
    VENUE_TABLE_DATA,
    getVenueColumns,
    DEFAULT_PAGINATION_SIZE,
    DEFAULT_SORTING,
  } from "./constant";

  const STAT_ICONS = {
    building: Building2,
    layers: Layers,
    users: Users,
    check: CheckCircle2,
  };

  const VenueMaster = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState(VENUE_TABLE_DATA);
    const [searchText, setSearchText] = useState("");
    const [venueTypeFilter, setVenueTypeFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");
    const [viewVenue, setViewVenue] = useState(null);
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
      // In production, fetch full venue detail from API using record.id
      setViewVenue({
        ...record,
        tagline: "Unforgettable Corporate & Social Events",
        operationalHours: "06:00 AM - 12:00 PM",
        subVenues: [
          { name: "Royal Hall", code: "RH-01", capacity: 800 },
          { name: "Garden Lawn", code: "GL-A", capacity: 400 },
          { name: "VIP Lounge", code: null, underRenovation: true },
        ],
        primaryContact: "Rajesh Verma (Manager)",
        phone: "+91 98765 43210",
        email: "info@grandheritage.com",
        website: "www.grandheritage.com",
        fullAddress: "Block A, Heritage Square, Near SG Highway, Satellite, Ahmedabad, Gujarat 380015",
        photoCount: 12,
        internalRemarks:
          "The Grand Heritage remains our primary recommendation for high-cap corporate summits. Note that AV equipment requires a 48-hour prior setup window.",
      });
      setIsViewModalOpen(true);
    };

    // Navigate to the full-page Add/Edit Venue screen, not a modal
    const handleAddVenue = () => navigate("/master/venuemaster/add");
    const handleEdit = (record) => navigate(`/venues/edit/${record.id}`);
    const handleDelete = (record) => console.log("Delete venue:", record);

    const columns = useMemo(
      () =>
        getVenueColumns({
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onToggleStatus: handleToggleStatus,
        }),
      []
    );

    const filteredData = useMemo(() => {
      return tableData.filter((row) => {
        const matchesSearch = row.venueName
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesType = venueTypeFilter
          ? row.venueType.toLowerCase() === venueTypeFilter
          : true;
        const matchesCity = cityFilter
          ? row.city.toLowerCase() === cityFilter
          : true;
        const matchesState = stateFilter
          ? row.state.toLowerCase() === stateFilter
          : true;
        return matchesSearch && matchesType && matchesCity && matchesState;
      });
    }, [tableData, searchText, venueTypeFilter, cityFilter, stateFilter]);

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
            placeholder="Search Vendor Name..."
            className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Venue Type"
            value={venueTypeFilter}
            options={VENUE_TYPE_FILTER_OPTIONS}
            onChange={setVenueTypeFilter}
          />
          <FilterDropdown
            label="City"
            value={cityFilter}
            options={CITY_FILTER_OPTIONS}
            onChange={setCityFilter}
          />
          <FilterDropdown
            label="State"
            value={stateFilter}
            options={STATE_FILTER_OPTIONS}
            onChange={setStateFilter}
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
            <h1 className="text-3xl font-bold text-primary">{PAGE_HEADER.title}</h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
          </div>
          <button
            type="button"
            onClick={handleAddVenue}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
          >
            <Plus size={16} />
            {PAGE_HEADER.addButtonLabel}
          </button>
        </div>

        {/* Stat cards */}
        {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <p className="text-xs uppercase tracking-wide text-gray-400">{stat.label}</p>
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

        {/* View Venue Modal */}
        <ViewVenueModal
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          venue={viewVenue}
          onEdit={(venue) => {
            setIsViewModalOpen(false);
            handleEdit(venue);
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

  export default VenueMaster;