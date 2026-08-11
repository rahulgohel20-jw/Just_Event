import React, { useCallback, useEffect, useRef, useState } from "react";
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
}) => {
  const [options, setOptions] = useState(initialOption ? [initialOption] : []);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const doMapOption = useCallback(
    (r) => (mapOption ? mapOption(r) : { value: r[valueKey], label: r[labelKey] }),
    [mapOption, valueKey, labelKey]
  );

  const mergeOptions = (prev, incoming, append) => {
    const base = append ? prev : [...(initialOption ? [initialOption] : []), ...extraOptions];
    const combined = [...base, ...incoming];
    const map = new Map(combined.map((o) => [o.value, o]));
    return Array.from(map.values());
  };

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

        setOptions((prev) => mergeOptions(prev, mapped, append));
        setHasMore(data ? !data.last : false);
      } catch (err) {
        console.error("Failed to load options:", err);
        if (!append) setOptions([...(initialOption ? [initialOption] : []), ...extraOptions]);
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

  // keep locally-added options (e.g. just-created vendor) visible without a refetch
  useEffect(() => {
    if (!extraOptions.length) return;
    setOptions((prev) => mergeOptions(prev, [], true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraOptions]);

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
      const full = options.find((o) => o.value === val);
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
      options={options}
      placeholder={placeholder}
      size="large"
      className="w-full custom-category-select"
      disabled={disabled}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "No results"}
    />
  );
};

export default PaginatedSearchSelect;