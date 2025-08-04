import { useState } from "react";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ContactDropdown from "@/components/dropdowns/ContactDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import EventTypeDropdown from "@/components/dropdowns/EventTypeDropdown";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import SpeechToText from "@/components/form-inputs/SpeechToText";
import useStyles from "./style";

const EventBasicInfoStep = ({ formData, setFormData, onInputChange }) => {
  const classes = useStyles();

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };

  // Example handler for plus buttons

  return (
    <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.basicInfo}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-5">
        <div className="select__grp flex flex-col">
          <label className="form-label">Customer Name</label>
          <div className="sg__inner flex items-center gap-1 relative">
            <ContactDropdown
              value={formData.customer_id}
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={handleAddClick}
              title="Add"
              className="sga__btn me-1.5 btn btn-success flex items-center justify-center rounded-full p-0 w-8 h-8"
            >
              <i className="ki-filled ki-plus"></i>
            </button>
          </div>
        </div>
        <div className="select__grp flex flex-col">
          <label className="form-label">Manager</label>
          <div className="sg__inner flex items-center gap-1 relative">
            <UserDropdown
              value={formData.manager_id}
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={() => handleAddClick("Manager")}
              title="Add"
              className="sga__btn me-1.5 btn btn-success flex items-center justify-center rounded-full p-0 w-8 h-8"
            >
              <i className="ki-filled ki-plus"></i>
            </button>
          </div>
        </div>
        <div className="select__grp flex flex-col">
          <label className="form-label">Venue</label>
          <SpeechToText
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={onInputChange}
          />
        </div>
        <div className="select__grp flex flex-col">
          <label className="form-label">Event Name</label>
          <EventTypeDropdown
            value={formData.event_type}
            onChange={onInputChange}
          />
        </div>
        <div className="select__grp flex flex-col">
          <label className="form-label">Enquiry Date</label>
          <DatePicker
            date={formData.meeting_date}
            className="input border-2 border-primary rounded-lg"
            setDate={(date) => setFormData({ ...formData, meeting_date: date })}
            defaultValue={formData.meeting_date ? dayjs(formData.meeting_date) : null} // Show selected value
          />
        </div>

        {/* Event Date */}
        <div className="flex flex-col">
          <label className="form-label">Event Date</label>
          <DatePicker
            className="input border-2 border-primary rounded-lg"
            date={formData.event_date}
            setDate={(date) => setFormData({ ...formData, event_date: date })}
            defaultValue={formData.event_date ? dayjs(formData.event_date) : null} // Show selected value
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="form-label">Status</label>
          <EventStatusDropdown
            value={formData.status}
            className="w-full border-2 border-primary rounded-lg"
            onChange={onInputChange}
          />
        </div>
      </div>
      {/* Modal */}
      <AddCustomer
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
    </div>
  );
};

export default EventBasicInfoStep;
