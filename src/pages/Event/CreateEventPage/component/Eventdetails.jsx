import React from "react";
import { Info, Calendar, IndianRupee, MapPin } from "lucide-react";

const STATUS_OPTIONS = ["Inquiry", "Tentative", "Confirmed"];

export default function EventDetails({ data, onChange }) {
  const set = (field) => (e) =>
    onChange({ [field]: e?.target ? e.target.value : e });

  return (
    <div className="space-y-8">
      {/* Basic information */}
      <section>
        <SectionHeading icon={Info} label="BASIC INFORMATION" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* <FloatField
            placeholder="Client ID"
            value={data.clientId || ""}
            onChange={set("clientId")}
          /> */}
           <FloatField
            label="Inquiry Date"
            type="date"
            value={data.inquiryDate || ""}
            onChange={set("inquiryDate")}
          />
          <FloatField
            placeholder="Event Type"
            value={data.eventName || ""}
            onChange={set("eventName")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         
          <div>
            <p className="text-[13px] font-medium text-dark mb-2 pl-2">
              Event Status
            </p>
            <SegmentedControl
              options={STATUS_OPTIONS}
              value={data.eventStatus || "Inquiry"}
              onChange={(v) => onChange({ eventStatus: v })}
            />
          </div>
        </div>
      </section>

      {/* Event schedule */}
      <section>
        <SectionHeading icon={Calendar} label="EVENT SCHEDULE" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FloatField
            label="Event Start Date"
            type="date"
            value={data.eventStartDate || ""}
            onChange={set("eventStartDate")}
          />
          <FloatField
            label="Event Start Time"
            type="time"
            value={data.eventStartTime || ""}
            onChange={set("eventStartTime")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatField
            label="Event End Date"
            type="date"
            value={data.eventEndDate || ""}
            onChange={set("eventEndDate")}
          />
          <FloatField
            label="Event End Time"
            type="time"
            value={data.eventEndTime || ""}
            onChange={set("eventEndTime")}
          />
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
        <div className="relative mb-2">
          <select
            value={data.venue || ""}
            onChange={set("venue")}
            className="w-full appearance-none bg-light border border-primary-lighter rounded-xl px-4 py-3 text-sm text-dark outline-none focus:ring-2 focus:ring-primary-clarity"
          >
            <option value="">Search or select a venue...</option>
            <option value="grand-ballroom">Grand Ballroom, Ahmedabad</option>
            <option value="riverside-lawns">Riverside Lawns, Ahmedabad</option>
            <option value="the-pavilion">The Pavilion, Ahmedabad</option>
          </select>
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
          {/* <div>
            <p className="text-[13px] font-medium text-dark mb-2">
              Tentative Booking
            </p>
            <SegmentedControl
              options={["Yes", "No"]}
              value={data.tentativeBooking || "No"}
              onChange={(v) => onChange({ tentativeBooking: v })}
            />
          </div> */}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div className="flex gap-2 mb-4 pb-2 border-b border-x-primary-clarity" >
      <Icon className="w-4 h-4 text-primary mt-0.3" />
      <h3 className="text-sm font-bold tracking-wide text-primary">
        {label}
      </h3>
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

function FloatField({
  label,
  placeholder,
  className = "",
  ...props
}) {
  const title = label || placeholder;

  return (
    <div className="relative">
      {title && (
        <label className="absolute -top-3 left-3 bg-light px-1 text-[13px] font-medium text-dark z-5">
          {title}
        </label>
      )}

      <input
        {...props}
        placeholder={props.type === "date" ? undefined : placeholder}
        className={`w-full h-14 bg-light border placeholder:text-dark-clarity border-primary-lighter rounded-xl px-4 text-sm text-dark outline-none focus:border-primary-lighter focus:ring-0 ${className}`}
      />
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex bg-primary-inverse border border-primary-clarity rounded-xl p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            value === opt
              ? "bg-light text-primary shadow-sm"
              : "text-primary-light"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}