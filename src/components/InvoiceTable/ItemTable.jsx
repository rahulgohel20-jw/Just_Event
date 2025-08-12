import { Table, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ItemTable = ({ rows, onInputChange, onAddRow, onDeleteRow }) => {
  const columns = [
    {
      title: "Item Details",
      dataIndex: "item",
      render: (text, record, index) => (
        <Input
          placeholder="Product Name"
          value={record.item}
          onChange={(e) => onInputChange(index, "item", e.target.value)}
          className="border-none shadow-none"
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.qty}
          onChange={(e) => onInputChange(index, "qty", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.rate}
          onChange={(e) => onInputChange(index, "rate", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.discount}
          onChange={(e) => onInputChange(index, "discount", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.tax}
          onChange={(e) => onInputChange(index, "tax", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) => {
        const amount =
          Number(record.qty) * Number(record.rate) -
          Number(record.discount) +
          Number(record.tax);
        return amount.toFixed(1);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined className="text-red-500" />}
          onClick={() => onDeleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <div className="mt-8">
      <div className="bg-[#FFF5EF] px-4 py-2 rounded-t-lg font-semibold text-[#464E5F]">
        Item Table
      </div>

      <Table
        dataSource={rows}
        columns={columns}
        pagination={false}
        bordered
        className="[&_.ant-table-thead>tr>th]:bg-white [&_.ant-table-cell]:text-center"
      />

      <div className="mt-3">
        <Button
          icon={
            <PlusOutlined className="font-bold bg-[#96644D] text-white rounded-[2px]" />
          }
          onClick={onAddRow}
          className=" text-[#96644D] border-none flex items-center"
        >
          Add New Row
        </Button>
      </div>
    </div>
  );
};

export default ItemTable;
