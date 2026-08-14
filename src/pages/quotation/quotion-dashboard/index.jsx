import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import NewEstimate from "../components/NewEstimate";
import EstimateItems from "../components/Estimate-items";
import PaymentDetails from "../components/PaymentDetails";
import { getbyeventid, AddEstimate, STATUS_TYPE_MAP, PAYMENT_MODE_MAP } from "../../../services/apiServices";
import { useAuthStore } from "../../../store/useAuthStore";


const QuotationDashboard = () => {
const { eventId: routeEventId } = useParams();
const [searchParams] = useSearchParams();
const eventId = routeEventId ?? searchParams.get("eventId");
  const userId = useAuthStore((s) => s.user?.id);

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

  // NewEstimate
  const [estimateId, setEstimateId] = useState(0);
  const [estimateDate, setEstimateDate] = useState("");
  const [statusType, setStatusType] = useState("Pending");
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);

  // EstimateItems (table rows + summary block)
  const [items, setItems] = useState([]);
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

  // PaymentDetails
  const [payments, setPayments] = useState([]);
  const [notes, setNotes] = useState("");

 
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

        // prefill if the event already has a draft estimate
        if (data?.estimate) {
          setEstimateId(data.estimate.id ?? 0);
          setEstimateDate(data.estimate.estimateDate ?? "");
          setItems(data.estimate.items ?? []);
          setPayments(data.estimate.payments ?? []);
          setNotes(data.estimate.notes ?? "");
        }
      })
      .catch(() =>
        Swal.fire({ icon: "error", title: "Failed to load event details" })
      )
      .finally(() => setLoading(false));
  }, [eventId]);

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.qty || 0) * Number(i.rate || 0) * (1 - Number(i.discountRate || 0) / 100),
    0
  );
  const amountAfterDiscount = subtotal - Number(summary.discount || 0);
  const grandTotal =
    amountAfterDiscount +
    (amountAfterDiscount * Number(summary.cgst || 0)) / 100 +
    (amountAfterDiscount * Number(summary.sgst || 0)) / 100 +
    (amountAfterDiscount * Number(summary.igst || 0)) / 100 +
    Number(summary.taxAmount || 0) +
    Number(summary.roundOff || 0);

  const handleSave = async () => {
    if (!eventId) {
      Swal.fire({ icon: "warning", title: "Missing eventId" });
      return;
    }

    const payload = {
      id: estimateId,
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
      functions: [
        {
          id: 0,
          eventFunctionId: selectedFunctionId,
          items: items.map((item) => ({
            id: item.id ?? 0,
            rawItemId: item.rawItemId,
            description: item.description ?? item.itemName,
            qty: Number(item.qty || 0),
            rate: Number(item.rate || 0),
            discountRate: Number(item.discountRate || 0),
            size: item.size ?? "",
            sqFt: item.sqFt ?? "",
          })),
        },
      ],
      payments: payments.map((p) => ({
        id: typeof p.id === "number" && p.id < 1e10 ? p.id : 0, // Date.now() ids are client-only
        amount: Number(p.amount || 0),
        mode: PAYMENT_MODE_MAP[p.mode] ?? "CASH",
        paymentDate: p.date,
        description: p.description,
        bankId: p.bankId ?? 0,
        cashAccountId: p.cashAccountId ?? 0,
      })),
    };

    try {
      const res = await AddEstimate(payload);
      setEstimateId(res?.data?.id ?? estimateId);
      Swal.fire({ icon: "success", title: "Estimate saved", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed to save estimate" });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <NewEstimate
        eventData={eventData}
        loading={loading}
        estimateDate={estimateDate}
        onEstimateDateChange={setEstimateDate}
        statusType={statusType}
        onStatusTypeChange={setStatusType}
        selectedFunctionId={selectedFunctionId}
        onFunctionChange={setSelectedFunctionId}
        onSave={handleSave}
      />
      <EstimateItems items={items} onItemsChange={setItems} summary={summary} onSummaryChange={setSummary} subtotal={subtotal} amountAfterDiscount={amountAfterDiscount} />
      <PaymentDetails payments={payments} onPaymentsChange={setPayments} notes={notes} onNotesChange={setNotes} grandTotal={grandTotal} onSave={handleSave} />
    </div>
  );
};

export default QuotationDashboard;