import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, FileSpreadsheet } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { getalluser , getbyiduser  } from "@/services/apiServices"; // TODO: confirm real deleteuser/getbyiduser function names
import {
  PAGE_HEADER,
  getUserColumns,
  DEFAULT_PAGE,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORTING,
} from "./constant";
import { showApiError } from "@/utils/swalHelpers";
import { Createmember } from "./Createmember";

const UserMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGINATION_SIZE);
  const [totalElements, setTotalElements] = useState(0);
const [editLoading, setEditLoading] = useState(false); 
const userId = Number(localStorage.getItem("userId"));
  const searchDebounceRef = useRef(null);

  const fetchUserList = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const payload = {
  cityId: null,
  clientId: userId,
  companyName: "",
  countryId: null,
  isActive: true,
  isBlock: false,
  page,
  roleId: null,
  search: searchText,
  size: pageSize,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
  stateId: null,
  userType: "MEMBER",
  ...overrides,
};
        const res = await getalluser(payload);
        const body = res?.data ?? res;
        const content = body?.data?.content ?? [];
        setTableData(content);
        setTotalElements(body?.data?.totalElements ?? content.length);
      } catch (err) {
        console.error("Failed to fetch user list:", err);
        showApiError(err, { title: "Failed to load users" });
        setTableData([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );

  useEffect(() => {
    fetchUserList();
  }, [page, pageSize]);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(DEFAULT_PAGE);
      fetchUserList({ page: DEFAULT_PAGE });
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  const handleEdit = async (record) => {
  setEditLoading(true);
  try {
    const res = await getbyiduser(record.id);
    const body = res?.data ?? res;
    const user = body?.data;

    const mapped = {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      mobileNo: user.contactNo ?? "",
      isChildUser: false, // not present in getbyiduser response
      countryId: user.userBasicDetails?.country?.id ?? null,
      stateId: user.userBasicDetails?.state?.id ?? null,
      cityId: user.userBasicDetails?.city?.id ?? null,
      roleId: user.userBasicDetails?.role?.id ?? null,
      officeEmail: user.userBasicDetails?.companyEmail ?? "",
      companyName: user.userBasicDetails?.companyName ?? "",
      address: user.userBasicDetails?.address ?? "",
    };

    setEditingUser(mapped);
    setIsAddModalOpen(true);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    showApiError(err, { title: "Failed to load user" });
  } finally {
    setEditLoading(false);
  }
};

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const handleSaveUser = () => {
    fetchUserList();
    setEditingUser(null);
    setIsAddModalOpen(false);
  };

  const handleDelete = (record) => {
    // TODO: confirm real delete function name (e.g. deleteuser) - not given yet
  };

  const handleAssignEvent = (record) => {
    // TODO: wire this — opens an "Assign Event" modal/page for this specific user?
  };

  const handleVerify = (record) => {
    // TODO: wire this — what does the shield-check action do exactly?
  };

  const handleAssignEventsBulk = () => {
    // TODO: wire the top-right "Assign Events" button
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onAssignEvent: handleAssignEvent,
        onVerify: handleVerify,
        onDelete: handleDelete,
        pageIndex: page,
        pageSize,
      }),
    [page, pageSize]
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
          placeholder="Search Member..."
          className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Page header */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
        </div>
        <div className="flex items-center gap-2">
         
          <button
            type="button"
            onClick={handleAddUser}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
          >
            <Plus size={16} />
            {PAGE_HEADER.addButtonLabel}
          </button>
        </div>
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        data={tableData}
        tableData={tableData}
        loading={loading}
        paginationSize={pageSize}
        defaultSorting={DEFAULT_SORTING}
        toolbar={toolbar}
        pageIndex={page}
        pageCount={Math.ceil(totalElements / pageSize) || 1}
        totalRows={totalElements}
        onPageChange={setPage}
      />

      {/* Add / Edit User Modal */}
      <Createmember
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialData={editingUser}
      />
    </div>
  );
};

export default UserMaster;