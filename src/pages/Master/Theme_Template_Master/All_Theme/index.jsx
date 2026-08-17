import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // TODO: confirm routing lib/path used in this app
import {
  Search,
  Plus,
  UploadCloud,
  Eye,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { getallthememaster, getbyidthememaster, deletetheme } from "@/services/apiServices"; // TODO: confirm real deletetheme function name — not yet given
import { getalltheme } from "@/services/apiServices"; // modules/tabs list (/template-module/list)
import { confirmDelete, showApiResult, showApiError } from "@/utils/swalHelpers";
import { ContentLoader } from "@/components/loaders/ContentLoader";
import { AddTheme } from "./AddTheme"; // TODO: confirm actual path/filename

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const MenuReportThemesPage = () => {
  const [tabs, setTabs] = useState([]);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null); // set once tabs load
  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  const debounceRef = useRef(null);
  const sentinelRef = useRef(null);
  const tabsScrollRef = useRef(null);

  const hasMore = themes.length < totalElements;

  // Load the template modules that become the tabs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTabsLoading(true);
      try {
        const res = await getalltheme({
          isAutoAssign: null,
          nameEnglish: "",
          page: 0,
          size: 50, // TODO: paginate this properly if there can be more than ~50 modules
          sortBy: "id",
          sortDirection: "DESC",
        });
        const list = res?.data?.data?.content ?? [];
        if (cancelled) return;
        setTabs(list);
        if (list.length) setActiveTab(list[0].id);
      } catch (err) {
        showApiError(err, { title: "Failed to load theme categories" });
      } finally {
        if (!cancelled) setTabsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchThemes = useCallback(
    async (pageToLoad, { append } = {}) => {
      if (!activeTab) return;
      append ? setLoadingMore(true) : setLoading(true);
      try {
        const res = await getallthememaster({
          nameEnglish: search,
          page: pageToLoad,
          size: PAGE_SIZE,
          sortBy: "id",
          sortDirection: "DESC",
          templateModuleId: activeTab,
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
    [search, activeTab]
  );

  // Refetch page 0 whenever the active tab changes
  useEffect(() => {
    fetchThemes(0, { append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Debounced refetch on search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchThemes(0, { append: false });
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Infinite scroll: load next page when the sentinel div enters the viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchThemes(page + 1, { append: true });
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchThemes, hasMore, loading, loadingMore, page]);

  // TODO: no count field (like the 253/10/5/4 badges in your screenshot)
  // appears anywhere on the module objects. Badges omitted until confirmed.

  const handleDelete = async (theme) => {
    const confirmed = await confirmDelete(theme.name);
    if (!confirmed) return;
    try {
      const res = await deletetheme(theme.id);
      showApiResult(res, { onSuccess: () => fetchThemes(0, { append: false }) });
    } catch (err) {
      showApiError(err, { title: "Delete Failed" });
    }
  };

  const scrollTabs = (dir) => {
    tabsScrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const handleAddTheme = () => {
    // pre-fill templateModuleId with the tab (Theme) the user is currently
    // viewing; templateMappingId (Theme Type Master) still needs picking
    // since it's scoped/dependent on the module and can't be assumed
    setEditingTheme({ templateModuleId: activeTab });
    setModalOpen(true);
  };

  const handleEditTheme = async (theme) => {
    try {
      const res = await getbyidthememaster(theme.id);
      const full = res?.data?.data ?? theme;
      setEditingTheme(full);
      setModalOpen(true);
    } catch (err) {
      showApiError(err, { title: "Failed to load theme" });
    }
  };

  const handleModalSave = () => {
    setModalOpen(false);
    setEditingTheme(null);
    fetchThemes(0, { append: false });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu Reportaa Themes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover unique designs, crafted for your reports.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-500">Menu Reportaa Themes</span>
          <button
            type="button"
            className="ml-3 flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            onClick={() => {}} // TODO: wire "Create New" navigation/action
          >
            <Plus size={16} />
            Create New
          </button>
        </div>
      </div>

      {/* Search + Add Theme */}
      <div className="flex items-center justify-between gap-3 mt-5 mb-6">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-900"
          onClick={handleAddTheme}
        >
          <UploadCloud size={16} />
          Add Theme
        </button>
      </div>

      {/* Tabs — horizontally scrollable */}
      <div className="relative border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => scrollTabs(-1)}
          aria-label="Scroll tabs left"
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white to-transparent pr-4 pl-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft size={18} />
        </button>
        <div
          ref={tabsScrollRef}
          className="flex items-center gap-8 overflow-x-auto scroll-smooth px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabsLoading ? (
            <div className="flex gap-8 py-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-28 shrink-0 animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : (
            tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.nameEnglish}
              </button>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={() => scrollTabs(1)}
          aria-label="Scroll tabs right"
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white to-transparent pl-4 pr-1 text-gray-400 hover:text-gray-600"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="min-h-[300px] relative">
          <ContentLoader />
        </div>
      ) : themes.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          No themes found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                onDelete={() => handleDelete(theme)}
                onEdit={() => handleEditTheme(theme)}
                onPreview={() => {}} // TODO: wire preview action
              />
            ))}
          </div>

          {/* infinite-scroll sentinel */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="flex justify-center py-6 text-sm text-gray-400">Loading more...</div>
          )}
        </>
      )}

      <AddTheme
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTheme(null);
        }}
        onSave={handleModalSave}
        initialData={editingTheme}
      />
    </div>
  );
};

const ThemeCard = ({ theme, onDelete, onEdit, onPreview }) => (
  <div className="group">
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
      {/* No image field exists anywhere in the confirmed /template-master/list
          response (id, templateModuleId, templateModuleName, templateMappingId,
          templateMappingName, name, description, backOfficeDescription, price,
          isDefault) — this data model has no theme preview image at all. */}
      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
        No preview
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <IconButton icon={Eye} onClick={onPreview} />
        <IconButton icon={Pencil} onClick={onEdit} iconClassName="text-blue-600" />
        <IconButton icon={Trash2} onClick={onDelete} iconClassName="text-red-500" />
      </div>
    </div>
    <p className="mt-3 text-sm font-semibold text-primary">{theme.name}</p>
    <p className="text-xs text-gray-400">{theme.templateMappingName}</p>
    {theme.isDefault && (
      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
        Default
      </span>
    )}
  </div>
);

const IconButton = ({ icon: Icon, onClick, iconClassName = "text-gray-600" }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white"
  >
    <Icon size={15} className={iconClassName} />
  </button>
);

export { MenuReportThemesPage };