import { useMemo, useState } from "react";
import { Search, Plus, Sparkles } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import {
  getEstimateColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const EstimateItems = ({
  items = [],
  onItemsChange,
  summary,
  onSummaryChange,
  subtotal = 0,
  amountAfterDiscount = 0,
}) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return items.filter((item) =>
      (item.description ?? item.itemName ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  const updateSummary = (field, value) =>
    onSummaryChange((prev) => ({ ...prev, [field]: value }));

  const handleDelete = (row) => {
    onItemsChange(items.filter((i) => i !== row));
  };

  const handleClearAll = () => {
    onItemsChange([]);
  };

  const handleAdd = () => {
    // TODO: wire to your item picker / search-select flow
    onItemsChange([
      ...items,
      {
        id: Date.now(),
        rawItemId: null,
        description: search || "New Item",
        qty: 1,
        rate: 0,
        discountRate: 0,
        size: "",
        sqFt: "",
      },
    ]);
    setSearch("");
  };

  const columns = getEstimateColumns({
    onEdit: (row) => console.log("Edit", row),
    onDelete: handleDelete,
  });

  const cgstAmount = (amountAfterDiscount * Number(summary.cgst || 0)) / 100;
  const sgstAmount = (amountAfterDiscount * Number(summary.sgst || 0)) / 100;
  const igstAmount = (amountAfterDiscount * Number(summary.igst || 0)) / 100;

  const chequeInclGst =
    Number(summary.chequeAmount || 0) +
    (Number(summary.chequeAmount || 0) *
      (Number(summary.cgst || 0) + Number(summary.sgst || 0) + Number(summary.igst || 0))) /
      100;

  const grandTotal =
    amountAfterDiscount +
    cgstAmount +
    sgstAmount +
    igstAmount +
    Number(summary.taxAmount || 0) +
    Number(summary.roundOff || 0);

  return (
    <div className="space-y-5">
      {/* Quick Add Items */}
      <div className="rounded-lg border bg-light-clarity p-5 mt-5">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Quick Add Items
        </label>

        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              placeholder="Search decor, lighting, catering..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-dashed border-dark pl-10 pr-4 text-sm outline-none focus:border-primary text-dark"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-6 font-medium hover:bg-gray-50"
          >
            <Plus size={16} />
            Add
          </button>

          {/* Generate Button */}
          <button
            onClick={() => console.log("Generate")}
            className="flex h-11 items-center justify-center gap-2 text-sm rounded-lg bg-primary px-6 font-medium text-white hover:opacity-90"
          >
            <Sparkles size={16} />
            Generate Item
          </button>
        </div>
      </div>

      {/* Estimate Table */}
      <div className="rounded-lg border bg-light">
        <div className="flex flex-col items-start justify-between gap-3 border-b px-6 py-5 sm:flex-row sm:items-center">
          <h5 className="font-semibold text-dark">Estimate Items</h5>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              {filteredData.length} Items Added
            </span>

            <button onClick={handleClearAll} className="text-primary font-semibold">
              Clear All
            </button>
          </div>
        </div>

        <TableComponent
          columns={columns}
          data={filteredData}
          tableData={filteredData}
          paginationSize={DEFAULT_PAGINATION_SIZE}
          defaultSorting={DEFAULT_SORTING}
        />
      </div>

      {/* Estimate Summary */}
      <div className="rounded-lg border border-primary-clarity bg-light p-6">
        <h4 className="mb-6 text-lg font-bold text-dark">
          Estimate Summary
        </h4>

        <div className="flex justify-end">
          <div className="w-full max-w-2xl space-y-4 text-sm">

            <SummaryRow
              label="Subtotal"
              value={`₹ ${subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              valueClass="font-bold text-dark"
            />

            <SummaryInput
              label="Discount"
              value={summary.discount}
              onChange={(v) => updateSummary("discount", v)}
            />

            <div className="border-t"></div>

            <SummaryRow
              label="Amount After Discount"
              value={`₹ ${amountAfterDiscount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              valueClass="text-primary font-bold"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SummaryInput
                label="Cash Payment"
                value={summary.cashAmount}
                onChange={(v) => updateSummary("cashAmount", v)}
              />

              <SummaryInput
                label="Cheque Amount"
                value={summary.chequeAmount}
                onChange={(v) => updateSummary("chequeAmount", v)}
              />
            </div>

            {/* GST */}

            <div className="rounded-lg bg-light-active border border-primary-clarity p-4 space-y-3">

              <GSTRow
                label="CGST"
                percent={summary.cgst}
                onChange={(v) => updateSummary("cgst", v)}
                amount={`₹${cgstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              />

              <GSTRow
                label="SGST"
                percent={summary.sgst}
                onChange={(v) => updateSummary("sgst", v)}
                amount={`₹${sgstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              />

              <GSTRow
                label="IGST"
                percent={summary.igst}
                onChange={(v) => updateSummary("igst", v)}
                amount={`₹${igstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              />

              <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">

                <span className="text-sm font-medium">
                  Tax Type
                </span>

                <div className="flex overflow-hidden rounded-md border bg-gray-200 p-1 gap-3">

                  <button
                    onClick={() => updateSummary("taxType", "TDS")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      summary.taxType === "TDS"
                        ? "bg-light text-dark"
                        : "text-gray-500 hover:text-dark"
                    }`}
                  >
                    TDS
                  </button>

                  <button
                    onClick={() => updateSummary("taxType", "TCS")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      summary.taxType === "TCS"
                        ? "bg-light text-dark"
                        : "text-gray-500 hover:text-dark"
                    }`}
                  >
                    TCS
                  </button>

                </div>

              </div>

              <SummaryInput
                label={`${summary.taxType} Amount`}
                value={summary.taxAmount}
                onChange={(v) => updateSummary("taxAmount", v)}
                showRupee={false}
              />

              <SummaryInput
                label="Round Off"
                value={summary.roundOff}
                onChange={(v) => updateSummary("roundOff", v)}
                showRupee={false}
              />

            </div>

            <div className="flex items-center justify-between rounded-lg bg-success-lighter px-4 py-3">

              <span className="font-medium text-success">
                Cheque Amount (Incl. GST)
              </span>

              <span className="font-bold text-success">
                ₹{chequeInclGst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>

            </div>

            <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">

              <h4 className="text-xl font-bold text-dark">
                Grand Total
              </h4>

              <h2 className="text-2xl font-bold text-primary">
                ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </h2>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-gray-700">{label}</span>

    <span className={`font-medium ${valueClass}`}>
      {value}
    </span>
  </div>
);

const SummaryInput = ({
  label,
  value,
  onChange,
  showRupee = true,
}) => (
  <div className="flex items-center justify-between gap-5">
    <label className="text-sm text-gray-600">
      {label}
    </label>

    <div className="relative w-40">
      {showRupee && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          ₹
        </span>
      )}

      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`h-10 w-full rounded-lg border outline-none focus:border-primary border-primary-clarity ${
          showRupee
            ? "pl-8 pr-3 text-right"
            : "px-3 text-right h-7"
        }`}
      />
    </div>
  </div>
);

const GSTRow = ({ label, percent, onChange, amount }) => (
  <div className="flex items-center">
    {/* Label */}
    <span className="w-24 text-xs text-gray-600 font-medium">
      {label}
    </span>

    {/* Right Side */}
    <div className="ml-auto flex items-center gap-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={percent ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-7 w-16 rounded border border-primary-clarity text-center outline-none focus:border-primary"
        />

        <span className="text-sm font-medium text-gray-600">
          %
        </span>
      </div>

      <span className="w-24 text-right font-semibold text-gray-700">
         {amount}
      </span>
    </div>
  </div>
);

export default EstimateItems;