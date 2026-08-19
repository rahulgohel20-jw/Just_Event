import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { getallmenuitem } from "@/services/apiServices";
import {
  getEstimateColumns,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_SORTING,
} from "./constant";
import { AddMenuitemmaster } from "../../../Master/MenuItemMaster/menuitemmaster/AddMenuitemmaster";

const SUGGESTION_PAGE_SIZE = 8;

const EstimateItems = ({
  items = [],
  onItemsChange,
  summary,
  onSummaryChange,
  subtotal = 0,
  amountAfterDiscount = 0,
}) => {
  const [search, setSearch] = useState("");

  // Quick Add dropdown state
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const userId = localStorage.getItem("userId")
  // Generate Item -> Add Menu Item modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return items.filter((item) =>
      (item.itemName ?? item.description ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  // Builds a new table row. Field names match getEstimateColumns AND the
  // EventEstimateItemRequestDto shape (menuItemId, discount, discountRate,
  // qty, rate, size, sqFt) so nothing needs remapping at save time.
  const buildItemRow = ({
    menuItemId = null,
    itemName = "New Item",
    description = "",
    image = "",
    qty = 1,
    rate = 0,
    discountRate = 0,
    size = "",
    sqft = "",
  }) => ({
    id: Date.now() + Math.floor(Math.random() * 1000), // client-only temp id
    menuItemId,
    itemName,
    description: description || itemName,
    image,
    qty: Number(qty || 0),
    rate: Number(rate || 0),
    discountRate: Number(discountRate || 0),
    size,
    sqft,
    sqFt: sqft, // alias for the payload's exact casing
  });

  // Applies a single field edit (from the table's inline inputs) to an item
  const updateItemField = (id, field, value) => {
    onItemsChange(
      items.map((item) => {
        if (item.id !== id) return item;
        const isNumericField = ["qty", "rate", "discountRate"].includes(field);
        const nextValue = isNumericField ? value : value;
        const updated = { ...item, [field]: nextValue };
        if (field === "sqft") updated.sqFt = value; // keep alias in sync
        return updated;
      })
    );
  };

  const handleDescriptionChange = (id, value) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, description: value } : item))
    );
  };

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
        userId:userId,
      });

      const body = res?.data ?? res;
      // Response shape: { data: { content, last, totalPages, ... }, msg, success }
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
    const t = setTimeout(() => {
      fetchMenuItems(search, 0, false);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFocus = () => {
    setShowSuggestions(true);
    if (!hasLoadedOnce && !searching) {
      fetchMenuItems(search, 0, false);
    }
  };

  const handleLoadMore = () => {
    if (isLastPage || loadingMore) return;
    fetchMenuItems(search, page + 1, true);
  };

  const updateSummary = (field, value) =>
    onSummaryChange((prev) => ({ ...prev, [field]: value }));

  const handleDelete = (row) => {
    onItemsChange(items.filter((i) => i !== row));
  };

  const handleClearAll = () => {
    onItemsChange([]);
  };

  const handleImageUpload = (id, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onItemsChange(
      items.map((item) =>
        item.id === id
          ? { ...item, image: previewUrl, imageFile: file }
          : item
      )
    );
  };

  // Adds a single item picked from the Quick Add suggestion dropdown
  const addMenuItemToEstimate = (menuItem) => {
    onItemsChange([
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

  // Called by AddMenuitemmaster's onSave once the new menu item is created
  const handleMenuItemCreated = (savedItem) => {
    if (!savedItem) return;
    onItemsChange([
      ...items,
      buildItemRow({
        menuItemId: savedItem.id,
        itemName: savedItem.nameEnglish,
        description: savedItem.description,
        rate: savedItem.rate ?? savedItem.price ?? 0,
      }),
    ]);
  };

  // Fallback: manual free-text add (Add button)
  const handleAdd = () => {
    onItemsChange([
      ...items,
      buildItemRow({
        menuItemId: null,
        itemName: search || "New Item",
      }),
    ]);
    setSearch("");
    setShowSuggestions(false);
  };

  const columns = getEstimateColumns({
    onEdit: (row) => console.log("Edit", row),
    onDelete: handleDelete,
    onDescriptionChange: handleDescriptionChange,
    onImageUpload: handleImageUpload,
    onFieldChange: updateItemField,
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
                        {(m.rate ?? m.price) != null && (
                          <span className="text-gray-500">
                            ₹{m.rate ?? m.price}
                          </span>
                        )}
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
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No items found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border bg-white px-6 font-medium hover:bg-gray-50"
          >
            <Plus size={16} />
            Add
          </button>

          {/* Generate Button -> opens Add Menu Item modal */}
          <button
            onClick={() => setGenerateModalOpen(true)}
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

      <AddMenuitemmaster
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSave={handleMenuItemCreated}
      />
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