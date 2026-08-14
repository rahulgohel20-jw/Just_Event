import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Select } from "antd";
import {
  STATUS_OPTIONS,
  DEFAULT_PAGINATION_SIZE,
  getMenuItemColumns,
} from "./constant";
import { getallmenuitem, deletemenutiem } from "@/services/apiServices";
import { confirmDelete, showApiResult, showApiError } from "../../../../utils/swalHelpers";
import { TableComponent } from "../../../../components/table/TableComponent";
import { AddMenuitemmaster } from "./AddMenuitemmaster";



const DEBOUNCE_MS = 400;

const MenuItemMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy] = useState("id");
  const [sortDirection] = useState("DSEC");

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const debounceRef = useRef(null);

  // TODO: confirm how userId is actually stored/read elsewhere in this app
  const userId = Number(localStorage.getItem("userId"));

  const fetchList = async () => {
    setLoading(true);
    try {
      const payload = {
        isActive: statusFilter === "" ? null : statusFilter === "true",
        menuCategoryId: null,
        nameEnglish: search,
        page: pageIndex,
        size: pageSize,
        sortBy,
        sortDirection,
        userId,
      };

      const res = await getallmenuitem(payload);

      if (res?.data?.success) {
        setTableData(res.data.data?.content ?? []);
        setTotalElements(res.data.data?.totalElements ?? 0);
      } else {
        setTableData([]);
        setTotalElements(0);
        showApiResult(res, { errorTitle: "Failed to load", fallbackError: "Failed to load menu items." });
      }
    } catch (err) {
      setTableData([]);
      setTotalElements(0);
      showApiError(err, { title: "Failed to load" });
    } finally {
      setLoading(false);
    }
  };

  // Refetch on page/size/status change
  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, statusFilter]);

  // Debounced refetch on search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPageIndex(0);
      fetchList();
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filteredData = useMemo(() => tableData, [tableData]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nameEnglish);
    if (!confirmed) return;

    try {
      const res = await deletemenutiem(row.id);
      showApiResult(res, {
        successTitle: "Deleted",
        fallbackSuccess: "Menu item has been deleted.",
        errorTitle: "Delete Failed",
        fallbackError: "Failed to delete menu item.",
        onSuccess: () => {
          // if we deleted the last row on a page beyond the first, step back a page
          if (tableData.length === 1 && pageIndex > 0) {
            setPageIndex((prev) => prev - 1);
          } else {
            fetchList();
          }
        },
      });
    } catch (err) {
      showApiError(err, { title: "Delete Failed" });
    }
  };

  // Called by AddMenuitemmaster after a successful add/edit API call
  const handleModalSave = () => {
    setModalOpen(false);
    fetchList();
  };

const columns = useMemo(
  () =>
    getMenuItemColumns({
      pageIndex,
      pageSize,
      onEdit: handleEdit,
      onDelete: handleDelete,
    }),
  [pageIndex, pageSize]
);
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl  text-primary">Menu Item Master</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage menu items grouped under each menu category.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
        >
          <Plus size={16} />
          Add Menu Item
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(val) => {
            setPageIndex(0);
            setStatusFilter(val);
          }}
          options={STATUS_OPTIONS}
          className="w-36"
          placeholder="Status"
        />
      </div>

  <TableComponent
  columns={columns}
  tableData={filteredData}
  loading={loading}
  paginationSize={pageSize}
  pageIndex={pageIndex}
  pageCount={Math.ceil(totalElements / pageSize) || 1}
  totalElements={totalElements}
  onPageChange={setPageIndex}
  onPageSizeChange={(size) => {
    setPageIndex(0);
    setPageSize(size);
  }}
/>

      <AddMenuitemmaster
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initialData={editData}
      />
    </div>
  );
};

export { MenuItemMaster };