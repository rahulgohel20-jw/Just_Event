import { Fragment, useRef, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddLink from "../../partials/modals/add-link/AddLink";
import { columns, defaultData } from "./constant";
const LinkList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        handleModalOpen: handleModalOpen,
      };
    });
    return data;
  };
  const [tableData, setTableData] = useState(responseFormate());
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Links" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search link"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Link"
            >
              <i className="ki-filled ki-plus"></i> Add Link
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="btn-tabs btn-tabs-lg mb-3 w-full" data-tabs="true">
          <button className="btn active" title="Sales">
            <i className="ki-filled ki-chart-line"></i>
            Sales
          </button>
          <button className="btn" title="Marketing">
            <i className="ki-filled ki-dollar"></i>
            Marketing
          </button>
          <button className="btn" title="Customer Support">
            <i className="ki-filled ki-support"></i>
            Customer Support
          </button>
          <button className="btn" title="HR/Admin">
            <i className="ki-filled ki-user-tick"></i>
            HR/Admin
          </button>
          <button className="btn" title="General">
            <i className="ki-filled ki-share"></i>
            General
          </button>
          <button className="btn" title="Automation">
            <i className="ki-filled ki-scan-barcode"></i>
            Automation
          </button>
          <button className="btn" title="Operation">
            <i className="ki-filled ki-technology-4"></i>
            Operation
          </button>
        </div>
        <TableComponent
          columns={columns}
          tableData={tableData}
          paginationSize={10}
        />
      </Container>
      <AddLink isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  );
};
export { LinkList };
