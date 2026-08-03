import { useMemo, useState } from "react";
import { Search, Plus, Sparkles } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import {
  ESTIMATE_TABLE_DATA,
  getEstimateColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";

const EstimateItems = () => {
  const [search, setSearch] = useState("");
  const [taxType, setTaxType] = useState("TDS");

  const filteredData = useMemo(() => {
    return ESTIMATE_TABLE_DATA.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = getEstimateColumns({
    onEdit: (row) => console.log("Edit", row),
    onDelete: (row) => console.log("Delete", row),
  });

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
            onClick={() => console.log("Add")}
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

            <button className="text-primary font-semibold">
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
            value="₹ 2,92,500"
            valueClass="font-bold text-dark"
          />

          <SummaryInput
            label="Haldi Decoration"
            defaultValue="0"
          />

          <SummaryInput
            label="Reception Gala"
            defaultValue="0"
          />

          <SummaryInput
            label="Discount"
            defaultValue="12500"
          />

          <div className="border-t"></div>

          <SummaryRow
            label="Amount After Discount"
            value="₹ 2,80,000"
            valueClass="text-primary font-bold"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryInput
              label="Cash Payment"
              defaultValue="0"
            />

            <SummaryInput
              label="Cheque Amount"
              defaultValue="0"
            />
          </div>

          {/* GST */}

          <div className="rounded-lg bg-light-active border border-primary-clarity p-4 space-y-3">

            <GSTRow
              label="CGST"
              percent="9"
              amount="₹25,200"
            />

            <GSTRow
              label="SGST"
              percent="9"
              amount="₹25,200"
            />

            <GSTRow
              label="IGST"
              percent="0"
              amount="₹0"
            />

            <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">

              <span className="text-sm font-medium">
                Tax Type
              </span>

              <div className="flex overflow-hidden rounded-md border bg-gray-200 p-1 gap-3">

                <button
                  onClick={() => setTaxType("TDS")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    taxType === "TDS"
                      ? "bg-light text-dark"
                      : "text-gray-500 hover:text-dark"
                  }`}
                >
                  TDS
                </button>

                <button
                  onClick={() => setTaxType("TCS")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    taxType === "TCS"
                      ? "bg-light text-dark"
                      : "text-gray-500 hover:text-dark"
                  }`}
                >
                  TCS
                </button>

              </div>

            </div>

            <SummaryInput
              label={`${taxType} Amount`}
              defaultValue="0"
              showRupee={false}
            />

            <SummaryInput
              label="Round Off"
              defaultValue="0"
               showRupee={false}
            />

          </div>

          <div className="flex items-center justify-between rounded-lg bg-success-lighter px-4 py-3">

            <span className="font-medium text-success">
              Cheque Amount (Incl. GST)
            </span>

            <span className="font-bold text-success">
              ₹0.00
            </span>

          </div>

          <div className="flex items-center justify-between border-t-2 border-primary-clarity pt-5">
 
            <h4 className="text-xl font-bold text-dark">
              Grand Total
            </h4>

            <h2 className="text-2xl font-bold text-primary">
              ₹3,30,400.00
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
  defaultValue,
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
        defaultValue={defaultValue}
        className={`h-10 w-full rounded-lg border outline-none focus:border-primary border-primary-clarity ${
          showRupee
            ? "pl-8 pr-3 text-right"
            : "px-3 text-right h-7"
        }`}
      />
    </div>
  </div>
);
const GSTRow = ({ label, percent, amount }) => (
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
          defaultValue={percent}
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
