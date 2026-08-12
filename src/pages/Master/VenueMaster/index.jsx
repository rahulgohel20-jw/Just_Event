import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, RefreshCcw, Share2, Columns3, ChevronDown,
  Building2, Layers, Users, CheckCircle2,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { ViewVenueModal } from "../../../partials/modals/AddVenuePage/ViewVenueModal";
import {
  PAGE_HEADER,
  VENUE_TYPE_FILTER_OPTIONS,
  CITY_FILTER_OPTIONS,
  STATE_FILTER_OPTIONS,
  getVenueColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { getallvenuemmmaster, getbyvenuid, deletevenu , updatestatus  } from "@/services/apiServices"; // adjust path
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";

const VenueMaster = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [venueTypeFilter, setVenueTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [viewVenue, setViewVenue] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

 const mapVenue = (v) => ({
  id: v.id,
  uuid: v.uuid,
  venueName: v.nameEnglish,
  venueNameHindi: v.nameHindi,
  venueNameGujarati: v.nameGujarati,
  venueType: v.venueType,
  subVenueCount: v.subVenueCount ?? 0,
  subVenues: v.subVenues ?? [],
  capacity: v.capacity ?? 0,
  status: v.isActive ? "active" : "inactive",
  contactNo: v.contactNo || "-",
  mobileNo: v.mobileNo || "-",
  email: v.email || "",
  website: v.website || "",
  instagram: v.instagram || "",
  addressEnglish: v.addressEnglish || "",
  addressHindi: v.addressHindi || "",
  addressGujarati: v.addressGujarati || "",
  city: v.cityNameEnglish || "-",
  state: v.stateNameEnglish || "-",
  country: v.countryName || "-",
  pincode: v.pincode || "",
  latitude: v.latitude || "",
  longitude: v.longitude || "",
  remarks: v.remarks || "",
  createdAt: v.createdAt || "",
  images: v.images ?? [],
  coverImage: v.images?.[0]?.path || "/placeholder-venue.png",
  raw: v, // safety net for any field not explicitly mapped above
});

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await getallvenuemmmaster({
        venueType: venueTypeFilter || null,
        city: cityFilter || null,
        state: stateFilter || null,
        search: searchText || null,
      });

      const content = res?.data?.data?.content ?? [];
      setTableData(Array.isArray(content) ? content.map(mapVenue) : []);
    } catch (err) {
      console.error("Failed to fetch venues:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const handleToggleStatus = async (record) => {
    const newIsActive = record.status !== "active"; // toggling TO this value
    const previousStatus = record.status;

    // Optimistic update
    setTableData((prev) =>
      prev.map((row) =>
        row.id === record.id
          ? { ...row, status: newIsActive ? "active" : "inactive" }
          : row
      )
    );

    try {
      const res = await updatestatus(record.id, newIsActive);
      const success = showApiResult(res, {
        successTitle: newIsActive ? "Venue Activated" : "Venue Deactivated",
        fallbackSuccess: "Status updated successfully.",
        errorTitle: "Failed to Update Status",
      });

      if (!success) {
        // Backend responded but reported failure — roll back
        setTableData((prev) =>
          prev.map((row) =>
            row.id === record.id ? { ...row, status: previousStatus } : row
          )
        );
      }
    } catch (err) {
      console.error("Failed to update venue status:", err);
      showApiError(err, { title: "Failed to Update Status" });
      // Network/API exception — roll back
      setTableData((prev) =>
        prev.map((row) =>
          row.id === record.id ? { ...row, status: previousStatus } : row
        )
      );
    }
  };
  const handleAddVenue = () => navigate("/master/venuemaster/add");

  const handleEdit = (record) =>
    navigate("/master/venuemaster/add", { state: { venueId: record.id } });

  const handleView = async (record) => {
    try {
      const res = await getbyvenuid(record.id);
      const body = res?.data ?? res;
      const venue = body?.data ?? body;
      setViewVenue(mapVenue(venue));
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch venue detail:", err);
      showApiError(err, { title: "Failed to Load Venue" });
    }
  };

  const handleDelete = async (record) => {
    const confirmed = await confirmDelete(record.venueName);
    if (!confirmed) return;

    try {
      const res = await deletevenu(record.id);
      const success = showApiResult(res, {
        successTitle: "Venue Deleted",
        fallbackSuccess: `"${record.venueName}" was deleted successfully.`,
        errorTitle: "Failed to Delete Venue",
        onSuccess: () => {
          setTableData((prev) => prev.filter((row) => row.id !== record.id));
        },
      });

      if (!success) return;
    } catch (err) {
      console.error("Failed to delete venue:", err);
      showApiError(err, { title: "Failed to Delete Venue" });
    }
  };

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
      const matchesSearch = row.venueName?.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = venueTypeFilter ? row.venueType?.toLowerCase() === venueTypeFilter : true;
      const matchesCity = cityFilter ? row.city?.toLowerCase() === cityFilter : true;
      const matchesState = stateFilter ? row.state?.toLowerCase() === stateFilter : true;
      return matchesSearch && matchesType && matchesCity && matchesState;
    });
  }, [tableData, searchText, venueTypeFilter, cityFilter, stateFilter]);

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl p-3">
      <div className="relative w-full max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Vendor Name..."
          className="w-full rounded-lg border border-rose-100 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl  text-primary">{PAGE_HEADER.title}</h1>
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

      <TableComponent
        columns={columns}
        data={filteredData}
        tableData={filteredData}
        paginationSize={DEFAULT_PAGINATION_SIZE}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
        loading={loading}
      />

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
      <option value="" disabled hidden>{label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
);

export default VenueMaster;