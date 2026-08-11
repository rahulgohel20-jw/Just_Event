import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import {
  getallrolemaster,
  deleterolemaster,
  getbyidrolemaster
} from "../../../services/apiServices";
import {
  PAGE_HEADER,
  getRoleColumns,
  DEFAULT_PAGE,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORTING,
} from "./constant";
import Swal from "sweetalert2";
import AddRole from "../../../partials/modals/add-rolemaster/AddRole";

const STATIC_USER_ID = 1;

const RoleMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize] = useState(DEFAULT_PAGINATION_SIZE);
  const [totalElements, setTotalElements] = useState(0);

  const searchDebounceRef = useRef(null);

  const fetchRoleList = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const payload = {
          isActive: null,
          page,
          size: pageSize,
          sortBy: DEFAULT_SORT_BY,
          sortDirection: DEFAULT_SORT_DIRECTION,
          name: searchText,
          userId: STATIC_USER_ID,
          ...overrides,
        };
        const res = await getallrolemaster(payload);
        const body = res?.data ?? res;
        const content = body?.data?.content ?? [];
        setTableData(content);
        setTotalElements(body?.data?.totalElements ?? content.length);
      } catch (err) {
        console.error("Failed to fetch role list:", err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, searchText]
  );

  useEffect(() => {
    fetchRoleList();
  }, [page, pageSize]);


  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(DEFAULT_PAGE);
      fetchRoleList({ page: DEFAULT_PAGE });
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchText]);

  const handleView = async (record) => {
    try {
      const res = await getbyidrolemaster(record.id);
      const body = res?.data ?? res;
      const roleDetails = body?.data ?? body;
      console.log("Role details:", roleDetails);
    } catch (err) {
      console.error("Failed to fetch role details:", err);
    }
  };

  const handleEdit = async (record) => {
    try {
      const res = await getbyidrolemaster(record.id);

      const body = res?.data ?? res;

      const roleDetails = body?.data ?? body;

      setEditingRole({
        id: roleDetails.id,
        nameEnglish: roleDetails.nameEnglish,
        nameHindi: roleDetails.nameHindi,
        nameGujarati: roleDetails.nameGujarati,
      });

      setIsAddModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch role details:", err);
    }
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsAddModalOpen(true);
  };

  const handleSaveRole = async () => {
    await fetchRoleList();

    setEditingRole(null);
    setIsAddModalOpen(false);
  };

  const getPrimaryColor = () =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--tw-primary")
      .trim() || "#881337";


  const handleDelete = async (record) => {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();

    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Do you want to delete "${record.nameEnglish}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#7A2E45",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleterolemaster(record.id);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Role has been deleted successfully.",
        confirmButtonColor: primaryColor,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      fetchRoleList();
    } catch (err) {
      console.error("Failed to delete role:", err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          err?.response?.data?.errorMessage ||
          err?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: primaryColor,
      });
    }
  };

  const columns = useMemo(
    () =>
      getRoleColumns({
        onView: handleView,
        onEdit: handleEdit,
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
          placeholder="Search Role Name..."
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
          <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddRole}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
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

      {/* Add / Edit Role Modal */}
      <AddRole
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        initialData={editingRole}
      />
    </div>
  );
};

export default RoleMaster;
