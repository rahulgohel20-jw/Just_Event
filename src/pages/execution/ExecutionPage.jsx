import { useEffect, useRef, useState } from "react";
import {
  Printer,
  BarChart3,
  FileSpreadsheet,
  MonitorPlay,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { AutoComplete, Input, Select, Spin } from "antd";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useParams, useSearchParams } from "react-router-dom";
import ExecutionItemsTable from "./ExecutionItemsTable";
import {
  STATUS_OPTIONS,
  MATERIAL_OPTIONS,
} from "./constant";
import {
  getbyeventid,
  GetEventExecutionFunction,
  AddEventExecution,
  getalluser,
} from "../../services/apiServices";
import DateTimeField from "../../components/form-inputs/DatePicker/DateTimeField";
// import { AddDecorationModal } from "./AddDecorationModal"; // hook up when built

dayjs.extend(customParseFormat);

const DATE_TIME_FORMAT = "DD/MM/YYYY hh:mm A";

const toId = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

// Any client-side temp id (e.g. Date.now() used for newly-added rows before
// save) is a huge number — treat anything that large as "not a real id" so
// it never gets sent to the server as if it were one. Used for item.id,
// item.estimateItemId, and item.menuItemId alike, since all three are
// server-assigned ids that a locally-created item won't actually have yet.
const sanitizeServerId = (v) =>
  typeof v === "number" && Number.isFinite(v) && v < 1e10 ? v : null;

// Maps the real API item shape 1:1 into what the table columns read.
const mapExecutionItems = (list = []) =>
  list.map((item, idx) => ({
    id: item.id ?? null,
    estimateItemId: item.estimateItemId ?? null,
    menuItemId: item.menuItemId ?? null,
    srNo: String(idx + 1).padStart(2, "0"),
    particularName: item.particularName ?? "Item",
    particularDescription: item.particularDescription ?? "",
    elementsAndMaterials: item.elementsAndMaterials ?? "",
    size: item.size ?? "",
    qty: Number(item.qty || 0),
    images: (item.images ?? []).map((img) => img.url ?? img),
    imageFiles: [], // freshly-picked File objects staged for upload on save
    materials: item.materials ?? [],
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
  const [executionRecordId, setExecutionRecordId] = useState(null);

  // Header fields — now matching the real payload keys.
  const [productionInchargeId, setProductionInchargeId] = useState(null);
  const [productionInchargeName, setProductionInchargeName] = useState("");
  const [budget, setBudget] = useState("");
  const [reference, setReference] = useState("");
  // NOTE: these are now plain "DD/MM/YYYY hh:mm A" strings (DateTimeField's format),
  // not dayjs objects — see fetchExecutionList (load) and handleSaveChanges (save).
  const [setupDateTime, setSetupDateTime] = useState("");
  const [dismantleDateTime, setDismantleDateTime] = useState("");
  const [status, setStatus] = useState("REMAINING");
  const [note, setNote] = useState("");

  // Production Incharge — async search against /users/list, same request
  // shape as UserMaster.jsx's fetchUserList (userType: "MEMBER", isActive:
  // true, isBlock: false, etc.), instead of the old static options list.
  const [inchargeOptions, setInchargeOptions] = useState([]);
  const [inchargeSearching, setInchargeSearching] = useState(false);
  const [inchargeHasLoadedOnce, setInchargeHasLoadedOnce] = useState(false);
  const inchargeDebounceRef = useRef(null);

  const inchargeDisplayName = (user) =>
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email ||
    user.companyName ||
    `User #${user.id}`;

  const fetchInchargeOptions = async (query) => {
    setInchargeSearching(true);
    try {
      const res = await getalluser({
        cityId: null,
        clientId: null,
        companyName: "",
        countryId: null,
        isActive: true,
        isBlock: false,
        page: 0,
        roleId: null,
        search: query || "",
        size: 20,
        sortBy: "id",
        sortDirection: "DESC",
        stateId: null,
        userType: "MEMBER",
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? [];
      setInchargeOptions(
        content.map((user) => ({ value: String(user.id), label: inchargeDisplayName(user) }))
      );
      setInchargeHasLoadedOnce(true);
    } catch (err) {
      console.error("Failed to fetch production incharge list:", err);
      setInchargeOptions([]);
    } finally {
      setInchargeSearching(false);
    }
  };

  const handleInchargeSearch = (text) => {
    setProductionInchargeName(text);
    // Free-typed text no longer matches a picked user until they select
    // an option again, so drop the stale id rather than saving a mismatch.
    setProductionInchargeId(null);
    if (inchargeDebounceRef.current) clearTimeout(inchargeDebounceRef.current);
    inchargeDebounceRef.current = setTimeout(() => fetchInchargeOptions(text), 300);
  };

  const handleInchargeFocus = () => {
    if (!inchargeHasLoadedOnce && !inchargeSearching) fetchInchargeOptions(productionInchargeName);
  };

  const handleInchargeSelect = (value, option) => {
    setProductionInchargeId(toId(value));
    setProductionInchargeName(option.label);
  };


  /* ---- Load event + its functions ---- */
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

  const resetExecutionState = () => {
    setExecutionRecordId(null);
    setTableData([]);
    setProductionInchargeId(null);
    setProductionInchargeName("");
    setBudget("");
    setReference("");
    setSetupDateTime("");
    setDismantleDateTime("");
    setStatus("REMAINING");
    setNote("");
  };

  /* ---- Fetch execution record for the currently selected function ---- */
  const fetchExecutionList = () => {
    if (selectedFunctionId == null) return Promise.resolve();
    setLoadingItems(true);
    return GetEventExecutionFunction(selectedFunctionId)
      .then((res) => {
        const body = res?.data ?? res;
        const record = body?.data ?? body;

        if (!record) {
          resetExecutionState();
          return;
        }

        setExecutionRecordId(record.id ?? null);
        setTableData(mapExecutionItems(record.items ?? []));

        setProductionInchargeId(record.productionInchargeId ?? null);
        setProductionInchargeName(record.productionInchargeName ?? "");
        setBudget(record.budgetAmount ?? "");
        setReference(record.reference ?? "");
        // Server sends ISO — convert to the DD/MM/YYYY hh:mm A string DateTimeField expects.
        setSetupDateTime(
  record.setupDateTime
    ? dayjs(record.setupDateTime, DATE_TIME_FORMAT, true).isValid()
      ? record.setupDateTime
      : dayjs(record.setupDateTime).format(DATE_TIME_FORMAT) // fallback if server still sends ISO
    : ""
);
setDismantleDateTime(
  record.dismantleDateTime
    ? dayjs(record.dismantleDateTime, DATE_TIME_FORMAT, true).isValid()
      ? record.dismantleDateTime
      : dayjs(record.dismantleDateTime).format(DATE_TIME_FORMAT)
    : ""
);
        setStatus(record.status ?? "remaining");
        setNote(record.note ?? "");
      })
      .catch((err) => {
        console.error("Failed to load execution record:", err);
        resetExecutionState();
      })
      .finally(() => setLoadingItems(false));
  };

  useEffect(() => {
    fetchExecutionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFunctionId]);

  const handleFunctionChange = (val) => setSelectedFunctionId(toId(val));

  const handleAddDecoration = () => {
    console.log("open Add Decoration modal");
  };

 // Helper: validate a DateTimeField string, return it in DD/MM/YYYY hh:mm A format (or null if empty/invalid).
const toDateTimeString = (str) => {
  if (!str) return null;
  const parsed = dayjs(str, DATE_TIME_FORMAT, true);
  return parsed.isValid() ? parsed.format(DATE_TIME_FORMAT) : null;
};

  /* ---- SAVE: multipart FormData matching the exact swagger field list ---- */
  const handleSaveChanges = async () => {
    if (!eventId || selectedFunctionId == null) {
      Swal.fire({ icon: "warning", title: "Select a function first" });
      return;
    }


    const appendIfNotNull = (formData, key, value) => {
  if (value !== null && value !== undefined && value !== "") {
    formData.append(key, value);
  }
};

   const dto = {
  id: executionRecordId ?? null,
  eventId: Number(eventId),
  eventFunctionId: selectedFunctionId,
  budget: budget === "" ? null : Number(budget),
  productionInchargeId: productionInchargeId != null ? Number(productionInchargeId) : null,
  reference: reference || null,
  setupDateTime: toDateTimeString(setupDateTime),
  dismantleDateTime: toDateTimeString(dismantleDateTime),
  status: status || null,
  note: note || null,
  userId: Number(userId),
  items: tableData.map((item) => ({
  // Real DB id, or null for a not-yet-saved row.
  id: sanitizeServerId(item.id),
  // Only a genuine estimate-item id gets through — an item added directly
  // from Execution (not sourced from an estimate) has no real estimateItemId,
  // so this must resolve to null rather than leaking a client-side temp id.
  estimateItemId: sanitizeServerId(item.estimateItemId),
  menuItemId: sanitizeServerId(item.menuItemId),
  particularName: item.particularName,
  particularDescription: item.particularDescription,
  elementsAndMaterials: item.elementsAndMaterials,
  size: item.size,
  qty: Number(item.qty || 0),
})),
};

    const formData = new FormData();

formData.append("eventId", dto.eventId);
formData.append("eventFunctionId", dto.eventFunctionId);

appendIfNotNull(formData, "id", dto.id);
appendIfNotNull(formData, "budget", dto.budget);
appendIfNotNull(formData, "productionInchargeId", dto.productionInchargeId);
appendIfNotNull(formData, "reference", dto.reference);
appendIfNotNull(formData, "setupDateTime", dto.setupDateTime);
appendIfNotNull(formData, "dismantleDateTime", dto.dismantleDateTime);
appendIfNotNull(formData, "status", dto.status);
appendIfNotNull(formData, "note", dto.note);

formData.append("userId", dto.userId);

    // Per-item fields, indexed as items[i].fieldName
    dto.items.forEach((item, i) => {
  // dto.items already ran id/estimateItemId/menuItemId through
  // sanitizeServerId above, so these are either a real server id or null —
  // no separate temp-id check needed here anymore.
  appendIfNotNull(formData, `items[${i}].id`, item.id);
  appendIfNotNull(formData, `items[${i}].estimateItemId`, item.estimateItemId);
  appendIfNotNull(formData, `items[${i}].menuItemId`, item.menuItemId);

  formData.append(
    `items[${i}].particularName`,
    item.particularName ?? ""
  );

  formData.append(
    `items[${i}].particularDescription`,
    item.particularDescription ?? ""
  );

  formData.append(
    `items[${i}].elementsAndMaterials`,
    item.elementsAndMaterials ?? ""
  );

  formData.append(
    `items[${i}].size`,
    item.size ?? ""
  );

  formData.append(
    `items[${i}].qty`,
    item.qty ?? 0
  );
});
   
    tableData.forEach((item, i) => {
  const materials = item.materials ?? [];
  if (materials.length === 0) {
    // send an empty marker so the backend doesn't just skip the field entirely
    formData.append(`items[${i}].materials`, "");
  } else {
    materials.forEach((m) => {
      formData.append(`items[${i}].materials`, m);
    });
  }
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

            <div>
              <FieldLabel>Production Incharge</FieldLabel>
              <AutoComplete
                className="mt-1 w-full"
                value={productionInchargeName}
                onSearch={handleInchargeSearch}
                onFocus={handleInchargeFocus}
                onSelect={handleInchargeSelect}
                options={inchargeOptions}
                placeholder="Search a member..."
                notFoundContent={
                  inchargeSearching ? <Spin size="small" /> : "No members found"
                }
                filterOption={false}
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
              <FieldLabel>Reference</FieldLabel>
              <Input
                className="mt-1 w-full"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <DateTimeField
              label="Setup (Date/Time)"
              value={setupDateTime}
              onChange={setSetupDateTime}
            />

            <DateTimeField
              label="Dismantling (Date/Time)"
              value={dismantleDateTime}
              onChange={setDismantleDateTime}
            />

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
  materialOptions={MATERIAL_OPTIONS}
/>
        </section>

        {/* Footer actions */}
        <div className="flex justify-end gap-3">
          {/* <button className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            Save as Draft
          </button> */}
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