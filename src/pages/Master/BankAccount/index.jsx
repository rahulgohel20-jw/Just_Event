import { useEffect, useMemo, useState } from "react";
import { Input, Button } from "antd";
import { Plus } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import Swal from "sweetalert2";
import { getBankDetailsColumns } from "./constant";
import { TableComponent } from "../../../components/table/TableComponent";
import { AddBankAccount } from "./AddBankAccount";
import { getallbankaccount, deletebankaccount } from "@/services/apiServices";
import { showApiError } from "@/utils/swalHelpers";

const BankDetailsMasterPage = () => {
  const intl = useIntl();
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async (searchValue = "") => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem("userId")) || 0;
      const res = await getallbankaccount({
        isPrimary: null,
        page: 0,
        search: searchValue,
        size: 100,
        sortBy: "id",
        sortDirection: "ASC",
        userId,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? body?.data ?? [];
      setTableData(content);
    } catch (err) {
      console.error("Failed to fetch bank details:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchBankDetails(value);
  };

  const handleEdit = (record) => {
    setEditingAccount(record);
    setModalOpen(true);
  };

  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: "Delete Bank Details?",
      text: `This will permanently delete "${record.accountHolderName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deletebankaccount(record.id);
      Swal.fire({
        title: "Deleted",
        text: "Bank details deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchBankDetails(search);
    } catch (err) {
      console.error("Failed to delete bank details:", err);
      showApiError(err, { title: "Failed to delete" });
    }
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const columns = useMemo(
    () => getBankDetailsColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">
          <FormattedMessage id="BANK_DETAILS.TITLE" defaultMessage="Bank Details Master" />
        </h1>
        <Button
          type="primary"
          onClick={handleAdd}
          className="!bg-primary flex items-center gap-1"
        >
          <Plus size={16} />
          <FormattedMessage id="BANK_DETAILS.ADD" defaultMessage="Add Bank Details" />
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder={intl.formatMessage({
            id: "BANK_DETAILS.SEARCH_PLACEHOLDER",
            defaultMessage: "Search Bank Details...",
          })}
          value={search}
          onChange={handleSearchChange}
          className="max-w-xs"
          prefix={<i className="ki-filled ki-magnifier text-gray-400" />}
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

      <AddBankAccount
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={() => fetchBankDetails(search)}
        initialData={editingAccount}
      />
    </div>
  );
};

export { BankDetailsMasterPage };