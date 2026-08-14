import { Fragment, useEffect, useState, useCallback } from "react";
import { BadgeDollarSign, FileText, Receipt, Trash2 } from "lucide-react";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { Link } from "react-router-dom";
import AddEvent from "@/partials/modals/add-event/AddEvent";
import DateField from "@/components/form-inputs/DatePicker/Datefield"; 
import { getallevent, deleteeventbyid } from "@/services/apiServices";
import { showApiError, showApiResult, confirmDelete } from "@/utils/swalHelpers";

const DATE_FORMAT = "DD/MM/YYYY";
const PAGE_SIZE = 10;

const EventListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format(DATE_FORMAT));
  const [toDate, setToDate] = useState(dayjs().format(DATE_FORMAT));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [tableData, setTableData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const classes = useStyle();

  const handleModalOpen = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const confirmed = await confirmDelete(name || "this event");
    if (!confirmed) return;

    try {
      const res = await deleteeventbyid(id);
      const success = showApiResult(res, {
        successTitle: "Deleted",
        fallbackSuccess: "Event deleted successfully.",
        errorTitle: "Delete Failed",
      });
      if (success) fetchEvents();
    } catch (err) {
      showApiError(err, { title: "Delete Failed" });
    }
  };

  const mapEventRow = (item, index) => ({
    sr_no: page * PAGE_SIZE + index + 1,
    id: item.id,
    event_id: item.eventNo || "",
    event_date: item.eventStartDate || item.inquiryDate || "",
    customer: item.partyNameEnglish || "",
    event_type: item.eventNameEnglish || item.projectName || "",
    proforma_invoice: (
      <Link to={`/proforma-invoice?eventId=${item.id}`}>
        <Tooltip className="cursor-pointer" title="Proforma Invoice">
          <div className="flex justify-center items-center w-full">
            <FileText className="w-5 h-5 text-primary" />
          </div>
        </Tooltip>
      </Link>
    ),
    invoice: (
      <Link to={`/event-invoice?eventId=${item.id}`}>
        <Tooltip className="cursor-pointer" title="Invoice">
          <div className="flex justify-center items-center w-full">
            <Receipt className="w-5 h-5 text-success" />
          </div>
        </Tooltip>
      </Link>
    ),
    quotation: (
  <Link to={`/quotation/${item.id}`}>
    <Tooltip className="cursor-pointer" title="Quotation">
      <div className="flex justify-center items-center w-full">
        <BadgeDollarSign className="w-5 h-5 text-blue-600" />
      </div>
    </Tooltip>
  </Link>
),
    delete: (
      <Tooltip
        className="cursor-pointer"
        title="Delete Event"
        onClick={() =>
          handleDelete(item.id, item.eventNameEnglish || item.projectName)
        }
      >
        <div className="flex justify-center items-center w-full">
          <Trash2 className="w-5 h-5 text-danger" />
        </div>
      </Tooltip>
    ),
    handleModalOpen: handleModalOpen,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem("userId")) || null;

      const payload = {
        eventStatus: null,
        eventTypeId: null,
        // fromDate: null || fromDate ,
        FormData :null,
        page,
        partyId: null,
        priority: null,
        search: search || "",
        size: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "DESC",
        // toDate: null || toDate ,
        toDate :null , 
        userId,
        venueId: null,
      };

      const res = await getallevent(payload);
      const body = res?.data;

      if (body?.success) {
        const content = body?.data?.content || [];
        setTableData(content.map(mapEventRow));
        setTotalElements(body?.data?.totalElements || 0);
      } else {
        setTableData([]);
        setTotalElements(0);
      }
    } catch (err) {
      showApiError(err, { title: "Failed to Load Events" });
      setTableData([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, fromDate, toDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Reset to page 0 whenever filters change (not on page changes themselves)
  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, fromDate, toDate]);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 ">
       <h1 className="py-5 text-primary text-2xl">Events</h1>
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-end gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Event"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-40">
              <p className="text-[13px] font-medium text-dark mb-1">From Date</p>
              <DateField
                value={fromDate}
                onChange={(val) => setFromDate(val)}
              />
            </div>

            <div className="w-40">
              <p className="text-[13px] font-medium text-dark mb-1">To Date</p>
              <DateField
                value={toDate}
                onChange={(val) => setToDate(val)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleModalOpen}
              title="Add Event"
            >
              <i className="ki-filled ki-plus"></i> Add Event
            </button>
          </div>
        </div>


        <TableComponent
          columns={columns}
          tableData={tableData}
          loading={loading}
          paginationSize={PAGE_SIZE}
          totalElements={totalElements}
          pageIndex={page}
          onPageChange={setPage}
        />
        <AddEvent
                      isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                editData={editData}
                    />
      </Container>
    </Fragment>
  );
};
export default EventListPage;