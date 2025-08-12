import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Input, Switch, Button } from "antd";
import ItemTable from "@/components/InvoiceTable/ItemTable";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";
import {
  SearchOutlined,
  EditOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const AddInvoicePage = () => {
  const [rows, setRows] = useState([
    {
      key: 1,
      item: "",
      qty: 0.0,
      rate: 0.0,
      discount: 0.0,
      tax: 0.0,
      amount: 0.0,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleDeleteRow = (key) => {
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        key: Date.now(),
        item: "",
        qty: 0.0,
        rate: 0.0,
        discount: 0.0,
        tax: 0.0,
        amount: 0.0,
      },
    ]);
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="flex justify-between items-center mb-4">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>

        <div className="bg-white ">
          <div className="flex items-center justify-between flex-wrap rounded-lg    py-2 mb-4 ">
            <div className="flex items-center justify-between flex-wrap gap-6 px-4 py-2 relative rounded-lg [border:1px_solid_transparent] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#96644D,#AB7955)_border-box] shadow-[10px_4px_4px_0px_#00000040]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Date:</span>
                <DatePicker
                  placeholder="Select Date"
                  size="small"
                  className="border-none "
                />
              </div>
              <div className="font-semibold text-lg">
                Invoice # <span className="font-normal">2021001</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Due Date:</span>
                <DatePicker
                  placeholder="Select Date"
                  size="small"
                  className="border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="text"
                className="bg-[#689F4E] text-white font-semibold rounded-lg"
              >
                save
              </Button>
              <Button
                type="text"
                icon={<EyeOutlined />}
                className="bg-[#BB8A5C] text-[#fff] font-semibold rounded-lg"
              >
                Preview
              </Button>
              <Button
                type="text"
                icon={<DownloadOutlined />}
                className="bg-[#96644D] text-white font-semibold rounded-lg"
              >
                Download
              </Button>
            </div>
          </div>

          <div className="mb-6 flex flex-row items-center gap-4">
            <label className="font-semibold text-[#464E5F]">
              Customer Name<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Search Name (ex. Swapnil Ghodaswar)"
              suffix={<SearchOutlined className="text[#494949] text-2xl" />}
              className="p-2  relative rounded-lg [border:1px_solid_transparent] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#96644D,#AB7955)_border-box] mt-1 w-2/5"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4 mt-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#464E5F]">
                  Billing Address
                </span>
                <EditOutlined className="text-[#8F5A00] cursor-pointer" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                45, Ashoknagar So. Ved Road,
                <br />
                Katargam, Surat 395004,
                <br />
                Gujarat, India
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Shipping Address</span>
                <EditOutlined className="text-[#8F5A00] cursor-pointer" />
              </div>
              <p className="text-sm text-[#8F5A00] cursor-pointer mt-1">
                + Add a New Address
              </p>
            </div>
          </div>

          <div className=" mb-4">
            <div className="border border-dashed mb-4 border-[#DEC7A8]"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-medium text-[#464E5F]">GST Treatment</span>
              <span className="text-black">Registered Business - Regular</span>
              <EditOutlined className="text-[#8F5A00] cursor-pointer" />
            </div>
            <div className="border border-dashed mb-4 border-[#DEC7A8]"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-medium  text-[#464E5F]">GST Number</span>
              <span className="text-black">27ABJFA7206Q1ZY</span>
              <EditOutlined className="text-[#8F5A00] cursor-pointer" />
            </div>
            <div className="border border-dashed mb-4 border-[#DEC7A8]"></div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#000000]">Late Fees</span>
            <Switch defaultChecked />
          </div>
        </div>

        <ItemTable
          rows={rows}
          onInputChange={handleInputChange}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
        />

        <InvoiceFooter />
      </Container>
    </Fragment>
  );
};

export default AddInvoicePage;
