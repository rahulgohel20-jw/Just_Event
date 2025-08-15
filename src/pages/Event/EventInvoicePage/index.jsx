import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { columns, defaultData } from "./constant";
import { Button } from "antd";
import InvoiceTable from "@/components/InvoiceTable/InvoiceTable";
import { useNavigate } from "react-router-dom";
import { CommonHexagonBadge } from "@/partials/common";
import { toAbsoluteUrl } from "@/utils";
import { Wallet, Calendar, Clock, AlertTriangle, Timer } from "lucide-react";

import { icon } from "leaflet";
const EventInvoicePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [tableData, setTableData] = useState(defaultData);
  const steps = [
  {
    title: "Total Outstanding Receivable",
    value: "₹ 8,00,00,000.00",
    icon: <Wallet className="w-6 h-6 text-[#845A12]" />,
  },
  {
    title: "Due Today",
    value: "₹ 0.00",
    icon: <Calendar className="w-6 h-6 text-[#845A12]" />,
  },
  {
    title: "Due within 30 days",
    value: "₹ 0.00",
    icon: <Clock className="w-6 h-6 text-[#845A12]" />,
  },
  {
    title: "Over Due Invoice",
    value: "₹ 0.00",
    icon: <AlertTriangle className="w-6 h-6 text-[#845A12]" />,
  },
  {
    title: "Average No. of Days for Getting Paid",
    value: "7 Days",
    icon: <Timer className="w-6 h-6 text-[#845A12]" />,
  },
];


  const handleAddInvoice = () => {
    navigate("/add-invoice");
  };
  return (
    <Fragment>
      <style>
                    {`
                      .user-access-bg {
                        background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
                      }
                      .dark .user-access-bg {
                        background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
                      }
                    `}
                  </style>
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

        <div className="flex items-center justify-between mt-6 mb-8 gap-4 ">
  {steps.map((step, index) => (
    <div key={index} className="w-full min-w-[200px] ">
      <div
        className="flex flex-col items-center justify-center gap-5 px-6 py-6 
                   rounded-xl border shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] 
                   bg-white transition-all min-h-[200px] text-center rtl:[background-position:-340px_center] [background-position:0px_center] bg-no-repeat bg-[length:500px] bg-[url('/images/bg_01.png')] user-access-bg bg-gradient-to-r from-[#fffaf5] to-white
shadow-lg
rounded-xl"
      >
        <CommonHexagonBadge
          stroke="stroke-danger-clarity"
          fill="fill-light"
          size="size-[50px]"
          badge={step.icon}
        />
        <span className="text-sm font-medium text-[#1F1F1F] leading-tight">
          {step.title}
        </span>
        <div className="mt-1 font-bold text-[#000000]">{step.value}</div>
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
