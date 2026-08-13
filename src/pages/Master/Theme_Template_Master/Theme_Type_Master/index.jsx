import { useEffect, useMemo, useState } from "react";
import { Input, Button } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { getTemplateTypeColumns } from "./constant";
import { AddThemeType } from "./AddThemeType";
import { TableComponent } from "../../../../components/table/TableComponent";

const TemplateTypePage = () => {
  const intl = useIntl();
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  useEffect(() => {
    fetchTemplateTypes();
  }, []);

  const fetchTemplateTypes = async (searchValue = "") => {
    // TODO: replace with actual API call
    // const res = await api.get("/template-type", { params: { search: searchValue } });
    // setTableData(res.data);
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
    // TODO: replace with actual delete API call
    // await api.delete(`/template-type/${record.id}`);
    fetchTemplateTypes(search);
  };

  const handleCreateTheme = () => {
    setEditingTheme(null);
    setThemeModalOpen(true);
  };

  const handleCloseThemeModal = () => {
    setThemeModalOpen(false);
    setEditingTheme(null);
  };

  const handleSaveTheme = (savedTheme) => {
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
        <h1 className="text-xl font-semibold">
          <FormattedMessage id="TEMPLATE_TYPE.TITLE" defaultMessage="Template Type" />
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="text-primary">
            <FormattedMessage id="COMMON.DASHBOARD" defaultMessage="Dashboard" />
          </Link>
          <span className="text-gray-400">›</span>
          <span>
            <FormattedMessage id="TEMPLATE_TYPE.TITLE" defaultMessage="Template Type" />
          </span>
          <Button type="primary" className="!bg-green-600 ml-3">
            <i className="ki-filled ki-plus"></i>
            <FormattedMessage id="COMMON.CREATE_NEW" defaultMessage="Create New" />
          </Button>
        </div>
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
        <Button type="primary" onClick={handleCreateTheme}>
          <i className="ki-filled ki-plus"></i>
          <FormattedMessage id="THEME.CREATE" defaultMessage="Create Theme" />
        </Button>
      </div>

      {/* Table */}
      <TableComponent
        columns={columns}
        tableData={tableData}
        paginationSize={10}
        defaultSorting={[]}
        toolbar={false}
        serverSide={false}
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