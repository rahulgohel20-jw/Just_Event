import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Files,
  FileText,
  Plus,
  SendHorizonal,
  Trash2,
  Wallet,
} from "lucide-react";

const paymentModes = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "UPI",
  "Credit Card",
];

const PaymentDetails = () => {
  const grandTotal = 330400;

  const [payments, setPayments] = useState([
    {
      id: 1,
      amount: 50000,
      mode: "Bank Transfer",
      date: "2024-10-15T10:00",
      description: "",
    },
  ]);

  const [notes, setNotes] = useState("");

  const addPayment = () => {
    setPayments((prev) => [
      ...prev,
      {
        id: Date.now(),
        amount: "",
        mode: "Bank Transfer",
        date: "",
        description: "",
      },
    ]);
  };

  const removePayment = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePayment = (id, field, value) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalPaid = useMemo(() => {
    return payments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [payments]);

  const remaining = grandTotal - totalPaid;

  return (
    <div className="space-y-6 mt-6">
      <div className="rounded-xl border bg-light p-6">

        {/* Header */}

        <div className="flex items-center justify-between mb-3">

          <h3 className="text-lg text-dark font-semibold">
            Payment Details
          </h3>

          <button
            onClick={addPayment}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} />
            Add Advance Payment
          </button>

        </div>

        {/* Payment Cards */}

        <div className="space-y-5 rounded-xl">

          {payments.map((payment, index) => (
            <div
              key={payment.id}
              className="rounded-xl border border-primary-clarity p-4"
            >
              {/* Title */}

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-2">

                  <CircleCheck
                    size={20}
                    className="text-success"
                  />

                  <h4 className="font-semibold my-auto text-dark-light">
                    Advance Payment #{index + 1}
                  </h4>

                </div>

                <div className="relative w-full lg:w-40">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) =>
                      updatePayment(
                        payment.id,
                        "amount",
                        e.target.value
                      )
                    }
                    className="h-10 w-full rounded-lg border bg-light-active text-sm pl-8 pr-3 outline-none focus:border-primary"
                  />

                </div>

              </div>

              {/* Mode */}

              <div className="mt-5">

                <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
                  Payment Mode
                </label>

                <div className="relative">

                  <select
                    value={payment.mode}
                    onChange={(e) =>
                      updatePayment(
                        payment.id,
                        "mode",
                        e.target.value
                      )
                    }
                    className="h-11 w-full appearance-none rounded-lg border px-3 outline-none text-sm"
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                </div>

              </div>

              {/* Bottom */}

              <div className="mt-5 grid gap-5 lg:grid-cols-2">

                <div>

                  <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
                    Payment Date & Time
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="datetime-local"
                      value={payment.date}
                      onChange={(e) =>
                        updatePayment(
                          payment.id,
                          "date",
                          e.target.value
                        )
                      }
                      className="h-11 w-full rounded-lg border pl-10 pr-3 outline-none text-dark text-sm"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-1 block text-[11px] font-semibold uppercase text-gray-500">
                    Payment Description
                  </label>

                  <div className="relative">

                    <FileText
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />

                    <input
                      value={payment.description}
                      onChange={(e) =>
                        updatePayment(
                          payment.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter payment description"
                      className="h-11 w-full rounded-lg border pl-10 pr-3 outline-none text-sm"
                    />

                  </div>

                </div>

              </div>

              <div className="mt-4 flex justify-end">

                <button
                  onClick={() => removePayment(payment.id)}
                  className="flex items-center gap-2 rounded bg-danger px-3 py-2 text-xs font-semibold text-white"
                >
                  <Trash2 size={14} />
                  REMOVE
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Summary */}

        <div className="mt-6 border-t pt-6">

          <div className="flex items-center justify-between">

            <span className="font-semibold text-success uppercase text-xs">
              Total Paid
            </span>

            <span className="font-bold text-green-700">
              ₹ {totalPaid.toLocaleString()}
            </span>

          </div>

          <div className="mt-6 flex items-center justify-between rounded border border-orange-200 bg-danger-lighter px-5 py-4">

            <div className="flex items-center gap-2 text-orange-700 font-semibold uppercase text-xs">

              <Wallet size={16} />

              Remaining Payment

            </div>

            <span className="text-2xl font-bold text-orange-700">
              ₹ {remaining.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      {/* Notes */}

      <div className="rounded-xl border bg-light p-6">

        <h4 className="mb-5 font-semibold flex gap-3 items-center text-dark text-sm">
            <FileText size={16}/>
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
            <button className="border border-primary-clarity rounded-lg px-6 py-2 text-gray-900 font-semibold">Save Draft</button>
        </div>
        <div className="flex gap-5">
            <button className="flex gap-2 py-2 px-6 border border-primary-clarity rounded-lg text-xs items-center text-dark font-bold"><Files size={15}/>Download PDF</button>
            <button className="flex gap-2 py-2 px-6 border border-primary-clarity rounded-lg text-xs items-center text-light bg-primary"><SendHorizonal size={15}/>Send to Client</button>
        </div>
      </div>

    </div>
  );
};

export default PaymentDetails;