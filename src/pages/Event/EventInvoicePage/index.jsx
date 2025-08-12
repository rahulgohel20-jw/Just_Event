import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { columns, defaultData } from "./constant";
import { Button } from "antd";
import InvoiceTable from "@/components/InvoiceTable/InvoiceTable";
import { useNavigate } from "react-router-dom";
const EventInvoicePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [tableData, setTableData] = useState(defaultData);
  const steps = [
    {
      title: "Total Outstanding Receivable",
      value: "₹ 8,00,00,000.00",
    },
    {
      title: "Due Today",
      value: "₹ 0.00",
    },
    {
      title: "Due with in 30 days",
      value: "₹ 0.00",
    },
    {
      title: "Over Due Invoice",
      value: "₹ 0.00",
    },
    {
      title: "Average No. of Days for Getting Paid",
      value: "7 Days",
    },
  ];

  const handleAddInvoice = () => {
    navigate("/add-invoice");
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="flex justify-between items-center mb-4">
          <Breadcrumbs items={[{ title: "Invoice Overview" }]} />
          <Button
            className="bg-[#FDE7C7] rounded-lg text-[#845A12] border-[#845A12] font-semibold 
                       hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-[#845A12] 
                       shadow-addGuest flex items-center gap-2"
            onClick={handleAddInvoice}
          >
            Add Invoice
          </Button>
        </div>

        <div className="flex items-center justify-between mt-6 mb-8 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="w-full">
              <div
                className={`flex flex-col items-start justify-center gap-8 px-6 py-4 rounded-xl border shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] bg-white transition-all w-full h-[170px]`}
              >
                <span className="text-sm font-medium text[#1F1F1F]">
                  {step.title}
                </span>
                <div className="mt-3 font-bold text-[#000000]">
                  {step.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <InvoiceTable columns={columns} tableData={tableData} />
      </Container>
    </Fragment>
  );
};
export default EventInvoicePage;
