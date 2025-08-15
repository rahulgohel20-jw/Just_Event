import { useState } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import ContactDropdown from "@/components/dropdowns/ContactDropdown";
import EventStatusDropdown from "@/components/dropdowns/EventStatusDropdown";
import EventTypeDropdown from "@/components/dropdowns/EventTypeDropdown";
import AddCustomer from "@/partials/modals/add-customer/AddCustomer";
import SpeechToText from "@/components/form-inputs/SpeechToText";
import useStyles from "./style";

const EventDetailsStep = ({ formData, setFormData, onInputChange }) => {
    const [dateOfBirth, setDateOfBirth] = useState(null);
  const classes = useStyles();
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };

  return (
    <div className={`flex flex-col gap-6 ${classes.basicInfo}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="form-label text-black">Client Id</label>
          <div className="input">

          <i className="ki-filled ki-sms text-[#97654D]"></i>
          <input
            className="h-full"
                      type="text"
                      placeholder="Client Id"
            // value={formData.client_id || ""}
            // onChange={onInputChange}
          />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label text-black">Inquiry Date :</label>
          
          <DatePicker
            className="input border rounded-lg"
            date={dateOfBirth} setDate={setDateOfBirth}
            value={formData.meeting_date ? dayjs(formData.meeting_date) : null}
            onChange={(date, dateString) =>
              setFormData({ ...formData, meeting_date: dateString })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="form-label text-black">Status :</label>
          <EventStatusDropdown
            value={formData.status}
            className="w-full border rounded-lg"
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="select__grp flex flex-col">
          <label className="form-label text-black">Event Name :</label>
          <div className="sg__inner flex items-center gap-1 relative">
            <EventTypeDropdown
              value={formData.event_type}
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={handleAddClick}
              title="Add"
              className="sga__btn me-1.5 w-5 h-5 bg-[#A57353]   text-white flex items-center justify-center rounded-full p-0 w-8 h-8"
            >
              <i className="ki-filled ki-plus "></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="form-label text-black">
            Event Budget (Approx) :
          </label>
          <div className="input">

          <i className="ki-filled ki-wallet text-[#97654D]"></i>
          <input
            type="number"
            name="budget"
            
            value={formData.budget || ""}
            onChange={onInputChange}
            placeholder="Event Budget"
          />
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="form-label text-black">Event Date :</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            className="input border rounded-lg"
            placeholder="Start Date"
            value={
              formData.event_start_date
                ? dayjs(formData.event_start_date)
                : null
            }
            onChange={(date, dateString) =>
              setFormData({ ...formData, event_start_date: dateString })
            }
          />
          <DatePicker
            className="input border rounded-lg"
            placeholder="End Date"
            value={
              formData.event_end_date ? dayjs(formData.event_end_date) : null
            }
            onChange={(date, dateString) =>
              setFormData({ ...formData, event_end_date: dateString })
            }
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="form-label text-black">Event Time :</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TimePicker
            className="input border rounded-lg w-full"
            format="HH:mm"
            placeholder="Start Time"
            value={
              formData.start_time ? dayjs(formData.start_time, "HH:mm") : null
            }
            onChange={(time, timeString) =>
              setFormData({ ...formData, start_time: timeString })
            }
          />
          <TimePicker
            className="input border rounded-lg w-full"
            format="HH:mm"
            placeholder="End Time"
            value={formData.end_time ? dayjs(formData.end_time, "HH:mm") : null}
            onChange={(time, timeString) =>
              setFormData({ ...formData, end_time: timeString })
            }
          />
        </div>
      </div>

      <div className="flex flex-col w-10/12">
        <label className="form-label text-black">Venue Name :</label>
        <div className="flex flex-row gap-4">
          <div className="input">

          <i className="ki-filled ki-bank text-[#97654D]"></i>
          <input
            
            type="text"
            name="Venue_name"
            placeholder="Venue Name"
            value={formData.Venue_name || ""}
            onChange={onInputChange}
          />
          </div>
          <div className="relative w-60">
            <input
              type="text"
              name="add_venue"
              className="textarea w-full pr-10"
              placeholder="Add Venue"
              value={formData.add_venue || ""}
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={handleAddClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#A57353] text-white flex items-center justify-center text-xs"
            >
              <i className="ki-filled ki-plus leading-none"></i>
            </button>
          </div>

          <div className="relative w-60">
            <input
              type="text"
              name="remove_venue"
              className="textarea w-full pr-10"
              placeholder="Remove Venue"
              value={formData.remove_venue || ""}
              onChange={onInputChange}
            />
            <button
              type="button"
              onClick={handleAddClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#A57353] text-white flex items-center justify-center text-xs"
            >
              <i className="ki-filled ki-plus leading-none"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        <div className="flex flex-col">
          <label className="form-label text-black">Notes :</label>
          <div className="input">

          <i className="ki-filled ki-note text-[#97654D]"></i>
          <input
            type="text"
            name="notes"
            
            placeholder="Notes"
            value={formData.notes || ""}
            onChange={onInputChange}
          />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6">
          <label className="form-label w-auto">Tentative Booking :</label>
          <label className="flex items-center gap-1 text-black">
            <input
              type="radio"
              name="tentative_booking"
              value="yes"
              checked={formData.tentative_booking === "yes"}
              onChange={onInputChange}
            />
            Yes
          </label>
          <label className="flex items-center gap-1 text-black">
            <input
              type="radio"
              name="tentative_booking"
              value="no"
              checked={formData.tentative_booking === "no"}
              onChange={onInputChange}
            />
            No
          </label>
        </div>
      </div>

      <AddCustomer
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
    </div>
  );
};

export default EventDetailsStep;
