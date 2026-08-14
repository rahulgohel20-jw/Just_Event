import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Select } from "antd";
import { AddMenuItemCategoryModal } from "./AddMenuItemCategoryModal";
import { TableComponent } from "../../../../components/table/TableComponent";
// TODO: adjust these two import paths to match your actual folders
import { getallmenuitemcat, deletemenuitemcat } from "@/services/apiServices";
import { confirmDelete, showApiResult, showApiError } from "../../../../utils/swalHelpers";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const DEBOUNCE_MS = 400;

const MenuItemCategoryMaster = () => {
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
        menuCategoryTypeId: null,
        nameEnglish: search,
        page: pageIndex,
        size: pageSize,
        sortBy,
        sortDirection,
        userId,
      };

      const res = await getallmenuitemcat(payload);

      if (res?.data?.success) {
        setTableData(res.data.data?.content ?? []);
        setTotalElements(res.data.data?.totalElements ?? 0);
      } else {
        setTableData([]);
        setTotalElements(0);
        showApiResult(res, { errorTitle: "Failed to load", fallbackError: "Failed to load menu item categories." });
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
    const result = await Swal.fire({
      title: "Delete Menu Item Category?",
      text: `This will permanently remove "${row.nameEnglish}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7A2E45",
      cancelButtonColor: "#999",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deletemenuitemcat(row.id);
      if (res?.data?.success) {
        Swal.fire("Deleted", "Menu item category has been deleted.", "success");
        // if we deleted the last row on a page beyond the first, step back a page
        if (tableData.length === 1 && pageIndex > 0) {
          setPageIndex((prev) => prev - 1);
        } else {
          fetchList();
        }
      } else {
        swalHelpers.showError(res?.data?.msg || "Failed to delete menu item category.");
      }
    } catch (err) {
      swalHelpers.showError(err);
    }
  };

  // Called by AddMenuItemCategoryModal after a successful add/edit API call
  const handleModalSave = () => {
    setModalOpen(false);
    fetchList();
  };

  const columns = [
    {
      header: "Sr. No.",
      accessorKey: "srNo",
      cell: ({ row }) =>
        String(pageIndex * pageSize + row.index + 1).padStart(2, "0"),
    },
    {
      header: "Menu Item Category Name",
      accessorKey: "nameEnglish",
      cell: ({ row }) => (
        <span className="text-primary font-medium">
          {row.original.nameEnglish}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Inactive
          </span>
        ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700"
          >
                <i className="ki-filled ki-notepad-edit text-third"></i>
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl  text-primary">
            Menu Item Category Master
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage menu item categories grouped under each menu category
            type.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
        >
          <Plus size={16} />
          Add Menu Item Category
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

      <AddMenuItemCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initialData={editData}
      />
    </div>
  );
};

export { MenuItemCategoryMaster };