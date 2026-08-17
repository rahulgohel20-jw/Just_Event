import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 100;

const PaginatedSearchSelect = ({
  fetchFn,
  extraParams = {},
  labelKey = "nameEnglish",
  valueKey = "id",
  searchParamName = "nameEnglish",
  sizeParamName = "pageSize", // ⚠️ party-master/list uses "size" — pass sizeParamName="size" for that API
  mapOption, // optional (record) => ({ value, label, ...anythingElse })
  extraOptions = [], // locally-added options (e.g. a vendor just created) merged in immediately
  value,
  onChange,
  onSelectOption, // (fullOptionObject) => void — fires alongside onChange with the whole option
  placeholder = "Select",
  initialOption,
  disabled = false,
  size = "large",       // antd size prop — pass "middle" if you don't need the h-14 look
  className = "",        // extra class(es) merged onto the Select, e.g. "h-14-select"
}) => {
  // Only holds items that came from the API (fetched pages). extraOptions and
  // initialOption are merged in at render time below, not stored here, so
  // they're reflected the instant they change — no effect-timing lag.
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const doMapOption = useCallback(
    (r) => (mapOption ? mapOption(r) : { value: r[valueKey], label: r[labelKey] }),
    [mapOption, valueKey, labelKey]
  );

  const loadOptions = useCallback(
    async (pageToLoad, searchText, append) => {
      setLoading(true);
      try {
       const res = await fetchFn({
  page: pageToLoad,
  [sizeParamName]: PAGE_SIZE,
  [searchParamName]: searchText,
  ...extraParams,
});
        const data = res?.data?.data;
        const records = data?.content ?? [];
        const mapped = records.map(doMapOption);

        setOptions((prev) => {
          const combined = append ? [...prev, ...mapped] : mapped;
          const map = new Map(combined.map((o) => [o.value, o]));
          return Array.from(map.values());
        });
        setHasMore(data ? !data.last : false);
      } catch (err) {
        console.error("Failed to load options:", err);
        if (!append) setOptions([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, extraParams, sizeParamName, searchParamName, doMapOption] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    setPage(0);
    loadOptions(0, "", false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Options actually rendered: fetched options + extraOptions + initialOption,
  // deduped by value. Computed fresh every render so a just-created item
  // (extraOptions) or a preselected item (initialOption) shows up and matches
  // `value` immediately, with no separate effect/render cycle needed.
  const displayOptions = useMemo(() => {
    const combined = [
      ...(initialOption ? [initialOption] : []),
      ...extraOptions,
      ...options,
    ];
    const map = new Map(combined.map((o) => [o.value, o]));
    return Array.from(map.values());
  }, [options, extraOptions, initialOption]);

  const handleSearch = (text) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      loadOptions(0, text, false);
    }, DEBOUNCE_MS);
  };

  const handlePopupScroll = (e) => {
    const { target } = e;
    const nearBottom = target.scrollTop + target.offsetHeight >= target.scrollHeight - 20;
    if (nearBottom && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(nextPage, search, true);
    }
  };

  const handleChange = (val) => {
    onChange?.(val);
    if (onSelectOption) {
      const full = displayOptions.find((o) => o.value === val);
      onSelectOption(full);
    }
  };

  return (
    <Select
      showSearch
      allowClear
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      filterOption={false}
      options={displayOptions}
      placeholder={placeholder}
      size={size}
      className={`w-full custom-category-select ${className}`}
      disabled={disabled}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "No results"}
    />
  );
};

export default PaginatedSearchSelect;