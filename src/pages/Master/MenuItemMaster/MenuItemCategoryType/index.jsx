import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Select } from "antd";

import { TableComponent } from "@/components/table/TableComponent";
import { ContentLoader } from "@/components/loaders/ContentLoader";
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";
import {
  getallmenuitemcattype,
  deletemenuitemtype,
} from "@/services/apiServices";
import { Addmenuitemcattype } from "./Addmenuitemcattype";

const PAGE_HEADER = {
  title: "Menu Type Master",
  description: "Manage menu category types used across menu item categories.",
  addButtonLabel: "Add Menu Type",
};

const DEFAULT_PAGINATION_SIZE = 10;
const DEFAULT_SORTING = { sortBy: "id", sortDirection: "ASC" };

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

const userId = Number(localStorage.getItem("userId"));

const Menuitemcattypemaster = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageMeta, setPageMeta] = useState({ last: true, totalElements: 0, totalPages: 0 });

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuTypeList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nameEnglish: searchText,
        isActive: statusFilter === "" ? null : statusFilter === "true",
        page,
        size: DEFAULT_PAGINATION_SIZE,
        sortBy: DEFAULT_SORTING.sortBy,
        sortDirection: DEFAULT_SORTING.sortDirection,
        userId,
      };

      const res = await getallmenuitemcattype(payload);
      const data = res?.data?.data;
      const list = data?.content || [];

      setTableData(Array.isArray(list) ? list : []);
      setPageMeta({
        last: data?.last ?? true,
        totalElements: data?.totalElements ?? list.length,
        totalPages: data?.totalPages ?? 1,
      });
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, page]);

  useEffect(() => {
    fetchMenuTypeList();
  }, [fetchMenuTypeList]);

  useEffect(() => {
    setPage(0);
  }, [searchText, statusFilter]);

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nameEnglish);
    if (!confirmed) return;

    try {
      const res = await deletemenuitemtype(row.id);
      showApiResult(res, { onSuccess: fetchMenuTypeList });
    } catch (err) {
      showApiError(err);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    await fetchMenuTypeList();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "srNo",
        cell: ({ row }) =>
          String(page * DEFAULT_PAGINATION_SIZE + row.index + 1).padStart(2, "0"),
      },
      {
        header: "Menu Type Name",
        accessorKey: "nameEnglish",
        cell: ({ row }) => (
          <span className="text-primary font-medium">{row.original.nameEnglish}</span>
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
    ],
    [page]
  );

  return (
    <div className="min-h-screen p-6 mt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl text-primary">{PAGE_HEADER.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
        >
          <Plus size={16} />
          {PAGE_HEADER.addButtonLabel}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl py-3">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Name..."
            className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          options={STATUS_OPTIONS}
          className="w-36"
          placeholder="Status"
        />
      </div>

      {loading ? (
        <div className="min-h-[300px] relative">
          <ContentLoader />
        </div>
      ) : tableData.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          No menu types found.
        </div>
      ) : (
        <TableComponent
          columns={columns}
          data={tableData}
          tableData={tableData}
          loading={false}
          paginationSize={DEFAULT_PAGINATION_SIZE}
        />
      )}

      <Addmenuitemcattype
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          fetchMenuTypeList();
        }}
        onSave={handleSaveItem}
        initialData={editingItem}
      />
    </div>
  );
};

export { Menuitemcattypemaster };