import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, X, ChevronDown } from "lucide-react";
import { getalltheme, getalladmintemplate, addupdateadmintemplate } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

// TODO: confirm "Nameplates" tab's own API/list — left as disabled placeholder for now
const SelectAssignThemeModal = ({ open, onClose, onAssign, userId }) => {
  const [activeMainTab, setActiveMainTab] = useState("themes"); // "themes" | "nameplates"

  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [moduleId, setModuleId] = useState(null);
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [submitting, setSubmitting] = useState(false);
const [selectedIds, setSelectedIds] = useState(new Set());

  const debounceRef = useRef(null);
  const sentinelRef = useRef(null);
  const listRef = useRef(null);

  const hasMore = themes.length < totalElements;
  const selectedModule = modules.find((m) => m.id === moduleId) ?? null;

  // load template modules (dropdown) once modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false; // FIX: was `true`, which made the whole fetch a no-op
    (async () => {
      setModulesLoading(true);
      try {
        const res = await getalltheme({
          isAutoAssign: null,
          nameEnglish: "",
          page: 0,
          size: 50,
          sortBy: "id",
          sortDirection: "DESC",
        });
        const list = res?.data?.data?.content ?? [];
        if (cancelled) return;
        setModules(list);
        if (list.length) setModuleId(list[0].id);
      } catch (err) {
        showApiError(err, { title: "Failed to load theme modules" });
      } finally {
        if (!cancelled) setModulesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // reset on open
  useEffect(() => {
  if (open) {
    setSearch("");
    setSelectedIds(new Set());
  }
}, [open]);
  const fetchThemes = useCallback(
    async (pageToLoad, { append } = {}) => {
      if (!moduleId || !userId) return;
      append ? setLoadingMore(true) : setLoading(true);
      try {
        const res = await getalladmintemplate({
          page: pageToLoad,
          size: PAGE_SIZE,
          sortBy: "template_master_id",
          sortDirection: "ASC",
          templateModuleId: moduleId,
          userId,
        });
        const data = res?.data?.data;
        const list = data?.content ?? [];
        setThemes((prev) => (append ? [...prev, ...list] : list));
        setTotalElements(data?.totalElements ?? list.length);
        setPage(pageToLoad);
      } catch (err) {
        showApiError(err, { title: "Failed to load themes" });
        if (!append) setThemes([]);
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [moduleId, userId]
  );

  useEffect(() => {
    if (open) fetchThemes(0, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, moduleId]);

  // NOTE: search isn't supported by getalladmintemplate's request shape shown —
  // if the API doesn't accept a name filter param, client-filter instead:
  const visibleThemes = search
    ? themes.filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()))
    : themes;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchThemes(page + 1, { append: true });
        }
      },
      { root: listRef.current, rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchThemes, hasMore, loading, loadingMore, page]);

  if (!open) return null;

  const handleAssign = async () => {
  const selectedThemes = themes.filter((t) => selectedIds.has(t.id));
  if (selectedThemes.length === 0) return;

  setSubmitting(true);
  try {
    const payload = selectedThemes.map((theme) => ({
      id: null,
      templateMasterId: theme.id,
    }));

    const res = await addupdateadmintemplate(payload, userId);
    showApiResult(res, {
      successTitle: "Assigned",
      fallbackSuccess: "Themes assigned successfully.",
      errorTitle: "Assign Failed",
      onSuccess: () => onAssign?.(selectedThemes),
    });
  } catch (err) {
    showApiError(err, { title: "Assign Failed" });
  } finally {
    setSubmitting(false);
  }
};
const toggleSelect = (id) => {
  setSelectedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Select Exclusive Design</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Main tabs */}
        <div className="flex gap-2 border-b border-gray-100 px-6 pt-3">
          <button
            type="button"
            onClick={() => setActiveMainTab("themes")}
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition ${
              activeMainTab === "themes"
                ? "bg-blue-900 text-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Themes
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab("nameplates")}
            disabled
            title="Coming soon"
            className="rounded-t-md px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed"
          >
            Nameplates
          </button>
        </div>

        {activeMainTab === "themes" && (
          <>
            {/* Module dropdown + search */}
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="relative w-48">
                <button
                  type="button"
                  onClick={() => setModuleDropdownOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="truncate">
                    {modulesLoading
                      ? "Loading..."
                      : selectedModule?.nameEnglish ?? "Select module"}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {moduleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {modules.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                       onClick={() => {
  setModuleId(m.id);
  setModuleDropdownOpen(false);
  setSelectedIds(new Set());
}}
                        className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                          m.id === moduleId ? "text-blue-900 font-medium" : "text-gray-700"
                        }`}
                      >
                        {m.nameEnglish}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search theme..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Grid */}
            <div ref={listRef} className="max-h-96 overflow-y-auto px-6 pb-2">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                  Loading themes...
                </div>
              ) : visibleThemes.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                  No themes found.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4">
                   {visibleThemes.map((theme) => (
  <ThemeTile
    key={theme.id}
    theme={theme}
    selected={selectedIds.has(theme.id)}
    onSelect={() => toggleSelect(theme.id)}
  />
                    ))}
                  </div>
                  <div ref={sentinelRef} className="h-1" />
                  {loadingMore && (
                    <div className="py-4 text-center text-xs text-gray-400">Loading more...</div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
  type="button"
  onClick={handleAssign}
  disabled={selectedIds.size === 0 || submitting}
  className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
>
  {submitting
    ? "Assigning..."
    : `Assign Theme${selectedIds.size > 1 ? "s" : ""}${selectedIds.size ? ` (${selectedIds.size})` : ""}`}
</button>
        </div>
      </div>
    </div>
  );
};

const ThemeTile = ({ theme, selected, onSelect }) => {
  // an already-assigned theme (isSelected: true) can't be picked again
  const canSelect = theme.isSelected === false;

  return (
    <div
      onClick={() => canSelect && onSelect()}
      title={!canSelect ? "Already assigned" : undefined}
      className={`rounded-lg border p-1 transition ${
        !canSelect
          ? "cursor-not-allowed opacity-50 border-transparent"
          : selected
          ? "cursor-pointer border-blue-900 ring-2 ring-blue-900/30"
          : "cursor-pointer border-transparent hover:border-gray-200"
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50">
        {theme.frontPage ? (
          <img src={theme.frontPage} alt={theme.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
            No preview
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(theme.frontPage, "_blank"); // TODO: swap for proper preview modal if needed
          }}
          className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
        >
          <Eye size={12} className="text-gray-600" />
        </button>
      </div>
      <p className="mt-1.5 line-clamp-2 text-center text-xs font-medium text-gray-700">
        {theme.name}
      </p>
    </div>
  );
};

export { SelectAssignThemeModal };