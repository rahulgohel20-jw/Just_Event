import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import { Link } from "react-router-dom";

const EventListPage = () => {
  const classes = useStyle();

  const [tableData, setTableData] = useState();
  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        proforma_invoice: (
          <Link to="/proforma-invoice">
          <Tooltip className="cursor-pointer" title="Proforma Invoice">
            <div className="flex justify-center items-center w-full">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </Tooltip>
          </Link>
        ),
        invoice: (
          <Link to="/event-invoice">
          <Tooltip className="cursor-pointer" title="Invoice">
            <div className="flex justify-center items-center w-full">
              <Receipt className="w-5 h-5 text-success" />
            </div>
          </Tooltip>
          </Link>
        ),
        quotation: (
          <Link to="/quotation">
          <Tooltip className="cursor-pointer" title="Quotation">
            <div className="flex justify-center items-center w-full">
              <BadgeDollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </Tooltip>
          </Link>
        ),
        handleModalOpen: handleModalOpen,
      };
    });
    return data;
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setTableData(responseFormate());
  }, []);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Event"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/add-event">
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Event"
            >
              <i className="ki-filled ki-plus"></i> Add Event
            </button>
            </Link>
          </div>
        </div>
        <TableComponent
          columns={columns}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default EventListPage;
