import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Button, Row, Col, Select } from "antd";
import { Link } from "react-router-dom";

const EventViewModal = ({ isModalOpen, setIsModalOpen, eventData }) => {
  let eventDataAll = eventData?.event?._def?.extendedProps;
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="View Event Details"
        width={720}
        footer={[
          <div
            className="flex items-center justify-between"
            key={"footer-buttons"}
          >
            <button key="cancel" className="btn btn-danger" title="Delete">
              Delete
            </button>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Close"
            >
              Close
            </button>
          </div>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          <div class="flex flex-col gap-3 lg:gap-4 grow">
            <div class="flex flex-col">
              <p className="text-gray-700">Name:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData?.event?._def?.title}
              </h4>
            </div>
            <div class="flex flex-col">
              <p className="text-gray-700">Address:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.address}
              </h4>
            </div>
          </div>
          <div class="flex flex-col gap-3 lg:gap-4 grow">
            <div class="flex flex-col">
              <p className="text-gray-700">Date:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventData.event.start.toLocaleDateString("en-CA")}
              </h4>
            </div>
            <div class="flex flex-col">
              <p className="text-gray-700">Mobile:</p>
              <h4 className="text-gray-900 font-semibold">
                {eventDataAll?.mobile}
              </h4>
            </div>
          </div>
        </div>
        <hr className="my-5" />
        <div className="flex items-center justify-center gap-2 grow">
          <label className="form-label w-auto">Status:</label>
          <button
            className="badge badge-outline badge-info rounded-full badge-lg"
            title="Inquiry"
          >
            Inquiry
          </button>
          <button
            className="badge badge-outline badge-success rounded-full badge-lg"
            title="Completed"
          >
            Completed
          </button>
          <button
            className="badge badge-outline badge-warning rounded-full badge-lg"
            title="Pending"
          >
            Pending
          </button>
        </div>
        <hr className="my-5" />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Link to="/menu-preparation">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Preparation"
            >
              Menu Preparation
            </button>
            </Link>
            
            <Link to="/menu-allocation">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Menu Allocation"
            >
              Menu Allocation
            </button>
            </Link>
            <Link to="/raw-material-allocation">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Raw Material Allocation"
            >
              Raw Material Allocation
            </button>
            </Link>
            <Link to="/labour-and-other-management">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Labour/Other Management"
            >
              Labour/Other Management
            </button>
            </Link>
            <Link to="/order-booking-reports">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Order Booking Reports"
            >
              Order Booking Reports
            </button>
            </Link>
            <Link to="/dish-costing">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Dish Costing"
            >
              Dish Costing
            </button>
            </Link>
            <Link to="/quotation">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Quotation"
            >
              Quotation
            </button>
            </Link>
            <Link to="/event-invoice">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Invoice"
            >
              Invoice
            </button>
            </Link>
            <Link to="/proforma-invoice">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Proforma Invoice"
            >
              Proforma Invoice
            </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Link to="/add-event">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Edit"
            >
              <i className="ki-filled ki-notepad-edit"></i> Edit
            </button>
            </Link>
            <Link to="">
            <button
              className="btn btn-sm btn-primary justify-center w-full"
              title="Copy Order"
            >
              <i className="ki-filled ki-copy"></i> Copy Order
            </button>
            </Link>
          </div>
        </div>
      </CustomModal>
    )
  );
};
export default EventViewModal;
