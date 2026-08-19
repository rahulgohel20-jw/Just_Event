import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InputNumber,
  Select,
  Button,
  Typography,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Save, Sparkles } from 'lucide-react';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import DateTimeField from '../../../components/form-inputs/DatePicker/DateTimeField';
import {
  getbyeventid,
  getalllistfuntionmaster,
  getAllClientMaster,
  getalllabourshift,
  getAllCategoryMaster,
  geteventagencydistriibution,
  addupdateeventagencydistribution,
} from '@/services/apiServices';
import { showApiResult, showApiError } from '@/utils/swalHelpers';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const { Title } = Typography;

const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;


const AsyncSearchSelect = ({ fetcher, value, onChange, placeholder, className, debounceMs = 300 }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetcher(query);
      setOptions((results || []).map((o) => ({ value: o.id, label: o.label })));
      setLoading(false);
    }, debounceMs);
  };

  return (
    <Select
      showSearch
      labelInValue
      allowClear
      value={value?.id ? { value: value.id, label: value.label } : undefined}
      placeholder={placeholder}
      className={className}
      style={{ width: '100%' }}
      filterOption={false}
      onSearch={handleSearch}
      onFocus={() => handleSearch('')}
      onChange={(opt) => onChange(opt ? { id: opt.value, label: opt.label } : { id: null, label: '' })}
      notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No matches" />}
      options={options}
    />
  );
};

let uid = 100;
const nextId = () => `id-${uid++}`;

const DATE_TIME_FORMAT = 'DD/MM/YYYY hh:mm A';
const DATE_ONLY_FORMAT = 'DD/MM/YYYY';

/* A single labour shift row — maps 1:1 to a labourShifts entry.
   Optionally seeded with a dayKey (DD/MM/YYYY) so a shift added from
   within an existing "day" group lands in that same group instead of
   falling into "Unscheduled". */
const makeShift = (dayKey) => ({
  id: null,
  _uid: nextId(),
  shiftMaster: { id: null, label: '', startTime: null },
  dateTime: dayKey && dayKey !== '__unscheduled__' ? `${dayKey} 12:00 AM` : '',
  price: 0,
  qty: 0,
});

/* An item = one category+party combo, maps 1:1 to an agencyDistributionDetails entry */
const makeItem = (category) => ({
  id: null,                 // real distribution-detail id, null = new
  _uid: nextId(),
  name: category?.label || 'New Labour',
  category: category?.id ?? null,
  categoryLabel: category?.label ?? '',
  labourName: { id: null, label: '' }, // -> partyId
  expanded: true,
  shifts: [makeShift()],
});

const itemTotals = (item) => {
  let qty = 0;
  let price = 0;
  item.shifts.forEach((s) => {
    qty += Number(s.qty || 0);
    price += Number(s.qty || 0) * Number(s.price || 0);
  });
  return { qty, price };
};

/* ------------------------------------------------------------------ */
/* Flatten items → agencyDistributionDetails for save, matching the    */
/* real backend schema exactly (no day grouping — it isn't persisted). */
/* ------------------------------------------------------------------ */
const flattenItemsToDetails = (items) =>
  items.map((item) => {
    const { qty: totalQty, price: totalPrice } = itemTotals(item);
    return {
      id: item.id ?? null,
      categoryId: item.category ?? 0,
      partyId: item.labourName?.id ?? 0,
      totalQty,
      totalPrice,
      labourShifts: item.shifts
        // drop rows the user never actually filled in — no shift picked, no price, no qty
        .filter((shift) => shift.shiftMaster?.id || Number(shift.price) > 0 || Number(shift.qty) > 0)
        .map((shift) => ({
          id: shift.id ?? null,
          shiftMasterId: shift.shiftMaster?.id ?? 0,
          dateTime: shift.dateTime,
          price: Number(shift.price || 0),
          qty: Number(shift.qty || 0),
          totalPrice: Number(shift.price || 0) * Number(shift.qty || 0),
        })),
    };
  });
/* Rebuild UI items straight from agencyDistributionDetails — 1:1, no    */
/* grouping/merging logic needed since the backend already keeps each   */
/* category+party combo as its own entry.                               */
const buildItemsFromDetails = (details, labourNameMap, shiftLabelMap, categoryLabelMap) =>
  details.map((row) => ({
    id: row.id ?? null,
    _uid: nextId(),
    name: categoryLabelMap[row.categoryId] || '',
    category: row.categoryId ?? null,
    categoryLabel: categoryLabelMap[row.categoryId] ?? '',
    labourName: { id: row.partyId ?? null, label: labourNameMap[row.partyId] ?? '' },
    expanded: true,
    shifts: (row.labourShifts ?? []).map((s) => ({
      id: s.id ?? null,
      _uid: nextId(),
      shiftMaster: { id: s.shiftMasterId ?? null, label: shiftLabelMap[s.shiftMasterId] ?? '' },
      dateTime: s.dateTime ?? '',
      price: s.price ?? 0,
      qty: s.qty ?? 0,
    })),
  }));

/* Extract just the date part of a shift's dateTime, for grouping only. */
const dayKeyForShift = (shift) => {
  if (!shift.dateTime) return '__unscheduled__';
  const parsed = dayjs(shift.dateTime, DATE_TIME_FORMAT, true);
  return parsed.isValid() ? parsed.format(DATE_ONLY_FORMAT) : '__unscheduled__';
};

/* Group an item's flat shifts by date for display only — the underlying  */
/* data model / save payload stays flat, matching the backend exactly.    */
const groupShiftsByDay = (shifts) => {
  const groups = new Map();
  shifts.forEach((shift) => {
    const key = dayKeyForShift(shift);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(shift);
  });

  const entries = Array.from(groups.entries());
  entries.sort(([a], [b]) => {
    if (a === '__unscheduled__') return 1;
    if (b === '__unscheduled__') return -1;
    return dayjs(a, DATE_ONLY_FORMAT).valueOf() - dayjs(b, DATE_ONLY_FORMAT).valueOf();
  });

  return entries.map(([dateKey, dayShifts], index) => ({
    dateKey,
    label: dateKey === '__unscheduled__' ? 'Unscheduled' : `Day ${index + 1} - ${dateKey}`,
    shifts: dayShifts,
  }));
};

/* Two shifts conflict if they share the same date+time AND the same     */
/* shift master — i.e. the same party is booked into the identical slot  */
/* twice within one labour item.                                         */
const shiftsConflict = (a, b) =>
  a.dateTime &&
  b.dateTime &&
  a.dateTime === b.dateTime &&
  a.shiftMaster?.id &&
  b.shiftMaster?.id &&
  a.shiftMaster.id === b.shiftMaster.id;

const applyStartTimeToDateTime = (currentDateTime, startTime, fallbackDate) => {
  if (!startTime) return currentDateTime;
  const timeParsed = dayjs(startTime, ['hh:mm A', 'HH:mm', 'HH:mm:ss'], true);
  if (!timeParsed.isValid()) return currentDateTime;
  const timePart = timeParsed.format('hh:mm A');
  const existing = currentDateTime ? dayjs(currentDateTime, DATE_TIME_FORMAT, true) : null;

  let datePart;
  if (existing?.isValid()) {
    datePart = existing.format(DATE_ONLY_FORMAT);
  } else {
    const fallback = fallbackDate ? dayjs(fallbackDate, DATE_TIME_FORMAT, true) : null;
    datePart = fallback?.isValid() ? fallback.format(DATE_ONLY_FORMAT) : dayjs().format(DATE_ONLY_FORMAT);
  }

  return `${datePart} ${timePart}`;
};
const EventLabourAgency = () => {
  const userId = Number(localStorage.getItem('userId'));

  const { eventId: routeEventId, functionId: routeFunctionId } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = routeEventId ?? searchParams.get('eventId');

  const [eventLoading, setEventLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({
    eventNo: '',
    eventName: '',
    partyName: '',
    venue: '',
    eventDate: '',
  });

  const [reference, setReference] = useState('');
  const [incharge, setIncharge] = useState(null);
  const [note, setNote] = useState('');
  const [setUpDateTime, setSetUpDateTime] = useState('');
  const [dismantlingDateTime, setDismantlingDateTime] = useState('');
  const [recordId, setRecordId] = useState(null);

  const [selectedFunction, setSelectedFunction] = useState({ id: null, label: '' });
  const [functionOptions, setFunctionOptions] = useState([]);

  const [catalogPick, setCatalogPick] = useState({ id: null, label: '' });
  const [items, setItems] = useState([]);

  const [saving, setSaving] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const headerLoadedRef = useRef(false);

  /* ---------------- load event + function options ---------------- */
  useEffect(() => {
    if (!eventId) {
      setEventLoading(false);
      return;
    }
    setEventLoading(true);
    getbyeventid(eventId)
      .then((res) => {
        const body = res?.data ?? res;
        const data = body?.data ?? body;

        setEventInfo({
          eventNo: data?.eventNo ?? '',
          eventName: data?.eventNameEnglish ?? '',
          partyName: data?.partyNameEnglish ?? '',
          venue: data?.venueNameEnglish ?? '',
          eventDate: data?.eventDate ?? '',
        });

        const fns = data?.eventFunctions ?? [];
        setFunctionOptions(fns.map((f) => ({ value: f.id, label: f.nameEnglish })));

        if (fns.length > 0) {
          const matched = routeFunctionId ? fns.find((f) => String(f.id) === String(routeFunctionId)) : null;
          const chosen = matched ?? fns[0];
          setSelectedFunction({ id: chosen.id, label: chosen.nameEnglish });
        }
      })
      .catch((err) => console.error('Failed to fetch event details:', err))
      .finally(() => setEventLoading(false));
  }, [eventId, routeFunctionId]);

  /* ---------------- Category dropdown (Labour Allocation type) ---------------- */
  const fetchCategoryOptions = useCallback(
    async (query) => {
      setCategoryLoading(true);
      try {
        const res = await getAllCategoryMaster({
          nameEnglish: query || '',
          page: 0,
          size: 20,
          sortBy: 'id',
          sortDirection: 'DESC',
          userId,
          categoryTypeId: 2,
        });
        const body = res?.data?.data ?? res?.data ?? {};
        const content = body?.content ?? [];
        return content.map((c) => ({ id: c.id, label: c.nameEnglish }));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        return [];
      } finally {
        setCategoryLoading(false);
      }
    },
    [userId]
  );

  const handleCategorySearch = useCallback(
    (q) => {
      fetchCategoryOptions(q).then((res) =>
        setCategoryOptions(res.map((o) => ({ value: o.id, label: o.label })))
      );
    },
    [fetchCategoryOptions]
  );

  // full label map, used only to resolve labels when regrouping saved rows on load
  const fetchCategoryLabelMap = useCallback(async () => {
    try {
      const res = await getAllCategoryMaster({
        nameEnglish: '',
        page: 0,
        size: 1000,
        sortBy: 'id',
        sortDirection: 'DESC',
        userId,
      });
      const body = res?.data?.data ?? res?.data ?? {};
      const content = body?.content ?? [];
      return Object.fromEntries(content.map((c) => [c.id, c.nameEnglish]));
    } catch (err) {
      console.error('Failed to fetch category label map:', err);
      return {};
    }
  }, [userId]);

  /* ---------------- Party (Labour Name) dropdown — scoped by category ---------------- */
  const fetchPartyOptionsForCategory = useCallback(
    (categoryId) => async (query) => {
      if (!categoryId) return [];
      try {
        const res = await getAllClientMaster({

          categoryId,
          isActive: true,
          nameEnglish: query,
          page: 0,
          size: 10,
          sortBy: 'id',
          sortDirection: 'ASC',
          uniqueCode: '',
          userId,
        });
        const body = res?.data?.data ?? res?.data ?? {};
        const content = body?.content ?? [];
        return content.map((item) => ({
          id: item.id,
          label: item.nameEnglish || item.nameHindi || item.nameGujarati || '',
        }));
      } catch (err) {
        console.error('Failed to fetch parties for category:', err);
        return [];
      }
    },
    [userId]
  );

  // full label map, used only to resolve labels when regrouping saved rows on load
  const fetchLabourNameMap = useCallback(async () => {
    try {
      const res = await getAllClientMaster({
        categoryId: null,
        isActive: null,
        nameEnglish: '',
        page: 0,
        size: 1000,
        sortBy: 'id',
        sortDirection: 'DESC',
        uniqueCode: '',
        userId,
      });
      const list = res?.data?.data?.content || res?.data?.data || [];
      return Object.fromEntries(
        (Array.isArray(list) ? list : []).map((v) => [v.id, v.nameEnglish || v.nameHindi || v.nameGujarati || ''])
      );
    } catch (err) {
      console.error('Failed to fetch labour name map:', err);
      return {};
    }
  }, [userId]);

  /* ---------------- Shift Master dropdown ---------------- */
  const fetchShiftOptions = useCallback(
  async (query) => {
    try {
      const res = await getalllabourshift({
        nameEnglish: query, page: 0, size: 20, sortBy: 'id', sortDirection: 'DSCE', userId,
      });
      const body = res?.data?.data ?? res?.data ?? {};
      const content = body?.content ?? [];
      return content.map((s) => ({
        id: s.id,
        label: `${s.nameEnglish} · ${s.startTime}`,
        meta: { startTime: s.startTime },
      }));
    } catch (err) {
      console.error('Failed to fetch labour shifts:', err);
      return [];
    }
  },
  [userId]
);

  const fetchShiftLabelMap = useCallback(async () => {
    try {
      const res = await getalllabourshift({
        nameEnglish: '',
        page: 0,
        size: 1000,
        sortBy: 'id',
        sortDirection: 'ASC',
        userId,
      });
      const body = res?.data?.data ?? res?.data ?? {};
      const content = body?.content ?? [];
      return Object.fromEntries(content.map((s) => [s.id, `${s.nameEnglish} · ${s.startTime}`]));
    } catch (err) {
      console.error('Failed to fetch labour shift map:', err);
      return {};
    }
  }, [userId]);

  /* ---------------- load record for selected function ---------------- */
  const fetchRecordForFunction = useCallback(
    async (eventFunctionId) => {
      if (!eventFunctionId) {
        setRecordId(null);
        setItems([]);
        return;
      }
      setLoadingItems(true);
      try {
        const res = await geteventagencydistriibution(eventFunctionId);
        const body = res?.data ?? res;
        const data = body?.data ?? null;

        if (!data) {
          setRecordId(null);
          setItems([]);
          if (!headerLoadedRef.current) {
            setReference('');
            setIncharge(null);
            setNote('');
            setSetUpDateTime('');
            setDismantlingDateTime('');
          }
          return;
        }

        setRecordId(data.id ?? null);

        if (!headerLoadedRef.current) {
          setReference(data.reference ?? '');
          setIncharge(data.productionInchargeId ?? null);
          setNote(data.notesEnglish ?? '');
          setSetUpDateTime(data.setUpDateTime ?? '');
          setDismantlingDateTime(data.dismantlingDateTime ?? '');
          headerLoadedRef.current = true;
        }

        const details = Array.isArray(data.agenyDetails) ? data.agenyDetails : [];
        const [labourNameMap, shiftLabelMap, categoryLabelMap] = await Promise.all([
          fetchLabourNameMap(),
          fetchShiftLabelMap(),
          fetchCategoryLabelMap(),
        ]);

        setItems(buildItemsFromDetails(details, labourNameMap, shiftLabelMap, categoryLabelMap));
      } catch (err) {
        console.error('Failed to fetch event function agency:', err);
        setRecordId(null);
        setItems([]);
      } finally {
        setLoadingItems(false);
      }
    },
    [fetchLabourNameMap, fetchShiftLabelMap, fetchCategoryLabelMap]
  );

  useEffect(() => {
  if (selectedFunction?.id) {
    headerLoadedRef.current = false; // allow header fields to reload for the new function
    fetchRecordForFunction(selectedFunction.id);
  }
}, [selectedFunction?.id, fetchRecordForFunction]);

  const fetchFunctionOptions = useCallback(
    async (query) => {
      try {
        const res = await getalllistfuntionmaster({
          nameEnglish: query,
          page: 0,
          size: 20,
          sortBy: 'id',
          sortDirection: 'ASC',
          userId,
        });
        const body = res?.data ?? res;
        const data = body?.data ?? {};
        return (data.content ?? []).map((item) => ({ id: item.id, label: item.nameEnglish }));
      } catch (err) {
        console.error('Failed to fetch functions:', err);
        return [];
      }
    },
    [userId]
  );

  
  const toggleItemExpand = (itemUid) =>
    setItems((prev) => prev.map((it) => (it._uid === itemUid ? { ...it, expanded: !it.expanded } : it)));

  const deleteItem = (itemUid) => setItems((prev) => prev.filter((it) => it._uid !== itemUid));

  const addItem = () => {
    setItems((prev) => [...prev, makeItem(catalogPick)]);
    setCatalogPick({ id: null, label: '' });
  };

  
  const isClearingFieldValue = (field, value) => {
    if (field === 'shiftMaster') return !value?.id;
    if (field === 'dateTime') return !value;
    return false;
  };

 const updateShift = (itemUid, shiftUid, field, value) => {
  setItems((prev) =>
    prev.map((it) => {
      if (it._uid !== itemUid) return it;
      let nextShifts = it.shifts.map((s) => {
        if (s._uid !== shiftUid) return s;
        const updated = { ...s, [field]: value };
       if (field === 'shiftMaster' && value?.id && value?.startTime) {
  updated.dateTime = applyStartTimeToDateTime(s.dateTime, value.startTime, setUpDateTime);
}
        return updated;
      });
      const clearing = isClearingFieldValue(field, value);
      if (!clearing && (field === 'dateTime' || field === 'shiftMaster')) {
        const changed = nextShifts.find((s) => s._uid === shiftUid);
        const conflict = nextShifts.find((s) => s._uid !== shiftUid && shiftsConflict(s, changed));
        if (conflict) {
          message.warning('This party already has a shift at that exact date, time, and shift type.');
          nextShifts = it.shifts.map((s) =>
            s._uid === shiftUid
              ? { ...s, [field]: field === 'shiftMaster' ? { id: null, label: '', startTime: null } : '' }
              : s
          );
          return { ...it, shifts: nextShifts };
        }
      }
      return { ...it, shifts: nextShifts };
    })
  );
};

  // Adds a new shift row. When called from inside an existing day group
  // (dayKey passed in), the row is seeded onto that same day so it renders
  // under that day's heading instead of dropping into "Unscheduled".
  const addShift = (itemUid, dayKey) =>
    setItems((prev) =>
      prev.map((it) => (it._uid === itemUid ? { ...it, shifts: [...it.shifts, makeShift(dayKey)] } : it))
    );

  // Adds a brand new, unscheduled shift row for the item — it becomes its
  // own new "day" group as soon as the user picks a date for it.
  const addAnotherDay = (itemUid) =>
    setItems((prev) =>
      prev.map((it) => (it._uid === itemUid ? { ...it, shifts: [...it.shifts, makeShift()] } : it))
    );

  const duplicateShift = (itemUid, shiftUid) =>
    setItems((prev) =>
      prev.map((it) => {
        if (it._uid !== itemUid) return it;
        const src = it.shifts.find((s) => s._uid === shiftUid);
        if (!src) return it;
        return { ...it, shifts: [...it.shifts, { ...src, id: null, _uid: nextId() }] };
      })
    );

  const removeShift = (itemUid, shiftUid) =>
    setItems((prev) =>
      prev.map((it) =>
        it._uid === itemUid ? { ...it, shifts: it.shifts.filter((s) => s._uid !== shiftUid) } : it
      )
    );

  /* ---------------- save ---------------- */
  const handleSaveAll = async () => {
    if (!selectedFunction?.id) {
      showApiError({ message: 'Select a function before saving.' }, { title: 'No function selected' });
      return;
    }

    if (!incharge) {
      showApiError({ message: 'Production Incharge is required.' }, { title: 'Missing Production Incharge' });
      return;
    }

    if (items.length === 0) {
      showApiError({ message: 'Add at least one labour allocation before saving.' }, { title: 'Labour Allocation required' });
      return;
    }
    const missingCategory = items.find((it) => !it.category);
    if (missingCategory) {
      showApiError(
        { message: `Select a Labour Allocation for "${missingCategory.name}" before saving.` },
        { title: 'Labour Allocation required' }
      );
      return;
    }

    const missingLabourName = items.find((it) => !it.labourName?.id);
    if (missingLabourName) {
      showApiError(
        { message: `Select a Labour Name for "${missingLabourName.name}" before saving.` },
        { title: 'Labour Name required' }
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: recordId ?? 0,
        eventId: Number(eventId),
        eventFunctionId: selectedFunction.id,
        reference,
        productionInchargeId: incharge ?? 0,
        notesEnglish: note,
        notesGujarati: '',
        notesHindi: '',
        setUpDateTime,
        dismantlingDateTime,
        agenyDetails: flattenItemsToDetails(items),
        userId,
      };

      const res = await addupdateeventagencydistribution(payload);

      const success = showApiResult(res, {
        successTitle: 'Labour allocation saved',
        errorTitle: 'Failed to save',
      });

      if (success) {
        fetchRecordForFunction(selectedFunction.id);
      }
    } catch (err) {
      console.error('Save event function agency failed:', err);
      showApiError(err, { title: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <EventHeaderCard
          title="Event Labour Agency"
          eventInfo={eventInfo}
          onEventNoClick={() => {}}
          reference={reference}
          onReferenceChange={setReference}
          incharge={incharge}
          onInchargeChange={setIncharge}
          note={note}
          onNoteChange={setNote}
          setUpDateTime={setUpDateTime}
          onSetUpDateTimeChange={setSetUpDateTime}
          dismantlingDateTime={dismantlingDateTime}
          onDismantlingDateTimeChange={setDismantlingDateTime}
        />

        <div className="rounded-2xl border border-primary-clarity bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100">
              <Title level={4} className="!mb-0 !text-gray-900">Function Name</Title>
              <Select
                showSearch
                allowClear={false}
                value={selectedFunction?.id ?? undefined}
                onChange={(id) => {
                  const opt = functionOptions.find((o) => o.value === id);
                  setSelectedFunction(opt ? { id: opt.value, label: opt.label } : { id: null, label: '' });
                }}
                onSearch={(q) => fetchFunctionOptions(q).then((res) =>
                  setFunctionOptions(res.map((o) => ({ value: o.id, label: o.label })))
                )}
                options={functionOptions}
                optionFilterProp="label"
                loading={eventLoading}
                placeholder="Select function"
                popupMatchSelectWidth={false}
                suffixIcon={<DownOutlined className="text-gray-400" />}
                className="min-w-[160px] [&_.ant-select-selector]:!border-primary-clarity"
              />
            </div>

            <div>
              <Button icon={<Save size={15} />} type="primary" loading={saving} onClick={handleSaveAll} className="rounded-lg">
                Save
              </Button>
            </div>
          </div>

          {/* Labour Allocation header + category pick / add row */}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary-lighest p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 pr-2 text-sm font-semibold text-gray-900 sm:border-r sm:border-primary-clarity">
              <span className="inline-block h-4 w-1 rounded bg-primary" />
              Labour Allocation <span className="text-red-500">*</span>
            </div>
            <div className="relative flex-1">
              <Select
                showSearch
                labelInValue
                allowClear
                value={catalogPick?.id ? { value: catalogPick.id, label: catalogPick.label } : undefined}
                onChange={(opt) => setCatalogPick(opt ? { id: opt.value, label: opt.label } : { id: null, label: '' })}
                onSearch={handleCategorySearch}
                onDropdownVisibleChange={(open) => {
                  if (open) handleCategorySearch('');
                }}
                filterOption={false}
                loading={categoryLoading}
                placeholder="LABOUR"
                options={categoryOptions}
                notFoundContent={categoryLoading ? <Spin size="small" /> : 'No categories found'}
                suffixIcon={<DownOutlined className="text-gray-400" />}
                className="w-full [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!border-gray-300"
              />
            </div>
            <Button icon={<PlusOutlined />} onClick={addItem} className="shrink-0 !bg-white rounded-lg">
              Add
            </Button>
            <Button type="primary" icon={<Sparkles size={16} />} onClick={addItem} className="shrink-0 rounded-lg">
              Add Labour
            </Button>
          </div>

          {/* Table header */}
          <div className="mt-6 hidden grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
            <span>Item Name</span>
            <span>Labour Name <span className="text-red-500">*</span></span>
            <span className="text-center">Total Quantity</span>
            <span className="text-center">Total Price</span>
            <span />
          </div>

          {loadingItems ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {items.map((item) => {
                const { qty: totalQty, price: totalPrice } = itemTotals(item);
                return (
                  <div key={item._uid} className="rounded-xl border border-primary-clarity overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 bg-primary-lighest px-4 py-4 sm:grid-cols-[2fr_1.4fr_1fr_1fr_auto] sm:items-center">
                      <span className="font-semibold text-gray-900">{item.name}</span>

                      <AsyncSearchSelect
                        key={item.category ?? 'no-category'}
                        fetcher={fetchPartyOptionsForCategory(item.category)}
                        value={item.labourName}
                        onChange={(v) =>
                          setItems((prev) =>
                            prev.map((it) => (it._uid === item._uid ? { ...it, labourName: v } : it))
                          )
                        }
                        placeholder={item.category ? 'Labour Name' : 'Select category first'}
                        className="[&_.ant-select-selector]:!bg-white"
                      />

                      <span className="font-bold text-primary sm:text-center">{currency(totalQty)}</span>
                      <span className="font-bold text-primary sm:text-center">{currency(totalPrice)}</span>
                      <div className="flex items-center gap-2 justify-end col-span-2 sm:col-span-1">
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => deleteItem(item._uid)} aria-label="Delete labour" />
                        <Button
                          type="text"
                          size="small"
                          icon={item.expanded ? <UpOutlined /> : <DownOutlined />}
                          onClick={() => toggleItemExpand(item._uid)}
                          aria-label="Toggle details"
                        />
                      </div>
                    </div>

                    {item.expanded && (
                      <div className="space-y-4 border-t border-primary-clarity bg-white p-5">


                        {/* flat shift rows — no day grouping, matches backend 1:1 */}
                        {groupShiftsByDay(item.shifts).map((day) => (
                          <div key={day.dateKey} className="rounded-xl border border-primary-clarity bg-primary-lighest/40 p-4">
                            <div className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                              {day.label}
                            </div>

                            <div className="hidden grid-cols-[1.4fr_1.4fr_0.8fr_0.7fr_0.9fr_auto] gap-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:grid">
                              <span>Shift</span>
                              <span>Date &amp; Time</span>
                              <span className="text-center">Price</span>
                              <span className="text-center">Qty.</span>
                              <span className="text-center">Total</span>
                              <span className="text-right">Actions</span>
                            </div>

                            <div className="space-y-2">
                              {day.shifts.map((shift) => {
                                const shiftTotal = Number(shift.qty || 0) * Number(shift.price || 0);
                                return (
                                  <div
                                    key={shift._uid}
                                    className="grid grid-cols-2 gap-2 rounded-lg bg-white p-2 sm:grid-cols-[1.4fr_1.4fr_0.8fr_0.7fr_0.9fr_auto] sm:items-center"
                                  >
                                    <AsyncSearchSelect
                                      fetcher={fetchShiftOptions}
                                      value={shift.shiftMaster}
                                      onChange={(v) => updateShift(item._uid, shift._uid, 'shiftMaster', v)}
                                      placeholder="Select Shift"
                                    />
                                    <DateTimeField
                                      value={shift.dateTime}
                                      onChange={(val) => updateShift(item._uid, shift._uid, 'dateTime', val)}
                                      placeholder="DD/MM/YYYY hh:mm A"
                                    />
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      min={0}
                                      value={shift.price}
                                      onChange={(v) => updateShift(item._uid, shift._uid, 'price', v ?? 0)}
                                    />
                                    <InputNumber
                                      style={{ width: '100%' }}
                                      min={0}
                                      value={shift.qty}
                                      onChange={(v) => updateShift(item._uid, shift._uid, 'qty', v ?? 0)}
                                    />
                                    <div className="rounded-md bg-gray-100 px-3 py-1.5 text-center text-sm font-semibold text-gray-700">
                                      {currency(shiftTotal)}
                                    </div>
                                    <div className="flex items-center justify-end gap-3 col-span-2 sm:col-span-1">
                                      
                                      <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => removeShift(item._uid, shift._uid)} aria-label="Delete shift" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <Button type="primary" icon={<PlusOutlined />} onClick={() => addShift(item._uid, day.dateKey)} className="mt-3 rounded-lg">
                              Add Shift
                            </Button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addAnotherDay(item._uid)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary"
                        >
                          <PlusOutlined />
                          Add Another Day
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {items.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No labour allocated yet — pick a type above and hit Add."
                  className="py-10"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLabourAgency;