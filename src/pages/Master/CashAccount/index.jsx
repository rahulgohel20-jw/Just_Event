import { useEffect, useMemo, useState } from "react";
import { Input, Button } from "antd";
import { Plus } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import Swal from "sweetalert2";
import { getCashOpbColumns } from "./constant";
import { getallcashaccount, deletecashaccount } from "@/services/apiServices";
import { showApiError } from "@/utils/swalHelpers";
import { TableComponent } from "../../../components/table/TableComponent";
import { AddCashAccount } from "./AddcashAccount";

const CashaccountPage = () => {
  const intl = useIntl();
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    fetchCashOpb();
  }, []);

  const fetchCashOpb = async (searchValue = "") => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem("userId")) || 0;
      const res = await getallcashaccount({
        isPrimary: null,
        page: 0,
        search: searchValue,
        size: 100,
        sortBy: "id",
        sortDirection: "DESC",
        userId,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? body?.data ?? [];
      setTableData(content);
    } catch (err) {
      console.error("Failed to fetch cash OPB accounts:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchCashOpb(value);
  };

  const handleEdit = (record) => {
    setEditingAccount(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: "Delete Cash OPB?",
      text: `This will permanently delete "${record.accountName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletecashaccount(record.id);
      Swal.fire({
        title: "Deleted",
        text: "Cash OPB account deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchCashOpb(search);
    } catch (err) {
      console.error("Failed to delete cash OPB account:", err);
      showApiError(err, { title: "Failed to delete" });
    }
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const columns = useMemo(
    () => getCashOpbColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">
          <FormattedMessage id="CASH_OPB.TITLE" defaultMessage="Cash Account" />
        </h1>
         <Button
          type="primary"
          onClick={handleAdd}
          className="!bg-primary flex items-center gap-1"
        >
          <Plus size={16} />
          <FormattedMessage id="CASH_OPB.ADD" defaultMessage="Add Cash Account" />
        </Button>
      </div>

      {/* Search + Add */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder={intl.formatMessage({
            id: "CASH_OPB.SEARCH_PLACEHOLDER",
            defaultMessage: "Search cash OPB...",
          })}
          value={search}
          onChange={handleSearchChange}
          className="max-w-xs"
          prefix={<i className="ki-filled ki-magnifier text-gray-400" />}
        />
       
      </div>

     <TableComponent
        columns={columns}
        tableData={tableData}
        paginationSize={10}
        defaultSorting={[]}
        toolbar={false}
        serverSide={false}
        loading={loading}
      />

      <AddCashAccount
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={() => fetchCashOpb(search)}
        initialData={editingAccount}
      />
    </div>
  );
};

export { CashaccountPage };