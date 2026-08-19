import React, { useEffect, useMemo, useState, useCallback } from "react";import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Select } from "antd";
import {
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Files,
  FileText,
  Info,
  Layers2,
  Loader2,
  MessageSquareText,
  MonitorUp,
  Copy,
  Plus,
  Printer,
  Save,
  Search,
  SendHorizonal,
  Sparkles,
  Trash2,
  Wallet,
  ImagePlus,
  Pencil,
} from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";
import DateField from "../../components/form-inputs/DatePicker/Datefield";

import LayoutModel from "./models/LayoutModel";
import PresentationModel from "./models/PresentationModel";
import ChatBoxModel from "./models/ChatBoxModel";
import InfoModel from "./models/InfoModel";
import PrintModel from "./models/PrintModel";

import {
  getbyeventid,
  AddEstimate,
  GetEstimateById,
  getallmenuitem,
  STATUS_TYPE_MAP,
  PAYMENT_MODE_MAP,
} from "../../services/apiServices";
import { getallbankaccount, getallcashaccount } from "../../services/apiServices";
import { useAuthStore } from "../../store/useAuthStore";
import { AddMenuitemmaster } from "../Master/MenuItemMaster/menuitemmaster/AddMenuitemmaster";
import DateTimeField from "../../components/form-inputs/DatePicker/DateTimeField";


const toId = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

const mapFunctionItems = (fn) =>
  (fn?.items ?? []).map((item) => ({
    id: item.id,
    menuItemId: item.menuItemId ?? null,
    itemName: item.menuItemNameEnglish ?? item.description ?? "Item",
    description: item.description ?? item.menuItemNameEnglish ?? "",
    image: item.images?.[0]?.url ?? item.images?.[0] ?? "",
    qty: Number(item.qty || 0),
    rate: Number(item.rate || 0),
    discountRate: Number(item.discountRate || 0),
    size: item.size ?? "",
    sqft: item.sqFt ?? 1,
    sqFt: item.sqFt ?? 1,
  }));
const mapPaymentsFromApi = (payments = []) =>
  payments.map((p) => ({
    id: p.id,
    amount: p.amount,
    mode:
      Object.keys(PAYMENT_MODE_MAP).find(
        (label) => PAYMENT_MODE_MAP[label] === p.mode
      ) ?? "Cash",
    date: p.paymentDate ?? "",
    description: p.description ?? "",
    bankId: p.bankId ?? 0,
    cashAccountId: p.cashAccountId ?? 0,
  }));



const DEFAULT_PAGINATION_SIZE = 10;
const DEFAULT_SORTING = [{ id: "itemName", desc: false }];

const getEstimateColumns = ({ onEdit, onDelete, onDescriptionChange, onImageUpload, onFieldChange }) => [
  {
    accessorKey: "id",
    header: "SR",
    cell: ({ row, table }) => {
      const index = table.getSortedRowModel().rows.findIndex((r) => r.original.id === row.original.id);
      return index + 1;
    },
  },
  {
    accessorKey: "itemName",
    header: "ITEM DETAILS",
    cell: ({ row }) => (
      <div className="py-2">
        <h6 className="font-bold text-sm text-dark">{row.original.itemName}</h6>
        <textarea
          defaultValue={row.original.description}
          rows={3}
          onBlur={(e) => onDescriptionChange && onDescriptionChange(row.original.id, e.target.value)}
          className="w-full max-w-xs resize-none rounded border border-primary-clarity px-3 py-2 text-xs text-gray-600 outline-none focus:border-primary"
        />
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "MEDIA",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.image ? (
          <img src={row.original.image} alt={row.original.itemName} className="h-10 w-10 rounded-md object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-md bg-gray-100" />
        )}
        <label className="cursor-pointer rounded border-2 p-3 text-gray-600 border-dashed border-primary-clarity hover:bg-primary-clarity/10" title="Click to upload image">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onImageUpload && onImageUpload(row.original.id, e.target.files?.[0])}
          />
          <ImagePlus size={14} />
        </label>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "SIZE",
    cell: ({ row }) => (
      <input
        value={row.original.size ?? ""}
        onChange={(e) => onFieldChange && onFieldChange(row.original.id, "size", e.target.value)}
        className="w-14 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },
  {
    accessorKey: "qty",
    header: "QTY",
    cell: ({ row }) => (
      <input
        type="tel"
        min="0"
        value={row.original.qty ?? ""}
        onChange={(e) => onFieldChange && onFieldChange(row.original.id, "qty", e.target.value)}
        className="w-16 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },
  {
    accessorKey: "sqft",
    header: "SQ. FT.",
    cell: ({ row }) => (
      <input
        value={row.original.sqft ?? ""}
        onChange={(e) => onFieldChange && onFieldChange(row.original.id, "sqft", e.target.value)}
        className="w-16 rounded-lg text-dark font-bold text-xs border text-center h-9 border-primary-clarity outline-none"
      />
    ),
  },
  {
    accessorKey: "rate",
    header: "RATE",
    cell: ({ row }) => (
      <div className="relative w-24">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
        <input
          type="tel"
          min="0"
          value={row.original.rate ?? ""}
          onChange={(e) => onFieldChange && onFieldChange(row.original.id, "rate", e.target.value)}
          className="w-full rounded-lg text-dark font-bold text-xs border h-9 pl-5 pr-2 border-primary-clarity outline-none"
        />
      </div>
    ),
  },
  {
    accessorKey: "discountRate",
    header: "DISC %",
    cell: ({ row }) => (
      <div className="relative w-16">
        <input
          type="tel"
          min="0"
          max="100"
          value={row.original.discountRate ?? ""}
          onChange={(e) => onFieldChange && onFieldChange(row.original.id, "discountRate", e.target.value)}
          className="w-full rounded-lg text-dark font-bold text-xs border h-9 text-center pr-4 border-primary-clarity outline-none"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
      </div>
    ),
  },
  {
  accessorKey: "total",
  header: "TOTAL",
  cell: ({ row }) => {
    const qty = Number(row.original.qty || 0);
    const sqft = Number(row.original.sqft || row.original.sqFt || 1);
    const rate = Number(row.original.rate || 0);
    const discountRate = Number(row.original.discountRate || 0);
    const total = qty * rate * (1 - discountRate / 100);
    return <span className="font-semibold text-primary">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>;
  },
},
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button onClick={() => onEdit(row.original)} className="p-2 text-gray-500">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(row.original)} className="p-2 text-gray-500">
          <Trash2 size={15} />
        </button>
      </div>
    ),
  },
];

/* ---------------------------------------------------------------------------
   Small shared display pieces (New Estimate header inputs, summary rows)
   -------------------------------------------------------------------------*/

function Input({ label, type = "text", value, onChange, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</label>
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

function SelectInput({ label, className = "", options = [], value, onChange }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">{label}</label>
      <Select placeholder="Select" className="w-full" size="large" options={options} value={value ?? undefined} onChange={onChange} />
    </div>
  );
}

const SummaryRow = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-gray-700">{label}</span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);

const SummaryInput = ({ label, value, onChange, showRupee = true }) => (
  <div className="flex items-center justify-between gap-5">
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative w-40">
      {showRupee && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>}
      <input
        type="tel"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`h-10 w-full rounded-lg border outline-none focus:border-primary border-primary-clarity ${
          showRupee ? "pl-8 pr-3 text-right" : "px-3 text-right h-7"
        }`}
      />
    </div>
  </div>
);

const GSTRow = ({ label, percent, onChange, amount }) => (
  <div className="flex items-center">
    <span className="w-24 text-xs text-gray-600 font-medium">{label}</span>
    <div className="ml-auto flex items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          type="tel"
          value={percent ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-7 w-16 rounded border border-primary-clarity text-center outline-none focus:border-primary"
        />
        <span className="text-sm font-medium text-gray-600">%</span>
      </div>
      <span className="w-24 text-right font-semibold text-gray-700">{amount}</span>
    </div>
  </div>
);

const OPTIONS = [
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
];
const paymentModes = ["Bank Transfer", "Cash", "Cheque", "UPI", "Credit Card"];




function SubtotalBreakdownModal({ open, onClose, functions }) {
  // functions = estimateFunctionsRaw (each has functionName + totalAmount)
  const grandTotal = (functions ?? []).reduce((sum, f) => sum + Number(f.totalAmount || 0), 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark">Function-wise Total</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {(functions ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No functions available</p>
          ) : (
            (functions ?? []).map((f) => (
              <div
                key={f.eventFunctionId}
                className="flex items-center justify-between rounded-lg border border-primary-clarity px-4 py-3"
              >
                <span className="text-sm font-semibold text-dark">{f.functionName}</span>
                <span className="font-bold text-primary">
                  ₹{Number(f.totalAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-primary-clarity pt-4">
          <span className="text-sm font-bold text-dark">Total (All Functions)</span>
          <span className="text-lg font-bold text-primary">
            ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}






/* ============================================================================
   Page
   ============================================================================ */

const QuotationPage = () => {
 const { eventId: routeEventId } = useParams();
const [searchParams] = useSearchParams();
const eventId = routeEventId ?? searchParams.get("eventId");
const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [saving, setSaving] = useState(false);

  // New Estimate header
  const [estimateId, setEstimateId] = useState(null);
  const [estimateDate, setEstimateDate] = useState("");
  const [statusType, setStatusType] = useState("Pending");
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);

  const userId = localStorage.getItem("userId")

  // Raw functions[] exactly as returned by GET — single source of truth.
  const [estimateFunctionsRaw, setEstimateFunctionsRaw] = useState([]);
  // Only functions the user has actually edited land here, keyed by
  // String(Number(eventFunctionId)) — everything else reads straight from
  // estimateFunctionsRaw.
  const [editedItemsByFunction, setEditedItemsByFunction] = useState({});
  const chequeTouchedRef = React.useRef(false);
  const [openSubtotalModal, setOpenSubtotalModal] = useState(false);
const [bankAccounts, setBankAccounts] = useState([]);
const [cashAccounts, setCashAccounts] = useState([]);
  

  const fetchEstimate = () => {
  if (!eventId) return Promise.resolve();
  return GetEstimateById({
    code: "",
    estimateType: "MAIN",
    eventId: Number(eventId),
    page: 0,
    size: 1,
    sortBy: "id",
    sortDirection: "DESC",
    statusType: null,
    userId: Number(userId),
  })
  .then((res) => {
  // Handle any nesting: {data:{content}}, {data}, or raw {content}
  let page = res;
  if (res && typeof res === "object" && "data" in res) page = res.data;
  if (page && typeof page === "object" && "data" in page && !("content" in page)) page = page.data;

  const content = page?.content ?? [];
  const data = content[0];

  console.log("[Quotation] page ->", page);
  console.log("[Quotation] data.functions ->", data?.functions);

  if (!data) return;

      setEstimateId(data.id ?? null);
      setEstimateDate(data.estimateDate ?? "");

      const statusLabel =
        Object.keys(STATUS_TYPE_MAP).find((label) => STATUS_TYPE_MAP[label] === data.statusType) ?? "Pending";
      setStatusType(statusLabel);

      const allFunctions = data.functions ?? [];
      setEstimateFunctionsRaw(allFunctions);
      setEditedItemsByFunction({});

      const primaryFunction = allFunctions[0] ?? null;
      setSelectedFunctionId(toId(primaryFunction?.eventFunctionId));

      setPayments(mapPaymentsFromApi(data.payments));
      setNotes(data.notes ?? "");

      chequeTouchedRef.current = Number(data.cashAmount) > 0;
setSummary((prev) => ({
        ...prev,
        discount: data.discount ?? prev.discount,
        cashAmount: data.cashAmount ?? prev.cashAmount,
        chequeAmount: data.chequeAmount ?? prev.chequeAmount,
        cgst: data.cgst ?? prev.cgst,
        sgst: data.sgst ?? prev.sgst,
        igst: data.igst ?? prev.igst,
        taxAmount: data.taxAmount ?? prev.taxAmount,
        roundOff: data.roundOff ?? prev.roundOff,
      }));
    })
    .catch((err) => console.log("[Quotation] GetEstimateById: no estimate yet / error", err));
};


useEffect(() => {
  const uid = Number(localStorage.getItem("userId")) || 0;

  getallbankaccount({
    isPrimary: null, page: 0, search: "", size: 100,
    sortBy: "id", sortDirection: "ASC", userId: uid,
  })
    .then((res) => {
      const body = res?.data ?? res;
      setBankAccounts(body?.data?.content ?? body?.data ?? []);
    })
    .catch((err) => console.error("Failed to fetch bank accounts:", err));

  getallcashaccount({
    isPrimary: null, page: 0, search: "", size: 100,
    sortBy: "id", sortDirection: "DESC", userId: uid,
  })
    .then((res) => {
      const body = res?.data ?? res;
      setCashAccounts(body?.data?.content ?? body?.data ?? []);
    })
    .catch((err) => console.error("Failed to fetch cash accounts:", err));
}, []);

useEffect(() => {
  fetchEstimate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [eventId]);

  const [summary, setSummary] = useState({
    discount: 0,
    cashAmount: 0,
    chequeAmount: 0,
    cgst: 9,
    sgst: 9,
    igst: 0,
    taxType: "TDS",
    taxAmount: 0,
    roundOff: 0,
  });

  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState("");

  // Modals used from the header action row
  const [openLayoutModal, setOpenLayoutModal] = useState(false);
  const [presentationModal, setPresentationModal] = useState(false);
  const [chatBoxModel, setChatBoxModel] = useState(false);
  const [infoModel, setInfoModel] = useState(false);
  const [printModel, setPrintModel] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  /* ---- GET: event details (name, party, venue, function list for dropdown) */
  useEffect(() => {
    if (!eventId) {
      Swal.fire({ icon: "warning", title: "No event selected" });
      setLoading(false);
      return;
    }
    setLoading(true);
    getbyeventid(eventId)
      .then((res) => {
        const body = res?.data ?? res;
        const data = body?.data ?? body;
        setEventData(data);
      })
      .catch(() => Swal.fire({ icon: "error", title: "Failed to load event details" }))
      .finally(() => setLoading(false));
  }, [eventId]);

  /* ---- GET: existing MAIN estimate for this event, to prefill everything */
  useEffect(() => {
    if (!eventId) return;

    GetEstimateById({
      code: "",
      estimateType: "MAIN",
      eventId: Number(eventId),
      page: 0,
      size: 1,
      sortBy: "id",
      sortDirection: "DESC",
      statusType: null,
      userId: Number(userId),
    })
      .then((res) => {
        const body = res?.data ?? res;
        const content = body?.content ?? [];
        const data = content[0];
        if (!data) return; // brand-new event, no estimate yet — keep defaults

        setEstimateId(data.id ?? null);
        setEstimateDate(data.estimateDate ?? "");

        const statusLabel =
          Object.keys(STATUS_TYPE_MAP).find((label) => STATUS_TYPE_MAP[label] === data.statusType) ?? "Pending";
        setStatusType(statusLabel);

        const allFunctions = data.functions ?? [];
        setEstimateFunctionsRaw(allFunctions);
        setEditedItemsByFunction({});

        const primaryFunction = allFunctions[0] ?? null;
        setSelectedFunctionId(toId(primaryFunction?.eventFunctionId));

        setPayments(mapPaymentsFromApi(data.payments));
        setNotes(data.notes ?? "");
        setSummary((prev) => ({
          ...prev,
          discount: data.discount ?? prev.discount,
          cashAmount: data.cashAmount ?? prev.cashAmount,
          chequeAmount: data.chequeAmount ?? prev.chequeAmount,
          cgst: data.cgst ?? prev.cgst,
          sgst: data.sgst ?? prev.sgst,
          igst: data.igst ?? prev.igst,
          taxAmount: data.taxAmount ?? prev.taxAmount,
          roundOff: data.roundOff ?? prev.roundOff,
        }));
      })
      .catch((err) => {
        console.log("[Quotation] GetEstimateById: no estimate yet / error", err);
      });
  }, [eventId]);



 const functionOptions =
  eventData?.eventFunctions?.map((f) => ({ value: toId(f.id), label: f.nameEnglish })) ?? [];

 const items = useMemo(() => {
    if (selectedFunctionId == null) return [];
    const key = String(selectedFunctionId);
    if (editedItemsByFunction[key] !== undefined) return editedItemsByFunction[key];

    const fn = estimateFunctionsRaw.find((f) => toId(f.eventFunctionId) === selectedFunctionId);
    console.log(
      `[Quotation] selectedFunctionId=${selectedFunctionId} (${typeof selectedFunctionId}) ->`,
      fn ? `MATCHED eventFunctionId=${fn.eventFunctionId} (${typeof fn.eventFunctionId}), ${fn.items?.length ?? 0} items` : "NO MATCH in estimateFunctionsRaw",
      "raw ids available:",
      estimateFunctionsRaw.map((f) => `${f.eventFunctionId} (${typeof f.eventFunctionId})`)
    );
    return mapFunctionItems(fn);
  }, [selectedFunctionId, editedItemsByFunction, estimateFunctionsRaw]);

 const handleFunctionChange = (functionId) => {
  const newId = toId(functionId);
  if (newId === selectedFunctionId) return;

  const currentKey = String(selectedFunctionId);
  const isDirty = selectedFunctionId != null && editedItemsByFunction[currentKey] !== undefined;

  if (!isDirty) {
    setSelectedFunctionId(newId);
    return;
  }

  Swal.fire({
    icon: "warning",
    title: "Unsaved changes",
    text: "Save your current function estimate before switching?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save & Switch",
    denyButtonText: "Discard & Switch",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#7c1a3d",
  }).then((result) => {
    if (result.isConfirmed) {
      handleSave().then(() => setSelectedFunctionId(newId));
    } else if (result.isDenied) {
      setEditedItemsByFunction((prev) => {
        const next = { ...prev };
        delete next[currentKey];
        return next;
      });
      setSelectedFunctionId(newId);
    }
    // Cancel: do nothing, dropdown stays on current function
  });
};

 const handleItemsChange = useCallback(
  (updater) => {
    setEditedItemsByFunction((prev) => {
      const key = String(selectedFunctionId);
      const currentItems =
        prev[key] !== undefined
          ? prev[key]
          : mapFunctionItems(estimateFunctionsRaw.find((f) => toId(f.eventFunctionId) === selectedFunctionId));
      const nextItems = typeof updater === "function" ? updater(currentItems) : updater;
      return { ...prev, [key]: nextItems };
    });
  },
  [selectedFunctionId, estimateFunctionsRaw]
);

  const updateItemField = useCallback(
  (id, field, value) => {
    handleItemsChange((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "sqft") updated.sqFt = value;
        return updated;
      })
    );
  },
  [handleItemsChange]
);

const handleDescriptionChange = useCallback(
  (id, value) => {
    handleItemsChange((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, description: value } : item))
    );
  },
  [handleItemsChange]
);

const handleDeleteItem = useCallback(
  (row) => {
    handleItemsChange((currentItems) => currentItems.filter((i) => i.id !== row.id));
  },
  [handleItemsChange]
);

const handleImageUpload = useCallback(
  (id, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    handleItemsChange((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, image: previewUrl, imageFile: file } : item))
    );
  },
  [handleItemsChange]
);


const buildItemRow = ({ menuItemId = null, itemName = "New Item", description = "", rate = 0 }) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  menuItemId,
  itemName,
  description: description || itemName,
  image: "",
  qty: 1,
  rate: Number(rate || 0),
  discountRate: 0,
  size: "",
  sqft: 1,   
  sqFt: 1,   
});
const allItems = [
  ...new Set([
    ...estimateFunctionsRaw.map((f) => toId(f.eventFunctionId)),
    ...Object.keys(editedItemsByFunction).map((k) => toId(k)),
  ]),
]
  .filter((id) => id != null)
  .flatMap((fnId) => {
    const key = String(fnId);
    if (editedItemsByFunction[key] !== undefined) return editedItemsByFunction[key];
    const rawFn = estimateFunctionsRaw.find((f) => toId(f.eventFunctionId) === fnId);
    return mapFunctionItems(rawFn);
  });

const subtotal = allItems.reduce(
  (sum, i) =>
    sum +
    Number(i.qty || 0) *
      
      Number(i.rate || 0) *
      (1 - Number(i.discountRate || 0) / 100),
  0
);
  const amountAfterDiscount = subtotal - Number(summary.discount || 0);
  const cgstAmount = (amountAfterDiscount * Number(summary.cgst || 0)) / 100;
  const sgstAmount = (amountAfterDiscount * Number(summary.sgst || 0)) / 100;
  const igstAmount = (amountAfterDiscount * Number(summary.igst || 0)) / 100;
  const grandTotal =
    amountAfterDiscount + cgstAmount + sgstAmount + igstAmount + Number(summary.taxAmount || 0) + Number(summary.roundOff || 0);
      useEffect(() => {
  if (!chequeTouchedRef.current) {
    setSummary((prev) => ({ ...prev, chequeAmount: amountAfterDiscount, cashAmount: 0 }));
  }
}, [amountAfterDiscount]);

const handleChequeAmountChange = (value) => {
  chequeTouchedRef.current = true;
  const cheque = Number(value || 0);
  setSummary((prev) => ({ ...prev, chequeAmount: value, cashAmount: amountAfterDiscount - cheque }));
};

const handleCashAmountChange = (value) => {
  chequeTouchedRef.current = true;
  const cash = Number(value || 0);
  setSummary((prev) => ({ ...prev, cashAmount: value, chequeAmount: amountAfterDiscount - cash }));
};
  const chequeInclGst =
    Number(summary.chequeAmount || 0) +
    (Number(summary.chequeAmount || 0) * (Number(summary.cgst || 0) + Number(summary.sgst || 0) + Number(summary.igst || 0))) / 100;

  /* ---- SAVE: single endpoint handles both create (estimateId null) and edit */
  const handleSave = async () => {
    if (!eventId) {
      Swal.fire({ icon: "warning", title: "Missing eventId" });
      return;
    }

    const functionIds = new Set(estimateFunctionsRaw.map((f) => toId(f.eventFunctionId)));
    if (selectedFunctionId != null) functionIds.add(selectedFunctionId);
    Object.keys(editedItemsByFunction).forEach((key) => functionIds.add(toId(key)));

    const functionsPayload = Array.from(functionIds).map((fnId) => {
      const key = String(fnId);
      const rawFn = estimateFunctionsRaw.find((f) => toId(f.eventFunctionId) === fnId);
      const fnItems = editedItemsByFunction[key] !== undefined ? editedItemsByFunction[key] : mapFunctionItems(rawFn);

      return {
        id: rawFn?.id ?? 0,
        eventFunctionId: fnId,
        items: fnItems.map((item) => {
          const qty = Math.round(Number(item.qty || 0));
          const rate = Number(item.rate || 0);
          const discountRate = Number(item.discountRate || 0);
          return {
            id: typeof item.id === "number" && item.id < 1e10 ? item.id : 0,
            menuItemId: item.menuItemId ?? null,
            description: item.description ?? item.itemName,
            qty,
            rate,
            discountRate,
            discount: (qty * rate * discountRate) / 100,
            size: item.size ?? "",
            sqFt: item.sqFt ?? item.sqft ?? "",
          };
        }),
      };
    });

    const payload = {
      id: estimateId, // null => create, present => edit — same endpoint either way
      eventId: Number(eventId),
      estimateType: "MAIN",
      estimateDate,
      statusType: STATUS_TYPE_MAP[statusType] ?? "PENDING",
      discount: Number(summary.discount || 0),
      discountAmount: subtotal - amountAfterDiscount,
      cashAmount: Number(summary.cashAmount || 0),
      chequeAmount: Number(summary.chequeAmount || 0),
      cgst: Number(summary.cgst || 0),
      sgst: Number(summary.sgst || 0),
      igst: Number(summary.igst || 0),
      taxAmount: Number(summary.taxAmount || 0),
      roundOff: Number(summary.roundOff || 0),
      notes,
      userId,
      functions: functionsPayload,
      payments: payments.map((p) => ({
        id: typeof p.id === "number" && p.id < 1e10 ? p.id : null,
        amount: Number(p.amount || 0),
        mode: PAYMENT_MODE_MAP[p.mode] ?? "CASH",
        paymentDate: p.date,
        description: p.description,
        bankId: p.bankId ?? null,
        cashAccountId: p.cashAccountId ?? null,
      })),
    };

    console.log("data",payload)

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    functionsPayload.forEach((fn, fnIndex) => {
      const key = String(fn.eventFunctionId);
      const fnItems =
        editedItemsByFunction[key] !== undefined
          ? editedItemsByFunction[key]
          : mapFunctionItems(estimateFunctionsRaw.find((f) => toId(f.eventFunctionId) === fn.eventFunctionId));
      fnItems.forEach((item, itemIndex) => {
        if (item.imageFile) {
          formData.append(`functions[${fnIndex}].items[${itemIndex}].images`, item.imageFile);
        }
      });
    });

    setSaving(true);
    try {
        console.log("data",formData)
      const res = await AddEstimate(formData);
      const body = res?.data ?? res;
      const data = body?.data ?? body;
      setEstimateId(data?.id ?? estimateId);
      await fetchEstimate();
      Swal.fire({ icon: "success", title: "Estimate saved", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Failed to save estimate:", err);
      Swal.fire({ icon: "error", title: "Failed to save estimate" });
    } finally {
      setSaving(false);
    }
  };

  /* ---- Quick Add search (menu items) ---- */
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const SUGGESTION_PAGE_SIZE = 8;

  const fetchMenuItems = async (query, pageNum, append) => {
    if (append) setLoadingMore(true);
    else setSearching(true);
    try {
      const res = await getallmenuitem({
        page: pageNum,
        size: SUGGESTION_PAGE_SIZE,
        nameEnglish: query,
        isActive: true,
        sortBy: "id",
        sortDirection: "ASC",
        userId:userId
      });
      const body = res?.data ?? res;
      const pageData = body?.data ?? body;
      const content = pageData?.content ?? [];
      const last = pageData?.last ?? true;
      setSuggestions((prev) => (append ? [...prev, ...content] : content));
      setIsLastPage(last);
      setPage(pageNum);
      setHasLoadedOnce(true);
    } catch {
      if (!append) setSuggestions([]);
    } finally {
      setSearching(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchMenuItems(search, 0, false), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFocus = () => {
    setShowSuggestions(true);
    if (!hasLoadedOnce && !searching) fetchMenuItems(search, 0, false);
  };
  const handleLoadMore = () => {
    if (isLastPage || loadingMore) return;
    fetchMenuItems(search, page + 1, true);
  };
  const addMenuItemToEstimate = (menuItem) => {
    handleItemsChange([
      ...items,
      buildItemRow({
        menuItemId: menuItem.id,
        itemName: menuItem.nameEnglish,
        description: menuItem.description,
        rate: menuItem.rate ?? menuItem.price ?? 0,
      }),
    ]);
    setSearch("");
    setShowSuggestions(false);
  };
  const handleMenuItemCreated = (savedItem) => {
    if (!savedItem) return;
    handleItemsChange([
      ...items,
      buildItemRow({
        menuItemId: savedItem.id,
        itemName: savedItem.nameEnglish,
        description: savedItem.description,
        rate: savedItem.rate ?? savedItem.price ?? 0,
      }),
    ]);
  };
  const handleAdd = () => {
    handleItemsChange([...items, buildItemRow({ itemName: search || "New Item" })]);
    setSearch("");
    setShowSuggestions(false);
  };

  const updateSummary = (field, value) => setSummary((prev) => ({ ...prev, [field]: value }));

  const filteredItems = useMemo(
    () => items.filter((item) => (item.itemName ?? item.description ?? "").toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const tableTotal = useMemo(
  () =>
    filteredItems.reduce((sum, item) => {
      const qty = Number(item.qty || 0);
      const rate = Number(item.rate || 0);
      const discountRate = Number(item.discountRate || 0);
      return sum + qty * rate * (1 - discountRate / 100);
    }, 0),
  [filteredItems]
);

  const columns = useMemo(
  () =>
    getEstimateColumns({
      onEdit: (row) => console.log("Edit", row),
      onDelete: handleDeleteItem,
      onDescriptionChange: handleDescriptionChange,
      onImageUpload: handleImageUpload,
      onFieldChange: updateItemField,
    }),
  [handleDeleteItem, handleDescriptionChange, handleImageUpload, updateItemField]
);

  /* ---- Payments ---- */
  const addPayment = () =>
    setPayments((prev) => [...prev, { id: Date.now(), amount: "", mode: "Bank Transfer", date: "", description: "" }]);
  const removePayment = (id) => setPayments((prev) => prev.filter((p) => p.id !== id));
  const updatePayment = (id, field, value) =>
  setPayments((prev) =>
    prev.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "mode") {
        updated.bankId = 0;
        updated.cashAccountId = 0;
      }
      return updated;
    })
  );
  const totalPaid = useMemo(() => payments.reduce((sum, item) => sum + Number(item.amount || 0), 0), [payments]);
  const remaining = grandTotal - totalPaid;

  const handleGoToExecution = () => {
  if (!eventId) {
    Swal.fire({ icon: "warning", title: "Missing eventId" });
    return;
  }
  const query = selectedFunctionId != null ? `?functionId=${selectedFunctionId}` : "";
  navigate(`/execution/${eventId}`);
};

  const actionItems = [
    { label: "LAYOUT", icon: Layers2, onClick: () => setOpenLayoutModal(true) },
    { label: "PRESENTATION", icon: MonitorUp, onClick: () => setPresentationModal(true) },
    { label: "CHATBOX", icon: MessageSquareText, onClick: () => setChatBoxModel(true) },
    { label: "INFO", icon: Info, onClick: () => setInfoModel(true) },
    { label: "CLONE", icon: Copy, onClick: () => console.log("Clone") },
    { label: "PRINT", icon: Printer, onClick: () => setPrintModel(true) },
    { label: "SAVE", icon: Save, onClick: handleSave },
  ];



  const functionsWithLiveTotal = (estimateFunctionsRaw ?? []).map((f) => {
    const key = String(toId(f.eventFunctionId));
    const fnItems =
      editedItemsByFunction[key] !== undefined ? editedItemsByFunction[key] : mapFunctionItems(f);
    const total = fnItems.reduce(
      (sum, i) =>
        sum +
        Number(i.qty || 0) *
          (Number(i.sqFt ?? i.sqft ?? 1) || 1) *
          Number(i.rate || 0) *
          (1 - Number(i.discountRate || 0) / 100),
      0
    );
    return { ...f, totalAmount: total };
  });




  return (
    <div className="min-h-screen p-6">
      {/* ---------------- New Estimate header ---------------- */}
      <div className="m-0 p-0">
        <div className="mx-auto rounded-lg border bg-white p-4 md:p-6 shadow-sm">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary">New Estimate</h2>
            <p className="mt-2 text-gray-500">Configure event logistics and client information for the quotation.</p>
          </div>

          <div className={loading ? "pointer-events-none opacity-50" : ""}>
            <div className="grid gap-5 md:grid-cols-3">
              <Input label="EVENT NO" value={eventData?.eventNo} />
              <Input label="EVENT NAME" className="col-span-2" value={eventData?.eventNameEnglish} placeholder="e.g. Royal Grand Wedding Gala" />
              <Input label="PARTY NAME" value={eventData?.partyNameEnglish} placeholder="Client or Organization" />
              <Input label="VENUE" value={eventData?.venueNameEnglish} placeholder="Location Name" />
              <DateField label="ESTIMATE DATE" value={estimateDate} onChange={setEstimateDate} />
              <SelectInput label="APPROVAL" options={OPTIONS} value={statusType} onChange={setStatusType} />

              <div className="col-span-2 flex justify-evenly self-end pt-3">
                {actionItems.map((item) => {
                  const Icon = item.icon;
                  const isSave = item.label === "SAVE";
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      disabled={isSave && saving}
                      className="group flex flex-col items-center rounded-xl p-2 transition hover:bg-primary/5 disabled:opacity-60"
                    >
                      {isSave && saving ? (
                        <Loader2 size={22} className="text-primary animate-spin" />
                      ) : (
                        <Icon size={22} className="text-primary transition group-hover:scale-110" />
                      )}
                      <span className="mt-2 text-[10px] font-bold text-gray-800">{isSave && saving ? "SAVING" : item.label}</span>
                    </button>
                  );
                })}
              </div>

              <SelectInput
                label="FUNCTION NAME"
                className="sm:col-span-2 lg:col-span-1"
                options={functionOptions}
                value={selectedFunctionId}
                onChange={handleFunctionChange}
              />

              <div className="col-span-2 flex gap-5 self-end m-0">
                <button
  onClick={handleGoToExecution}
  className="rounded-2xl bg-primary py-4 h-max text-sm font-semibold text-light hover:opacity-90 w-full"
>
  Event Execution
</button>
                <button className="rounded-2xl bg-primary py-4 h-max text-sm font-semibold text-light hover:opacity-90 w-full">Other Estimate</button>
              </div>
            </div>
          </div>
        </div>

      <LayoutModel
  open={openLayoutModal}
  onClose={() => setOpenLayoutModal(false)}
  eventId={eventId}
  eventData={eventData}
/>
        <PresentationModel
  open={presentationModal}
  onClose={() => setPresentationModal(false)}
  eventId={eventId}
/>
        <ChatBoxModel
  open={chatBoxModel}
  onClose={() => setChatBoxModel(false)}
  eventId={eventId}
  eventData={eventData}
/>
        <InfoModel open={infoModel} onClose={() => setInfoModel(false)} />
        <PrintModel open={printModel} onClose={() => setPrintModel(false)} />
            <SubtotalBreakdownModal
  open={openSubtotalModal}
  onClose={() => setOpenSubtotalModal(false)}
  functions={functionsWithLiveTotal}
/>
      </div>

      {/* ---------------- Estimate Items ---------------- */}
      <div className="space-y-5">
        <div className="rounded-lg border bg-light-clarity p-5 mt-5">
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">Quick Add Items</label>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search decor, lighting, catering..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="h-11 w-full rounded-lg border border-dashed border-dark pl-10 pr-4 text-sm outline-none focus:border-primary text-dark"
              />
              {showSuggestions && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-72 overflow-y-auto">
                  {searching ? (
                    <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                      <Loader2 size={14} className="animate-spin" />
                      Loading...
                    </div>
                  ) : suggestions.length ? (
                    <>
                      {suggestions.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onMouseDown={() => addMenuItemToEstimate(m)}
                          className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <span>{m.nameEnglish}</span>
                          {(m.rate ?? m.price) != null && <span className="text-gray-500">₹{m.rate ?? m.price}</span>}
                        </button>
                      ))}
                      {!isLastPage && (
                        <button
                          type="button"
                          onMouseDown={handleLoadMore}
                          disabled={loadingMore}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-primary hover:bg-gray-50 disabled:opacity-60"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              Loading more...
                            </>
                          ) : (
                            <>
                              <ChevronDown size={13} />
                              Load more
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">No items found</div>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleAdd} className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-6 font-medium hover:bg-gray-50">
              <Plus size={16} />
              Add
            </button>
            <button
              onClick={() => setGenerateModalOpen(true)}
              className="flex h-11 items-center justify-center gap-2 text-sm rounded-lg bg-primary px-6 font-medium text-white hover:opacity-90"
            >
              <Sparkles size={16} />
              Generate Item
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-light">
          
          <TableComponent columns={columns} data={filteredItems} tableData={filteredItems} paginationSize={DEFAULT_PAGINATION_SIZE} defaultSorting={DEFAULT_SORTING} />
  <div className="flex items-center justify-between border-t border-primary-clarity px-5 py-4">
    <span className="text-sm font-bold text-gray-700">
      Total ({filteredItems.length} item{filteredItems.length === 1 ? "" : "s"})
    </span>
    <span className="text-lg font-bold text-primary">
      ₹ {tableTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
    </span>
  </div>
        </div>

<div className="rounded-lg border border-primary-clarity bg-light p-6">
  <h4 className="mb-6 text-lg font-bold text-dark">Estimate Summary</h4>
          <div className="flex justify-end">
            <div className="w-full max-w-2xl space-y-4 text-sm">
            <div className="flex items-center justify-between">
  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
    Subtotal
    <button
      type="button"
      onClick={() => setOpenSubtotalModal(true)}
      title="View function-wise total"
      className="text-gray-400 transition hover:text-primary"
    >
      <Info size={15} />
    </button>
  </span>
  <span className="font-bold text-dark">
    ₹ {subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
  </span>
</div>
              <SummaryInput label="Discount" value={summary.discount} onChange={(v) => updateSummary("discount", v)} />
              <div className="border-t"></div>
              <SummaryRow
                label="Amount After Discount"
                value={`₹ ${amountAfterDiscount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
                valueClass="text-primary font-bold"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryInput label="Cash Payment" value={summary.cashAmount} onChange={handleCashAmountChange} />
<SummaryInput label="Cheque Amount" value={summary.chequeAmount} onChange={handleChequeAmountChange} />
              </div>

              <div className="rounded-lg bg-light-active border border-primary-clarity p-4 space-y-3">
                <GSTRow label="CGST" percent={summary.cgst} onChange={(v) => updateSummary("cgst", v)} amount={`₹${cgstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} />
                <GSTRow label="SGST" percent={summary.sgst} onChange={(v) => updateSummary("sgst", v)} amount={`₹${sgstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} />
                <GSTRow label="IGST" percent={summary.igst} onChange={(v) => updateSummary("igst", v)} amount={`₹${igstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} />

                <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">
                  <span className="text-sm font-medium">Tax Type</span>
                  <div className="flex overflow-hidden rounded-md border bg-gray-200 p-1 gap-3">
                    <button
                      onClick={() => updateSummary("taxType", "TDS")}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        summary.taxType === "TDS" ? "bg-light text-dark" : "text-gray-500 hover:text-dark"
                      }`}
                    >
                      TDS
                    </button>
                    <button
                      onClick={() => updateSummary("taxType", "TCS")}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        summary.taxType === "TCS" ? "bg-light text-dark" : "text-gray-500 hover:text-dark"
                      }`}
                    >
                      TCS
                    </button>
                  </div>
                </div>

                <SummaryInput label={`${summary.taxType} Amount`} value={summary.taxAmount} onChange={(v) => updateSummary("taxAmount", v)} showRupee={false} />
                <SummaryInput label="Round Off" value={summary.roundOff} onChange={(v) => updateSummary("roundOff", v)} showRupee={false} />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-success-lighter px-4 py-3">
                <span className="font-medium text-success">Cheque Amount (Incl. GST)</span>
                <span className="font-bold text-success">₹{chequeInclGst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">
                <h4 className="text-xl font-bold text-dark">Grand Total</h4>
                <h2 className="text-2xl font-bold text-primary">₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h2>
              </div>
            </div>
          </div>
        </div>

        <AddMenuitemmaster open={generateModalOpen} onClose={() => setGenerateModalOpen(false)} onSave={handleMenuItemCreated} />
      </div>

      {/* ---------------- Payment Details ---------------- */}
      <div className="space-y-6 mt-6">
        <div className="rounded-xl border bg-light p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-dark font-semibold">Payment Details</h3>
            <button onClick={addPayment} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white">
              <Plus size={16} />
              Add Advance Payment
            </button>
          </div>

          <div className="space-y-5 rounded-xl">
            {payments.map((payment, index) => (
              <div key={payment.id} className="rounded-xl border border-primary-clarity p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2">
                    <CircleCheck size={20} className="text-success" />
                    <h4 className="font-semibold my-auto text-dark-light">Advance Payment #{index + 1}</h4>
                  </div>
                  <div className="relative w-full lg:w-40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="tel"
                      value={payment.amount}
                      onChange={(e) => updatePayment(payment.id, "amount", e.target.value)}
                      className="h-10 w-full rounded-lg border bg-light-active text-sm pl-8 pr-3 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">Payment Mode</label>
                  <div className="relative">
                    <select
                      value={payment.mode}
                      onChange={(e) => updatePayment(payment.id, "mode", e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border px-3 outline-none text-sm"
                    >
                      {paymentModes.map((mode) => (
                        <option key={mode}>{mode}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {payment.mode === "Bank Transfer" && (
  <div className="mt-5">
    <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
      Bank Account
    </label>
    <select
      value={payment.bankId || ""}
      onChange={(e) => updatePayment(payment.id, "bankId", Number(e.target.value))}
      className="h-11 w-full appearance-none rounded-lg border px-3 outline-none text-sm"
    >
      <option value="">Select bank account</option>
      {bankAccounts.map((b) => (
        <option key={b.id} value={b.id}>
          {b.accountHolderName} — {b.bankName} ({(b.accountNo || "").slice(-4)})
        </option>
      ))}
    </select>
  </div>
)}

{payment.mode === "Cash" && (
  <div className="mt-5">
    <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
      Cash Account
    </label>
    <select
      value={payment.cashAccountId || ""}
      onChange={(e) => updatePayment(payment.id, "cashAccountId", Number(e.target.value))}
      className="h-11 w-full appearance-none rounded-lg border px-3 outline-none text-sm"
    >
      <option value="">Select cash account</option>
      {cashAccounts.map((c) => (
        <option key={c.id} value={c.id}>
          {c.accountName}
        </option>
      ))}
    </select>
  </div>
)}

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
  <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">Payment Date & Time</label>
  <DateTimeField value={payment.date} onChange={(v) => updatePayment(payment.id, "date", v)} />
</div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">Payment Description</label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input
                        value={payment.description}
                        onChange={(e) => updatePayment(payment.id, "description", e.target.value)}
                        placeholder="Enter payment description"
                        className="h-11 w-full rounded-lg border pl-10 pr-3 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => removePayment(payment.id)} className="flex items-center gap-2 rounded bg-danger px-3 py-2 text-xs font-semibold text-white">
                    <Trash2 size={14} />
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-success uppercase text-xs">Total Paid</span>
              <span className="font-bold text-green-700">₹ {totalPaid.toLocaleString()}</span>
            </div>
            <div className="mt-6 flex items-center justify-between rounded border border-orange-200 bg-danger-lighter px-5 py-4">
              <div className="flex items-center gap-2 text-orange-700 font-semibold uppercase text-xs">
                <Wallet size={16} />
                Remaining Payment
              </div>
              <span className="text-2xl font-bold text-orange-700">₹ {remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-light p-6">
          <h4 className="mb-5 font-semibold flex gap-3 items-center text-dark text-sm">
            <FileText size={16} />
            NOTES
          </h4>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add general notes here..."
            className="w-full rounded-lg border border-primary-clarity text-dark text-sm p-4 outline-none resize-none"
          />
        </div>

        <div className="w-full py-2 px-5 flex justify-between">
          <div className="flex gap-5 text-xs">
            <button className="font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="border border-primary-clarity rounded-lg px-6 py-2 text-gray-900 font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>
          <div className="flex gap-5">
            <button className="flex gap-2 py-2 px-6 border border-primary-clarity rounded-lg text-xs items-center text-dark font-bold">
              <Files size={15} />
              Download PDF
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex gap-2 py-2 px-6 border border-primary-clarity rounded-lg text-xs items-center text-light bg-primary disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <SendHorizonal size={15} />}
              Send to Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;