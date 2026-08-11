import { useState } from "react";
import {
  Printer,
  BarChart3,
  FileSpreadsheet,
  MonitorPlay,
  ArrowUpRight,
} from "lucide-react";
import { AutoComplete, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import ExecutionItemsTable from "./ExecutionItemsTable";
import {
  PRODUCTION_INCHARGE_OPTIONS,
  FUNCTION_NAME_OPTIONS,
  STATUS_OPTIONS,
} from "./constant";
// import { AddDecorationModal } from "./AddDecorationModal"; // hook up when built

const ExecutionPage = () => {
  const { eventId, functionId } = useParams();

  // TODO: replace with real event summary fetch (GetEventDetails or similar);
  // static identity fields left as-is to mirror the reference screenshot.
  const event = {
    code: "JE-2024-0812",
    eventNo: "#EV-99021",
    eventName: "Grand Crimson Gala",
    partyName: "Lumina Global Corp",
    venue: "The Ritz-Carlton Atrium",
    eventDate: "Oct 24, 2024 → Oct 26, 2024",
    reference: "BK-991",
  };

  // Editable fields — from Production Incharge onward. Production Incharge
  // and Function Name use AutoComplete so the user can pick a suggestion or
  // type a new one; Setup/Dismantling use antd DatePicker with time.
  const [productionIncharge, setProductionIncharge] = useState("Sarah Jenkins");
  const [budget, setBudget] = useState("1,18,000.00");
  const [functionName, setFunctionName] = useState("Haldi Celebration");
  const [setupAt, setSetupAt] = useState(dayjs("2024-10-23T10:00"));
  const [dismantlingAt, setDismantlingAt] = useState(dayjs("2024-10-26T23:59"));
  const [status, setStatus] = useState("remaining");
  const [note, setNote] = useState(
    "Ensure heavy-duty anchors for outdoor marigold setup."
  );

  const handleAddDecoration = () => {
    // setIsAddModalOpen(true);
    console.log("open Add Decoration modal");
  };

  const handleSaveChanges = () => {
    console.log("save event execution header changes", {
      productionIncharge,
      budget,
      functionName,
      setupAt: setupAt?.toISOString(),
      dismantlingAt: dismantlingAt?.toISOString(),
      status,
      note,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
           
            <h1 className="mt-1 text-2xl font-semibold text-primary">
              Menu Execution
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <TopBarButton icon={Printer} label="Print" />
            <TopBarButton icon={BarChart3} label="Status" />
            <TopBarButton icon={FileSpreadsheet} label="Estimate" />
            <TopBarButton icon={MonitorPlay} label="Presentation" />
            <TopBarButton icon={ArrowUpRight} label="Go To" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-8xl flex-col gap-6 px-8">
        {/* Event info card */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
            {/* Static identity fields */}
            <Field label="Event No." value={event.eventNo} />
            <Field label="Event Name" value={event.eventName} />
            <Field label="Party Name" value={event.partyName} />
            <Field label="Venue" value={event.venue} />

            <Field label="Event Date" value={event.eventDate} />
            <Field label="Reference" value={event.reference} />

            {/* Editable from here on */}
            <div>
              <FieldLabel>Production Incharge</FieldLabel>
              <AutoComplete
                className="mt-1 w-full"
                value={productionIncharge}
                onChange={setProductionIncharge}
                options={PRODUCTION_INCHARGE_OPTIONS}
                placeholder="Select or type a name"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <FieldLabel>Budget</FieldLabel>
              <Input
                className="mt-1 w-full"
                prefix="₹"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Function Name</FieldLabel>
              <AutoComplete
                className="mt-1 w-full"
                value={functionName}
                onChange={setFunctionName}
                options={FUNCTION_NAME_OPTIONS}
                placeholder="Select or type a function"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
            <div>
              <FieldLabel>Setup (Date/Time)</FieldLabel>
              <DatePicker
                className="mt-1 w-full"
                showTime={{ format: "hh:mm A" }}
                format="MMM DD, YYYY hh:mm A"
                value={setupAt}
                onChange={setSetupAt}
              />
            </div>
            <div>
              <FieldLabel>Dismantling (Date/Time)</FieldLabel>
              <DatePicker
                className="mt-1 w-full"
                showTime={{ format: "hh:mm A" }}
                format="MMM DD, YYYY hh:mm A"
                value={dismantlingAt}
                onChange={setDismantlingAt}
              />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <Select
                className="mt-1 w-full"
                value={status}
                onChange={setStatus}
                options={STATUS_OPTIONS}
              />
            </div>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <div className="flex-1">
              <FieldLabel>Note</FieldLabel>
              <Input.TextArea
                className="mt-1"
                autoSize={{ minRows: 1, maxRows: 4 }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              onClick={handleSaveChanges}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* Execution items — self-contained: fetches its own data and owns
            the Manage Materials sidebar */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <ExecutionItemsTable
            eventId={eventId}
            functionId={functionId}
            onAddDecoration={handleAddDecoration}
          />
        </section>

        {/* Footer actions */}
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            Save as Draft
          </button>
          <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950">
            Finalize Plan
          </button>
        </div>
      </div>

      {/* <AddDecorationModal ... /> */}
    </div>
  );
};

const TopBarButton = ({ icon: Icon, label }) => (
  <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
    <Icon size={15} />
    {label}
  </button>
);

const FieldLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
    {children}
  </p>
);

const Field = ({ label, value }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <p className="mt-1 text-sm text-gray-800">{value}</p>
  </div>
);

export default ExecutionPage;