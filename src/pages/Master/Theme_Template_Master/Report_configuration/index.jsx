// ReportKeyMaster.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { TableComponent } from "@/components/Table/TableComponent"; // adjust path
import { getallreportkey } from "@/services/apiServices";
import { REPORT_KEY_TABLE_HEADERS } from "./constant";
import { AddReportKey } from "./AddReportKey";

export default function ReportKeyMaster() {
  const [tableData, setTableData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getallreportkey();
      if (res?.data?.success) {
        setTableData(res.data.data || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to load report keys",
          text: res?.data?.msg || "Something went wrong",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load report keys",
        text: err?.response?.data?.msg || err.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openAdd = () => {
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setModalOpen(true);
  };

  const handleSaved = (updatedList) => {
  setModalOpen(false);
  setEditingRow(null);
  if (updatedList && updatedList.length) {
    setTableData(updatedList);
  } else {
    fetchList(); // fallback if API shape ever changes
  }
};

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this report key?",
      text: row.name,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });
    if (!confirm.isConfirmed) return;

    try {
      // TODO: replace with the real delete API once available
      Swal.fire({
        icon: "info",
        title: "Delete API not wired yet",
        text: "Let me know the endpoint and I'll connect it.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete",
        text: err?.response?.data?.msg || err.message,
      });
    }
  };

  const columns = useMemo(
    () => REPORT_KEY_TABLE_HEADERS({ onEdit: openEdit, onDelete: handleDelete }),
    []
  );

  const filteredData = useMemo(() => {
    if (!query.trim()) return tableData;
    const q = query.toLowerCase();
    return tableData.filter((row) => (row.name || "").toLowerCase().includes(q));
  }, [tableData, query]);

  return (
    <div className="m-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl text-primary">Report Key Master</h2>
          <p className="text-sm text-gray-500  mt-1">
            Central repository for all report keys used across operations.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-primary text-light text-sm font-semibold rounded-xl px-4 py-2.5 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Report Key
        </button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="w-4 h-4 text-dark-light absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-light border border-primary-clarity rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-inverse"
        />
      </div>

      <TableComponent
        columns={columns}
        tableData={filteredData}
        paginationSize={5}
        defaultSorting={[{ id: "id", desc: true }]}
        toolbar={false}
        serverSide={false}
        data={filteredData}
      />

      <AddReportKey
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSaved}
        editingRow={editingRow}
        loading={loading}
      />
    </div>
  );
}