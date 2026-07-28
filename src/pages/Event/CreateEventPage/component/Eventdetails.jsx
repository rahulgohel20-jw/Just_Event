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
          <FloatField
            placeholder="Client ID"
            value={data.clientId || ""}
            onChange={set("clientId")}
          />
          <FloatField
            placeholder="Event Name"
            value={data.eventName || ""}
            onChange={set("eventName")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatField
            label="Inquiry Date"
            type="date"
            value={data.inquiryDate || ""}
            onChange={set("inquiryDate")}
          />
          <div>
            <p className="text-xs font-medium text-rose-900 mb-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            icon={IndianRupee}
            placeholder="Budget Amount"
            type="number"
            value={data.budgetAmount || ""}
            onChange={set("budgetAmount")}
          />
          <Field
            icon={IndianRupee}
            placeholder="Advance Received"
            type="number"
            value={data.advanceReceived || ""}
            onChange={set("advanceReceived")}
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
            className="w-full appearance-none bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">Search or select a venue...</option>
            <option value="grand-ballroom">Grand Ballroom, Ahmedabad</option>
            <option value="riverside-lawns">Riverside Lawns, Ahmedabad</option>
            <option value="the-pavilion">The Pavilion, Ahmedabad</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium mb-6">
          <button
            type="button"
            className="text-rose-700 hover:text-rose-900"
          >
            + Add New Venue
          </button>
          <button
            type="button"
            className="text-rose-400 hover:text-rose-600"
          >
            − Remove New Venue
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <textarea
            placeholder="Special Instructions / Remarks"
            value={data.remarks || ""}
            onChange={set("remarks")}
            rows={4}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200 resize-none"
          />
          <div>
            <p className="text-xs font-medium text-rose-900 mb-2">
              Tentative Booking
            </p>
            <SegmentedControl
              options={["Yes", "No"]}
              value={data.tentativeBooking || "No"}
              onChange={(v) => onChange({ tentativeBooking: v })}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-rose-100">
      <Icon className="w-4 h-4 text-rose-800" />
      <h3 className="text-xs font-bold tracking-wide text-rose-900">
        {label}
      </h3>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
      )}
      <input
        {...props}
        className={`w-full bg-white border border-rose-100 rounded-xl py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200 ${
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
        <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-medium text-rose-400 z-10">
          {title}
        </label>
      )}

      <input
        {...props}
        placeholder={props.type === "date" ? undefined : placeholder}
        className={`w-full h-14 bg-white border border-rose-200 rounded-xl px-4 text-sm text-rose-900 outline-none focus:border-rose-400 focus:ring-0 ${className}`}
      />
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex bg-rose-50/60 border border-rose-100 rounded-xl p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            value === opt
              ? "bg-white text-rose-900 shadow-sm"
              : "text-rose-400 hover:text-rose-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}