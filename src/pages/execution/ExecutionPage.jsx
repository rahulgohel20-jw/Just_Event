import { useEffect, useState } from "react";
import {
  Printer,
  BarChart3,
  FileSpreadsheet,
  MonitorPlay,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { AutoComplete, DatePicker, Input, Select } from "antd";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "react-router-dom";
import ExecutionItemsTable from "./ExecutionItemsTable";
import {
  PRODUCTION_INCHARGE_OPTIONS,
  STATUS_OPTIONS,
} from "./constant";
import { getbyeventid, GetAllEventExecution, AddEventExecution } from "../../services/apiServices";
// import { AddDecorationModal } from "./AddDecorationModal"; // hook up when built

const toId = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

// ASSUMPTION: execution list rows come back shaped like this. Adjust field
// names once a real GetAllEventExecution response is available.
const mapExecutionItems = (list = []) =>
  list.map((item, idx) => ({
    id: item.id,
    srNo: String(idx + 1).padStart(2, "0"),
    name: item.name ?? item.itemName ?? "Item",
    description: item.description ?? "",
    size: item.size ?? "",
    qty: Number(item.qty || 0),
    images: (item.images ?? []).map((img) => img.url ?? img),
    materials: item.materials ?? [],
    materialsCount: (item.materials ?? []).length,
  }));

const ExecutionPage = () => {
  const { eventId: routeEventId, functionId: routeFunctionId } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = routeEventId ?? searchParams.get("eventId");
  const userId = localStorage.getItem("userId");

  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [selectedFunctionId, setSelectedFunctionId] = useState(
    toId(routeFunctionId ?? searchParams.get("functionId"))
  );

  const [tableData, setTableData] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [executionRecordId, setExecutionRecordId] = useState(null); // id of the saved execution record for this function, if any

  // Editable header fields — kept local for now (no dedicated save endpoint
  // for these was provided; they get bundled into the AddEventExecution
  // payload on Save).
  const [productionIncharge, setProductionIncharge] = useState("");
  const [budget, setBudget] = useState("");
  const [setupAt, setSetupAt] = useState(null);
  const [dismantlingAt, setDismantlingAt] = useState(null);
  const [status, setStatus] = useState("remaining");
  const [note, setNote] = useState("");

  /* ---- Load event + its functions (mirrors QuotationPage) ---- */
  useEffect(() => {
    if (!eventId) {
      Swal.fire({ icon: "warning", title: "No event selected" });
      setLoadingEvent(false);
      return;
    }
    setLoadingEvent(true);
    getbyeventid(eventId)
      .then((res) => {
        const body = res?.data ?? res;
        const data = body?.data ?? body;
        setEventData(data);

        // default to first function if none selected via route/query
        if (selectedFunctionId == null && data?.eventFunctions?.length) {
          setSelectedFunctionId(toId(data.eventFunctions[0].id));
        }
      })
      .catch(() => Swal.fire({ icon: "error", title: "Failed to load event details" }))
      .finally(() => setLoadingEvent(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const functionOptions =
    eventData?.eventFunctions?.map((f) => ({ value: toId(f.id), label: f.nameEnglish })) ?? [];

  /* ---- Fetch execution items whenever the selected function changes ---- */
  const fetchExecutionList = () => {
    if (!eventId || selectedFunctionId == null) return Promise.resolve();
    setLoadingItems(true);
    return GetAllEventExecution({
      eventId: Number(eventId),
      eventFunctionId: null,
      page: 0,
      size: 100, // ASSUMPTION: no pagination in the UI yet, pull a large page
      sortBy: "id",
      sortDirection: "ASC",
      userId: Number(userId),
    })
      .then((res) => {
        const body = res?.data ?? res;
        const page = body?.data ?? body;
        const content = page?.content ?? [];
        const record = content[0]; // ASSUMPTION: one execution record per function, holding an items[] array

        setExecutionRecordId(record?.id ?? null);
        setTableData(mapExecutionItems(record?.items ?? []));

        // ASSUMPTION: header fields live on the same record
        if (record) {
          setProductionIncharge(record.productionIncharge ?? "");
          setBudget(record.budget ?? "");
          setSetupAt(record.setupAt ? dayjs(record.setupAt) : null);
          setDismantlingAt(record.dismantlingAt ? dayjs(record.dismantlingAt) : null);
          setStatus(record.status ?? "remaining");
          setNote(record.note ?? "");
        } else {
          setProductionIncharge("");
          setBudget("");
          setSetupAt(null);
          setDismantlingAt(null);
          setStatus("remaining");
          setNote("");
        }
      })
      .catch((err) => {
        console.error("Failed to load execution list:", err);
        setTableData([]);
        setExecutionRecordId(null);
      })
      .finally(() => setLoadingItems(false));
  };

  useEffect(() => {
    fetchExecutionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, selectedFunctionId]);

  const handleFunctionChange = (val) => setSelectedFunctionId(toId(val));

  const handleAddDecoration = () => {
    // setIsAddModalOpen(true);
    console.log("open Add Decoration modal");
  };

  /* ---- SAVE: single endpoint for create/update, multipart like AddEstimate ---- */
  const handleSaveChanges = async () => {
    if (!eventId || selectedFunctionId == null) {
      Swal.fire({ icon: "warning", title: "Select a function first" });
      return;
    }

    const payload = {
      id: executionRecordId ?? 0,
      eventId: Number(eventId),
      eventFunctionId: selectedFunctionId,
      productionIncharge,
      budget,
      setupAt: setupAt ? setupAt.toISOString() : null,
      dismantlingAt: dismantlingAt ? dismantlingAt.toISOString() : null,
      status,
      note,
      userId: Number(userId),
      items: tableData.map((item) => ({
        id: typeof item.id === "number" && item.id < 1e10 ? item.id : 0,
        name: item.name,
        description: item.description,
        size: item.size,
        qty: Number(item.qty || 0),
        materials: item.materials ?? [],
      })),
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    // Attach any newly-picked image files (local blob previews carry a
    // hidden `file` reference set in ImagesCell — see ExecutionItemsTable note)
    tableData.forEach((item, itemIndex) => {
      (item.imageFiles ?? []).forEach((file) => {
        formData.append(`items[${itemIndex}].images`, file);
      });
    });

    setSaving(true);
    try {
      const res = await AddEventExecution(formData);
      const body = res?.data ?? res;
      const data = body?.data ?? body;
      setExecutionRecordId(data?.id ?? executionRecordId);
      await fetchExecutionList();
      Swal.fire({ icon: "success", title: "Execution plan saved", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Failed to save execution plan:", err);
      Swal.fire({ icon: "error", title: "Failed to save execution plan" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-primary">Menu Execution</h1>
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
        <section className={`rounded-2xl border border-gray-100 bg-white p-6 ${loadingEvent ? "pointer-events-none opacity-50" : ""}`}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
            {/* Static identity fields — from real event data now */}
            <Field label="Event No." value={eventData?.eventNo} />
            <Field label="Event Name" value={eventData?.eventNameEnglish} />
            <Field label="Party Name" value={eventData?.partyNameEnglish} />
            <Field label="Venue" value={eventData?.venueNameEnglish} />

            <div>
              <FieldLabel>Function Name</FieldLabel>
              <Select
                className="mt-1 w-full"
                placeholder="Select function"
                options={functionOptions}
                value={selectedFunctionId ?? undefined}
                onChange={handleFunctionChange}
              />
            </div>
            <Field
              label="Event Date"
              value={
                eventData?.eventStartDate
                  ? `${eventData.eventStartDate} → ${eventData.eventEndDate ?? eventData.eventStartDate}`
                  : "—"
              }
            />

            {/* Editable */}
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
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950 disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* Execution items */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <ExecutionItemsTable
            eventId={eventId}
            functionId={selectedFunctionId}
            items={tableData}
            setItems={setTableData}
            loading={loadingItems}
            onAddDecoration={handleAddDecoration}
          />
        </section>

        {/* Footer actions */}
        <div className="flex justify-end gap-3">
          <button className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            Save as Draft
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950 disabled:opacity-60"
          >
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
  <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{children}</p>
);

const Field = ({ label, value }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <p className="mt-1 text-sm text-gray-800">{value ?? "—"}</p>
  </div>
);

export default ExecutionPage;