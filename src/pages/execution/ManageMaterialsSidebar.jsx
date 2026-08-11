import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
// API integration intentionally removed for now — Save just calls onSaved
// with the locally selected list. Wire up a real "Manage Raw Materials"
// save endpoint here later.

/**
 * ManageMaterialsSidebar
 * ------------------------------------------------------------------
 * Slide-in sidebar modal (right-docked) used to attach inventory
 * categories to a single decoration/execution item.
 *
 * Props
 *  - open      : boolean              controls visibility
 *  - item      : { id, name } | null  the execution item being edited
 *  - materials : string[]             full list of selectable material categories
 *  - selected  : string[]             material categories already checked for `item`
 *  - onClose   : () => void
 *  - onSaved   : (item, selectedList: string[]) => void   called after a successful save
 */
export default function ManageMaterialsSidebar({
  open,
  item,
  materials = [],
  selected = [],
  onClose,
  onSaved,
}) {
  const [checked, setChecked] = useState(new Set(selected));
  const [query, setQuery] = useState("");

  // Reset local selection whenever a new item is opened
  useEffect(() => {
    if (open) {
      setChecked(new Set(selected));
      setQuery("");
    }
  }, [open, item, selected]);

  const toggle = (name) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = materials.filter((m) =>
    m.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = () => {
    if (!item) return;
    const selectedList = Array.from(checked);
    // Local-only save — no API call for now.
    onSaved?.(item, selectedList);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Manage raw materials"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Manage Raw Materials
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Inventory items for current decoration selection
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pt-4">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search inventory repository..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Available Materials
              </p>
              <ul className="flex flex-col gap-2.5">
                {filtered.map((name) => {
                  const isChecked = checked.has(name);
                  return (
                    <li key={name}>
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          isChecked
                            ? "border-rose-200 bg-rose-50/60"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(name)}
                          className="peer sr-only"
                        />
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition ${
                            isChecked
                              ? "border-primary bg-primary"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 12 10"
                              className="h-2.5 w-2.5 fill-none stroke-white"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 5l3.2 3.2L11 1" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={
                            isChecked
                              ? "font-medium text-gray-800"
                              : "text-gray-600"
                          }
                        >
                          {name}
                        </span>
                      </label>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="py-8 text-center text-sm text-gray-400">
                    No materials match "{query}"
                  </li>
                )}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-950"
              >
                Save Materials
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}