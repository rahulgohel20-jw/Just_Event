import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  FileSpreadsheet,
  FileText,
  Image,
  DollarSign,
  KeyRound,
  Loader2,
  Save,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getalluserwisereportkey, updatereportkey } from "@/services/apiServices";
import { showApiError, showApiResult } from "@/utils/swalHelpers";

// Maps known report key names to an icon; falls back to a generic key icon
const ICONS_BY_NAME = {
  "conpany info": Building2,
  "company info": Building2,
  excel: FileSpreadsheet,
  doc: FileText,
  price: DollarSign,
  "category image": Image,
};

const getIconFor = (name) =>
  ICONS_BY_NAME[(name || "").trim().toLowerCase()] || KeyRound;

const UserReportKeyPage = () => {
  const [reportKeys, setReportKeys] = useState([]);
  const [originalKeys, setOriginalKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchReportKeys();
  }, []);

  const fetchReportKeys = async (searchValue = "") => {
    setLoading(true);
    try {
      const res = await getalluserwisereportkey({
        name: searchValue,
        page: 0,
        size: 100,
        sortBy: "id",
        sortDirection: "DSEC",
        templateMappingId: null,
        userId,
      });
      const body = res?.data ?? res;
      const list = body?.data?.content ?? body?.data ?? [];
      setReportKeys(list);
      setOriginalKeys(list);
    } catch (err) {
      console.error("Failed to load report keys:", err);
      showApiError(err, { title: "Failed to load report keys" });
      setReportKeys([]);
      setOriginalKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchReportKeys(value);
  };

  // local toggle only - no API call until Save is pressed
  const handleToggle = (item) => {
    setReportKeys((prev) =>
      prev.map((rk) =>
        rk.reportKeyId === item.reportKeyId
          ? { ...rk, isEnabled: !rk.isEnabled }
          : rk
      )
    );
  };

  const hasChanges = useMemo(() => {
    if (reportKeys.length !== originalKeys.length) return true;
    return reportKeys.some((rk) => {
      const original = originalKeys.find(
        (o) => o.reportKeyId === rk.reportKeyId
      );
      return !original || original.isEnabled !== rk.isEnabled;
    });
  }, [reportKeys, originalKeys]);

  const enabledCount = reportKeys.filter((rk) => rk.isEnabled).length;

  const handleSave = async () => {
    const payload = reportKeys.map((rk) => ({
      id: rk.id ?? 0,
      isEnabled: rk.isEnabled,
      reportKeyId: rk.reportKeyId,
    }));

    setSaving(true);
    try {
      const res = await updatereportkey(payload, userId);

      showApiResult(res, {
        successTitle: "Updated",
        fallbackSuccess: "Report keys updated successfully.",
        errorTitle: "Update failed",
        onSuccess: () => {
          fetchReportKeys(search);
        },
      });
    } catch (err) {
      console.error("Failed to update report keys:", err);
      showApiError(err, { title: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-6">
       
        <h1 className="text-2xl font-bold text-gray-900">
          Report KeyConfiguration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose which sections appear on your generated reports.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white max-w-xl overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7E5EA] text-primary">
              <SlidersHorizontal size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Report keys
              </h2>
              <p className="text-xs text-gray-400">
                {loading ? "Loading..." : `${enabledCount} of ${reportKeys.length} enabled`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !hasChanges}
            className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium rounded-lg px-4 py-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Save
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search report keys..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="px-2 py-2">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : reportKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                <KeyRound size={18} />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {search ? "No matching report keys" : "No report keys found"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search
                  ? `Nothing matches "${search}".`
                  : "Report keys will show up here once available."}
              </p>
            </div>
          ) : (
            <div>
              {reportKeys.map((item) => {
                const Icon = getIconFor(item.reportKeyName);
                return (
                  <label
                    key={item.reportKeyId}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          item.isEnabled
                            ? "bg-[#F7E5EA] text-primary"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon size={15} />
                      </div>
                      <span className="text-sm text-gray-700 truncate">
                        {item.reportKeyName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                        item.isEnabled ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Unsaved-changes footer */}
        {hasChanges && !loading && (
          <div className="flex items-center justify-between px-6 py-3 bg-amber-50 border-t border-amber-100">
            <span className="text-xs text-amber-700 font-medium">
              You have unsaved changes
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              Save now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { UserReportKeyPage };