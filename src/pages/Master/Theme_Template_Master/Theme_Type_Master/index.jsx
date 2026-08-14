import { useEffect, useMemo, useState } from "react";
import { Input, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getTemplateTypeColumns } from "./constant";
import { AddThemeType } from "./AddThemeType";
import { TableComponent } from "../../../../components/table/TableComponent";
import {
  getallthemetypemaster,
  deletethemetype,
} from "@/services/apiServices";
import { showApiError } from "@/utils/swalHelpers";
import { Plus } from "lucide-react";

const TemplateTypePage = () => {
  const intl = useIntl();
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  useEffect(() => {
    fetchTemplateTypes();
  }, []);

  const fetchTemplateTypes = async (searchValue = "") => {
    setLoading(true);
    try {
      const res = await getallthemetypemaster({
        isAutoAssign: null,
        nameEnglish: searchValue,
        page: 0,
        size: 100,
        sortBy: "id",
        sortDirection: "ASC",
        templateModuleId: null,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? body?.data ?? [];
      setTableData(content);
    } catch (err) {
      console.error("Failed to fetch template types:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchTemplateTypes(value);
  };

  const handleEdit = (record) => {
    setEditingTheme(record);
    setThemeModalOpen(true);
  };

  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: "Delete Template Type?",
      text: `This will permanently delete "${record.nameEnglish || record.name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletethemetype(record.id);
      Swal.fire({
        title: "Deleted",
        text: "Template type deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchTemplateTypes(search);
    } catch (err) {
      console.error("Failed to delete template type:", err);
      showApiError(err, { title: "Failed to delete" });
    }
  };

  const handleCreateTheme = () => {
    setEditingTheme(null);
    setThemeModalOpen(true);
  };

  const handleCloseThemeModal = () => {
    setThemeModalOpen(false);
    setEditingTheme(null);
  };

  const handleSaveTheme = () => {
    // AddThemeType already calls the save API and shows success/error toasts internally,
    // so this just needs to refresh the list
    fetchTemplateTypes(search);
  };

  const columns = useMemo(
    () => getTemplateTypeColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-primary">
          <FormattedMessage id="TEMPLATE_TYPE.TITLE" defaultMessage="Template Type" />
        </h1>
           <button
                type="button"
                onClick={handleCreateTheme}
                className="flex items-center gap-1.5 bg-primary text-light text-sm font-semibold rounded-xl px-4 py-2.5 hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Create Theme Type
              </button>
      
      </div>

      {/* Search + Create Theme */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder={intl.formatMessage({
            id: "TEMPLATE_TYPE.SEARCH_PLACEHOLDER",
            defaultMessage: "Search Template...",
          })}
          value={search}
          onChange={handleSearchChange}
          className="max-w-xs"
        />
       
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        tableData={tableData}
        paginationSize={10}
        defaultSorting={[]}
        toolbar={false}
        serverSide={false}
        loading={loading}
      />

      {/* Create/Edit Theme Modal */}
      <AddThemeType
        open={themeModalOpen}
        onClose={handleCloseThemeModal}
        onSave={handleSaveTheme}
        initialData={editingTheme}
      />
    </div>
  );
};

export { TemplateTypePage };