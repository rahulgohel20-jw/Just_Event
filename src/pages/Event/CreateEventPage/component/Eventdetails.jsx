import React, { useEffect, useState } from "react";
import { Info, Calendar, IndianRupee, MapPin, Plus } from "lucide-react";
import { Select } from "antd";
import dayjs from "dayjs";
import DateField from "../../../../components/form-inputs/DatePicker/Datefield";
import { useEventDraftStore } from "@/stores/useEventDraftStore";
import { getAllEventTypemaster, getallvenuemmmaster } from "@/services/apiServices";
import PaginatedSearchSelect from "../../../../components/form-inputs/select/PaginatedSearchSelect";
import TimeInput12h from "../../../../components/form-inputs/Time/Timeinput12h";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import AddVenuePage from "../../../Master/VenueMaster/AddVenuePage";
import { AddEventTypeModal } from "../../../Master/EventTypeMaster/AddEventTypeModal";

const STATUS_OPTIONS = [
  { value: "Inquiry", label: "Inquiry" },
  { value: "Tentative", label: "Tentative" },
  { value: "Confirmed", label: "Confirmed" },
];

export default function EventDetails({ data, onChange }) {
  const { eventType, setEventType, venue, setVenue } = useEventDraftStore();

  // Newly-created items get pushed here so PaginatedSearchSelect shows them
  // immediately, without a refetch.
  const [extraEventTypes, setExtraEventTypes] = useState([]);
  const [extraVenues, setExtraVenues] = useState([]);

  const [showAddEventType, setShowAddEventType] = useState(false);
  const [showAddVenue, setShowAddVenue] = useState(false);

  const set = (field) => (e) =>
    onChange({ [field]: e?.target ? e.target.value : e });

  useEffect(() => {
    if (!data.inquiryDate) {
      onChange({ inquiryDate: dayjs().format("DD/MM/YYYY") });
    }
    if (!data.eventStatus) {
      onChange({ eventStatus: "Inquiry" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEventTypeCreated = (created) => {
    if (!created) return;
    const option = { value: created.id, label: created.nameEnglish, ...created };
    setExtraEventTypes((prev) => [option, ...prev]);
    setEventType(option);
    setShowAddEventType(false);
  };

  const handleVenueCreated = (created) => {
    if (!created) return;
    const option = {
      value: created.id,
      label: created.nameEnglish,
      subVenues: created.subVenues || [],
    };
    setExtraVenues((prev) => [option, ...prev]);
    setVenue(option);
    setShowAddVenue(false);
  };

  return (
    <div className="space-y-8">
      {/* Basic information */}
      <section>
        <SectionHeading icon={Info} label="BASIC INFORMATION" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <DateField
            label="Inquiry Date"
            value={data.inquiryDate || ""}
            onChange={set("inquiryDate")}
            size="large"
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-dark">
                Event Type<span className="text-danger ml-0.5">*</span>
              </p>
              <button
                type="button"
                onClick={() => setShowAddEventType(true)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus size={14} /> Add New
              </button>
            </div>
            <PaginatedSearchSelect
              fetchFn={getAllEventTypemaster}
              extraParams={{ sortBy: "id", sortDirection: "DESC" }}
              labelKey="nameEnglish"
              valueKey="id"
              searchParamName="nameEnglish"
              sizeParamName="size"
              initialOption={eventType}
              extraOptions={extraEventTypes}
              value={eventType?.value}
              onChange={() => {}}
              onSelectOption={setEventType}
              placeholder="Search event type..."
              className="h-14-select"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[13px] font-medium text-dark mb-2">
              Event Status<span className="text-danger ml-0.5">*</span>
            </p>
            <Select
              value={data.eventStatus || "Inquiry"}
              onChange={(v) => onChange({ eventStatus: v })}
              options={STATUS_OPTIONS}
              placeholder="Select event status..."
              size="large"
              className="w-full h-14-select"
            />
          </div>
        </div>
      </section>

      {/* Event schedule */}
      <section>
        <SectionHeading icon={Calendar} label="EVENT SCHEDULE" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <DateField
            label="Event Start Date"
            value={data.eventStartDate || ""}
            onChange={set("eventStartDate")}
            required
          />
          <div>
            <p className="text-[13px] font-medium text-dark mb-2">
              Event Start Time<span className="text-danger ml-0.5">*</span>
            </p>
            <TimeInput12h
              value={data.eventStartTime || ""}
              onChange={(val) => onChange({ eventStartTime: val })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateField
            label="Event End Date"
            value={data.eventEndDate || ""}
            onChange={set("eventEndDate")}
            required
          />
          <div>
            <p className="text-[13px] font-medium text-dark mb-2">
              Event End Time<span className="text-danger ml-0.5">*</span>
            </p>
            <TimeInput12h
              value={data.eventEndTime || ""}
              onChange={(val) => onChange({ eventEndTime: val })}
            />
          </div>
        </div>
      </section>

      {/* Budget information */}
      <section>
        <SectionHeading icon={IndianRupee} label="BUDGET INFORMATION" />
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <Field
            icon={IndianRupee}
            placeholder="Budget Amount"
            type="number"
            value={data.budgetAmount || ""}
            onChange={set("budgetAmount")}
          />
        </div>
      </section>

      {/* Venue information */}
      <section>
        <SectionHeading icon={MapPin} label="VENUE INFORMATION" />
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-medium text-dark">
            Venue<span className="text-danger ml-0.5">*</span>
          </p>
          {/* <button
            type="button"
            onClick={() => setShowAddVenue(true)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus size={14} /> Add New
          </button> */}
        </div>
        <div className="relative mb-2">
          <PaginatedSearchSelect
            fetchFn={getallvenuemmmaster}
            extraParams={{ sortBy: "id", sortDirection: "DESC" }}
            labelKey="nameEnglish"
            valueKey="id"
            searchParamName="search"
            sizeParamName="size"
            mapOption={(r) => ({
              value: r.id,
              label: r.nameEnglish,
              subVenues: r.subVenues || [],
            })}
            initialOption={venue}
            extraOptions={extraVenues}
            value={venue?.value}
            onChange={() => {}}
            onSelectOption={setVenue}
            placeholder="Search or select a venue..."
            className="h-14-select"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[13px] font-medium text-dark mb-2">Special Instructions / Remarks</p>
            <textarea
              placeholder="Special Instructions / Remarks"
              value={data.remarks || ""}
              onChange={set("remarks")}
              rows={1}
              className="w-full bg-light border border-primary-lighter rounded-xl px-4 py-3 text-sm text-dark-active placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-lighter resize-none"
            />
          </div>
        </div>
      </section>

      {/* Add Event Type modal */}
      <AddEventTypeModal
        open={showAddEventType}
        onClose={() => setShowAddEventType(false)}
        onSave={handleEventTypeCreated}
      />

      {/* Add Venue modal */}
      <CustomModal
        open={showAddVenue}
        onClose={() => setShowAddVenue(false)}
        width={960}
        centered
        title={null}
        footer={null}
      >
        <AddVenuePage
          onClose={() => setShowAddVenue(false)}
          onSave={handleVenueCreated}
        />
      </CustomModal>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div className="flex gap-2 mb-4 pb-2 border-b border-x-primary-clarity">
      <Icon className="w-4 h-4 text-primary mt-0.3" />
      <h3 className="text-sm font-bold tracking-wide text-primary">{label}</h3>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2" />
      )}
      <input
        {...props}
        className={`w-full bg-light border border-primary-lighter rounded-xl py-3 text-sm text-dark placeholder:text-dark-clarity outline-none focus:ring-2 focus:ring-primary-clarity ${
          Icon ? "pl-9 pr-4" : "px-4"
        }`}
      />
    </div>
  );
}