import { useState, useEffect, useCallback, useRef ,useMemo } from "react";
import { Users, CheckCircle2, XCircle, Search, Plus } from "lucide-react";
import { getMemberColumns, STATUS_TABS } from "./constant";
import { getalluser } from "@/services/apiServices";
import { TableComponent } from "../../../components/table/TableComponent";
import { SelectAssignThemeModal } from "./component/SelectAssignThemeModal"; 
import { useNavigate } from "react-router-dom";
const PAGE_SIZE = 10;

const MembersPage = () => {
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
const [themeModalOpen, setThemeModalOpen] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
  const searchRef = useRef(search);
  const statusRef = useRef(status);
  const navigate = useNavigate();
  useEffect(() => { searchRef.current = search; }, [search]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // guards against duplicate/looping calls with identical params
  const lastRequestKeyRef = useRef(null);
  const inFlightRef = useRef(false);

  const buildPayload = (page, size) => ({
    cityId: null,
    clientId: null,
    companyName: "",
    countryId: null,
    isActive: statusRef.current === "inactive" ? false : true,
    isBlock: false,
    page,
    roleId: null,
    search: searchRef.current,
    size,
    sortBy: "id",
    sortDirection: "ASC",
    stateId: null,
    userType: "ADMIN",
  });

  const tableDataRef = useRef(tableData);
const totalCountRef = useRef(totalCount);
useEffect(() => { tableDataRef.current = tableData; }, [tableData]);
useEffect(() => { totalCountRef.current = totalCount; }, [totalCount]);

const fetchMembers = useCallback(async (pageIndex = 0, pageSize = PAGE_SIZE, force = false) => {
  const payload = buildPayload(pageIndex, pageSize);
  const requestKey = JSON.stringify(payload);

  if (!force && inFlightRef.current) return { data: tableDataRef.current, total: totalCountRef.current };
  if (!force && requestKey === lastRequestKeyRef.current) return { data: tableDataRef.current, total: totalCountRef.current };

  lastRequestKeyRef.current = requestKey;
  inFlightRef.current = true;
  setLoading(true);

  try {
    const res = await getalluser(payload);
    const resData = res?.data?.data ?? res?.data ?? {};
    const rows = resData?.content ?? [];
    const total = resData?.totalElements ?? 0;

    setTableData(rows);
    setTotalCount(total);

    return { data: rows, total };
  } catch (err) {
    console.error("Failed to fetch members", err);
    return { data: [], total: 0 };
  } finally {
    setLoading(false);
    inFlightRef.current = false;
  }
}, []); // 👈 now stable — no more dep on tableData/totalCount
  useEffect(() => {
    lastRequestKeyRef.current = null; // status change = new intentional fetch
    fetchMembers(0, PAGE_SIZE, true);
  }, [status, fetchMembers]);

  const handleSearchTrigger = () => fetchMembers(0, PAGE_SIZE, true);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearchTrigger();
  };
const handleAssignTheme = async (theme) => {
  try {
    // TODO: replace with actual assign API, e.g. assignThemeToUser({ userId: selectedMember.id, templateMasterId: theme.id })
    console.log("Assign theme", theme, "to member", selectedMember);
    setThemeModalOpen(false);
    setSelectedMember(null);
  } catch (err) {
    showApiError(err, { title: "Failed to assign theme" });
  }
};
 const handleFetchData = useCallback(
  ({ pageIndex, pageSize }) => fetchMembers(pageIndex, pageSize),
  [fetchMembers]
);

  const handleSelectTheme = useCallback((member) => {
  setSelectedMember(member);
  setThemeModalOpen(true);
}, []);
  const handleSelectDate = useCallback((member) => {}, []);
const handleAddUser = () => {
  navigate("/auth/signup");
};
  const columns = useMemo(
    () => getMemberColumns({ onSelectTheme: handleSelectTheme, onSelectDate: handleSelectDate }),
    [handleSelectTheme, handleSelectDate]
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Members</h1>
       
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              onClick={handleSearchTrigger}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search users..."
              className="pl-9 pr-3 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center bg-gray-50 rounded-lg p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatus(tab.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  status === tab.key ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddUser}
          className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          Add User
        </button>
      </div>
<SelectAssignThemeModal
  open={themeModalOpen}
  onClose={() => {
    setThemeModalOpen(false);
    setSelectedMember(null);
  }}
  onAssign={handleAssignTheme}
  userId={selectedMember?.id}   
/>
      <TableComponent
        columns={columns}
        data={tableData}
        totalCount={totalCount}
        paginationSize={PAGE_SIZE}
        serverSide
        onFetchData={handleFetchData}
        toolbar={false}
      />
    </div>
  );
};

export default MembersPage;