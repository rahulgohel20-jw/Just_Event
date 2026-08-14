import React, { useState } from "react";
import {
  MessageSquareText,
  Info,
  Copy,
  Printer,
  Save,
  MonitorUp,
  Layers2,
} from "lucide-react";
import { Select } from "antd";
import LayoutModel from "../models/LayoutModel"
import PresentationModel from "../models/PresentationModel";
import ChatBoxModel from "../models/ChatBoxModel";
import InfoModel from "../models/InfoModel";
import PrintModel from "../models/PrintModel";

const OPTIONS = [
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
]


export default function NewEstimate({
  eventData,
  loading,
  estimateDate,
  onEstimateDateChange,
  statusType,
  onStatusTypeChange,
  selectedFunctionId,
  onFunctionChange,
  onSave,
}) {
  const [openLayoutModal, setOpenLayoutModal] = useState(false);
  const [presentationModal, setPresentationModal] = useState(false);
  const [chatBoxModel, setChatBoxModel] = useState(false);
  const [infoModel, setInfoModel] = useState(false);
  const [printModel, setPrintModel] = useState(false);

 const functionOptions =
  eventData?.eventFunctions?.map((f) => ({
    value: f.id,
    label: f.nameEnglish,
  })) ?? [];

  const actionItems = [
    {
      label: "LAYOUT",
      icon: Layers2,
      onClick: () => setOpenLayoutModal(true),
    },
    {
      label: "PRESENTATION",
      icon: MonitorUp,
      onClick: () => setPresentationModal(true),
    },
    {
      label: "CHATBOX",
      icon: MessageSquareText,
      onClick: () => setChatBoxModel(true),
    },
    {
      label: "INFO",
      icon: Info,
      onClick: () => setInfoModel(true),
    },
    {
      label: "CLONE",
      icon: Copy,
      onClick: () => console.log("Clone"),
    },
    {
      label: "PRINT",
      icon: Printer,
      onClick: () => setPrintModel(true),
    },
    {
      label: "SAVE",
      icon: Save,
      onClick: onSave,
    },
  ];

  return (
    <div className="m-0 p-0">
      <div className="mx-auto rounded-lg border bg-white p-4 md:p-6 shadow-sm">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-primary">
            New Estimate
          </h2>

          <p className="mt-2 text-gray-500">
            Configure event logistics and client information for the quotation.
          </p>
        </div>

        {/* Main Layout */}
        <div className={loading ? "pointer-events-none opacity-50" : ""}>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <Input label="EVENT NO" value={eventData?.eventNo} />
            </div>

            <div className="col-span-2">
              <Input
  label="EVENT NAME"
  value={eventData?.eventNameEnglish}
  placeholder="e.g. Royal Grand Wedding Gala"
/>
            </div>

           <Input
  label="PARTY NAME"
  value={eventData?.partyNameEnglish}
  placeholder="Client or Organization"
/>

            <Input
  label="VENUE"
  value={eventData?.venueNameEnglish}
  placeholder="Location Name"
/>

            <Input
              label="ESTIMATE DATE"
              type="date"
              value={estimateDate}
              onChange={(e) => onEstimateDateChange(e.target.value)}
            />

            <SelectInput
              label="APPROVAL"
              options={OPTIONS}
              value={statusType}
              onChange={onStatusTypeChange}
            />

            <div className="col-span-2 flex justify-evenly self-end pt-3">
              {actionItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="group flex flex-col items-center rounded-xl p-2 transition hover:bg-primary/5"
                  >
                    <Icon
                      size={22}
                      className="text-primary transition group-hover:scale-110"
                    />

                    <span className="mt-2 text-[10px] font-bold text-gray-800">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <SelectInput
              label="FUNCTION NAME"
              className="sm:col-span-2 lg:col-span-1"
              options={functionOptions}
              value={selectedFunctionId}
              onChange={onFunctionChange}
            />

            <div className="col-span-2 flex gap-5 self-end m-0">
              <button className="rounded-2xl bg-primary py-4 h-max text-sm font-semibold text-light hover:opacity-90 w-full">
                Event Execution
              </button>

              <button className="rounded-2xl bg-primary  py-4 h-max  text-sm font-semibold text-light hover:opacity-90 w-full">
                Other Estimate
              </button>
            </div>
          </div>
        </div>
      </div>

      <LayoutModel
        open={openLayoutModal}
        onClose={() => setOpenLayoutModal(false)}
      />

      <PresentationModel
        open={presentationModal}
        onClose={() => setPresentationModal(false)}
      />
      <ChatBoxModel
        open={chatBoxModel}
        onClose={() => setChatBoxModel(false)} />

      <InfoModel
        open={infoModel}
        onClose={() => setInfoModel(false)} />
      <PrintModel
        open={printModel}
        onClose={() => setPrintModel(false)} />

    </div>
  );
}

/* ---------------- Components ---------------- */

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        readOnly={!onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border placeholder:text-gray-700 text-dark border-primary-clarity px-4 text-sm outline-none transition focus:border-primary"
      />
    </div>
  );
}

function SelectInput({ label, className = "", options = OPTIONS, value, onChange }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </label>

      <Select
        placeholder="Select"
        className="w-full"
        size="large"
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}