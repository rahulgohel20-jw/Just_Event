import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  List,
  Avatar,
  Empty,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CopyOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { getalllistfuntionmaster, getAllClientMaster } from '@/services/apiServices';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import { Sparkles } from 'lucide-react';
import DateField from '../../../components/form-inputs/DatePicker/Datefield';

const { Text, Title } = Typography;

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

/* ------------------------------------------------------------------ */
/* Events search modal                                                 */
/* ------------------------------------------------------------------ */
const EVENTS_LIST = [
  {
    id: 1,
    code: 'B260001',
    name: 'Bina Ketan Shah',
    date: '19/02/2026',
    time: '08:00 AM',
    type: 'Wedding',
    partyName: 'Bina Ketan Shah',
    venue: 'Sunset Banquet Hall',
  },
  {
    id: 2,
    code: 'C260001',
    name: 'Just Catering',
    date: '24/03/2026',
    time: '08:00 AM',
    type: 'Wedding',
    partyName: 'Just Catering',
    venue: 'Grand Horizon Center',
  },
  {
    id: 3,
    code: 'D260001',
    name: 'Just Catering',
    date: '04/03/2026',
    time: '',
    type: 'Reception',
    partyName: 'Just Catering',
    venue: 'Grand Horizon Center',
  },
  {
    id: 4,
    code: 'D260002',
    name: 'Just Catering',
    date: '04/04/2026',
    time: '',
    type: 'Reception',
    partyName: 'Just Catering',
    venue: 'Grand Horizon Center',
  },
  {
    id: 5,
    code: 'D260003',
    name: 'Just Catering',
    date: '04/05/2026',
    time: '',
    type: 'Reception',
    partyName: 'Just Catering',
    venue: 'Grand Horizon Center',
  },
];

const EventSearchModal = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = EVENTS_LIST.filter((ev) =>
    !q ||
    ev.name.toLowerCase().includes(q) ||
    ev.code.toLowerCase().includes(q) ||
    ev.type.toLowerCase().includes(q) ||
    ev.date.includes(q)
  );

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Events" destroyOnClose>
      <Input
        autoFocus
        allowClear
        prefix={<SearchOutlined className="text-gray-400" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, code, type or date…"
        className="mb-3"
      />
      <List
        className="max-h-96 overflow-y-auto"
        locale={{ emptyText: 'No events found' }}
        dataSource={filtered}
        renderItem={(ev, i) => (
          <List.Item className="cursor-pointer hover:bg-gray-50" onClick={() => onSelect(ev)}>
            <List.Item.Meta
              avatar={
                <Avatar
                  className={i % 2 === 0 ? 'bg-primary-lighest text-primary' : 'bg-violet-100 text-violet-600'}
                >
                  {ev.name.charAt(0)}
                </Avatar>
              }
              title={ev.name}
              description={`${ev.code} · ${ev.date}${ev.time ? ` ${ev.time}` : ''} · ${ev.type}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
// Production Incharge, the labour-type catalog search, and shift-type
// options are still static/mock — not part of this integration. Function
// Name and Labour Name below are wired to the real list APIs (see
// fetchFunctionOptions / fetchLabourNameOptions).
const CATALOG_OPTIONS = [
  'Flower Labour',
  'Setup Labour',
  'Loading Labour',
  'Cleaning Labour',
  'Stage Labour',
].map((o) => ({ value: o, label: o }));

const SHIFT_OPTIONS = [
  'Morning Shift',
  'Afternoon Shift',
  'Evening Shift',
  'Night Shift',
  'Full Day',
].map((o) => ({ value: o, label: o }));

const INCHARGE_OPTIONS = ['Rakesh Sharma', 'Priya Mehta', 'Anil Kumar', 'Sunita Rao'];

let uid = 100;
const nextId = () => `id-${uid++}`;

const makeShift = () => ({
  id: nextId(),
  shiftType: '',
  date: '',
  price: 0,
  qty: 0,
});

const makeDay = (index) => ({
  id: nextId(),
  label: `Day ${index} - Setup`,
  expanded: true,
  shifts: [makeShift(), makeShift()],
});

const initialItems = [
  {
    id: 1,
    name: 'Flower Labour',
    category: '',
    labourName: { id: null, label: 'Vishal Bhai' },
    expanded: false,
    days: [
      {
        id: 'd1',
        label: 'Day 1 - Setup',
        expanded: true,
        shifts: [
          { id: 's1', shiftType: '', date: '03/08/2026', price: 600, qty: 1 },
          { id: 's2', shiftType: '', date: '03/08/2026', price: 600, qty: 1 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Flower Labour',
    category: '',
    labourName: { id: null, label: 'Vishal Bhai' },
    expanded: true,
    days: [
      {
        id: 'd2',
        label: 'Day 1 - Setup',
        expanded: true,
        shifts: [
          { id: 's3', shiftType: '', date: '03/08/2026', price: 0, qty: 0 },
          { id: 's4', shiftType: '', date: '03/08/2026', price: 0, qty: 0 },
        ],
      },
    ],
  },
];

const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const itemTotals = (item) => {
  let qty = 0;
  let price = 0;
  item.days.forEach((day) => {
    day.shifts.forEach((s) => {
      qty += Number(s.qty || 0);
      price += Number(s.qty || 0) * Number(s.price || 0);
    });
  });
  return { qty, price };
};

const EventLabourAgency = () => {
  const userId = Number(localStorage.getItem('userId'));

  const [eventInfo, setEventInfo] = useState({
    eventNo: 'EVT-2023-042',
    eventName: "Global Tech Summit '24",
    partyName: 'Acme Corp International',
    venue: 'Grand Horizon Center',
    eventDate: 'Oct 12, 2026 - Oct 15, 2026',
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [reference, setReference] = useState('');
  const [incharge, setIncharge] = useState('');
  const [note, setNote] = useState('');
  const [setupDate, setSetupDate] = useState('');
  const [setupTime, setSetupTime] = useState('');
  const [dismantleDate, setDismantleDate] = useState('');
  const [dismantleTime, setDismantleTime] = useState('');
  const [selectedFunction, setSelectedFunction] = useState({ id: null, label: 'Gala Dinner' });
  const [functionOptions, setFunctionOptions] = useState([]);

  const [catalogPick, setCatalogPick] = useState('');
  const [items, setItems] = useState(initialItems);

  // Function Name dropdown — same list/search API FunctionMaster.jsx uses
  // (getalllistfuntionmaster), just called on every keystroke instead of
  // wired to a table.
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

  // Labour Name dropdown — same list API VendorMaster.jsx uses
  // (getAllClientMaster), with the same "not Customer" category filter so
  // this only ever offers real vendor/labour records, not customers.
  const fetchLabourNameOptions = useCallback(
    async (query) => {
      try {
        const res = await getAllClientMaster({
          categoryId: null,
          isActive: null,
          nameEnglish: query,
          page: 0,
          size: 20,
          sortBy: 'id',
          sortDirection: 'DESC',
          uniqueCode: '',
          userId,
        });
        const list = res?.data?.data?.content || res?.data?.data || [];
        const vendorsOnly = Array.isArray(list)
          ? list.filter((item) => item.categoryTypeNameEnglish !== 'Customer')
          : [];
        return vendorsOnly.map((item) => ({
          id: item.id,
          label: item.nameEnglish || item.nameHindi || item.nameGujarati || '',
        }));
      } catch (err) {
        console.error('Failed to fetch labour names:', err);
        return [];
      }
    },
    [userId]
  );

  const handleSelectEvent = (ev) => {
    setEventInfo({
      eventNo: ev.code,
      eventName: ev.name,
      partyName: ev.partyName,
      venue: ev.venue,
      eventDate: ev.time ? `${ev.date} ${ev.time}` : ev.date,
    });
    setIsEventModalOpen(false);
  };

  /* ---------------- item-level helpers ---------------- */
  const toggleItemExpand = (itemId) =>
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, expanded: !it.expanded } : it)));

  const updateItemField = (itemId, field, value) =>
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)));

  const deleteItem = (itemId) => setItems((prev) => prev.filter((it) => it.id !== itemId));

  const addItem = () => {
    const newItem = {
      id: nextId(),
      name: catalogPick || 'New Labour',
      category: '',
      labourName: { id: null, label: '' },
      expanded: true,
      days: [makeDay(1)],
    };
    setItems((prev) => [...prev, newItem]);
    setCatalogPick('');
  };

  /* ---------------- day-level helpers ---------------- */
  const toggleDayExpand = (itemId, dayId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, days: it.days.map((d) => (d.id === dayId ? { ...d, expanded: !d.expanded } : d)) }
          : it
      )
    );

  const addDay = (itemId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, days: [...it.days, makeDay(it.days.length + 1)] } : it
      )
    );

  const removeDay = (itemId, dayId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId ? { ...it, days: it.days.filter((d) => d.id !== dayId) } : it
      )
    );

  /* ---------------- shift-level helpers ---------------- */
  const updateShift = (itemId, dayId, shiftId, field, value) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              days: it.days.map((d) =>
                d.id === dayId
                  ? {
                      ...d,
                      shifts: d.shifts.map((s) => (s.id === shiftId ? { ...s, [field]: value } : s)),
                    }
                  : d
              ),
            }
          : it
      )
    );

  const addShift = (itemId, dayId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              days: it.days.map((d) =>
                d.id === dayId ? { ...d, shifts: [...d.shifts, makeShift()] } : d
              ),
            }
          : it
      )
    );

  const duplicateShift = (itemId, dayId, shiftId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              days: it.days.map((d) => {
                if (d.id !== dayId) return d;
                const src = d.shifts.find((s) => s.id === shiftId);
                if (!src) return d;
                return { ...d, shifts: [...d.shifts, { ...src, id: nextId() }] };
              }),
            }
          : it
      )
    );

  const removeShift = (itemId, dayId, shiftId) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              days: it.days.map((d) =>
                d.id === dayId ? { ...d, shifts: d.shifts.filter((s) => s.id !== shiftId) } : d
              ),
            }
          : it
      )
    );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------------- Header card ---------------- */}
        <EventHeaderCard
          title="Event Labour Agency"
          eventInfo={eventInfo}
          onEventNoClick={() => setIsEventModalOpen(true)}
          reference={reference}
          onReferenceChange={setReference}
          incharge={incharge}
          onInchargeChange={setIncharge}
          inchargeOptions={INCHARGE_OPTIONS}
          note={note}
          onNoteChange={setNote}
          setupDate={setupDate}
          onSetupDateChange={setSetupDate}
          setupTime={setupTime}
          onSetupTimeChange={setSetupTime}
          dismantleDate={dismantleDate}
          onDismantleDateChange={setDismantleDate}
          dismantleTime={dismantleTime}
          onDismantleTimeChange={setDismantleTime}
        />

        {/* ---------------- Function card ---------------- */}
        <div className="rounded-2xl border border-primary-clarity bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100">
            <Title level={4} className="!mb-0 !text-gray-900">Function Name</Title>
            <Select
              showSearch
              labelInValue
              allowClear
              value={selectedFunction?.id ? { value: selectedFunction.id, label: selectedFunction.label } : undefined}
              onChange={(opt) => setSelectedFunction(opt ? { id: opt.value, label: opt.label } : { id: null, label: '' })}
              onSearch={(q) => fetchFunctionOptions(q).then((res) =>
                setFunctionOptions(res.map((o) => ({ value: o.id, label: o.label })))
              )}
              onFocus={() => {
                if (functionOptions.length === 0) {
                  fetchFunctionOptions('').then((res) =>
                    setFunctionOptions(res.map((o) => ({ value: o.id, label: o.label })))
                  );
                }
              }}
              filterOption={false}
              placeholder="Select function"
              popupMatchSelectWidth={false}
              suffixIcon={<DownOutlined className="text-gray-400" />}
              options={functionOptions}
              className="min-w-[160px] [&_.ant-select-selector]:!border-primary-clarity"
            />
          </div>

          {/* Labour Allocation header + catalog pick / add row */}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary-lighest p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 pr-2 text-sm font-semibold text-gray-900 sm:border-r sm:border-primary-clarity">
              <span className="inline-block h-4 w-1 rounded bg-primary" />
              Labour Allocation
            </div>
            <div className="relative flex-1">
              <Select
                allowClear
                value={catalogPick || undefined}
                onChange={setCatalogPick}
                placeholder="LABOUR"
                optionFilterProp="label"
                options={CATALOG_OPTIONS}
                suffixIcon={<DownOutlined className="text-gray-400" />}
                className="w-full [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!border-gray-300"
              />
            </div>
            <Button icon={<PlusOutlined />} onClick={addItem} className="shrink-0 !bg-white rounded-lg">
              Add
            </Button>
            <Button
              type="primary"
              icon={<Sparkles size={16} />}
              onClick={addItem}
              className="shrink-0 rounded-lg"
            >
              Add Labour
            </Button>
          </div>

          {/* Table header */}
          <div className="mt-6 hidden grid-cols-[2fr_1.4fr_1fr_1fr_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
            <span>Item Name</span>
            <span>Labour Name</span>
            <span className="text-center">Total Quantity</span>
            <span className="text-center">Total Price</span>
            <span />
          </div>

          {/* Item rows */}
          <div className="mt-2 space-y-3">
            {items.map((item) => {
              const { qty: totalQty, price: totalPrice } = itemTotals(item);
              return (
                <div key={item.id} className="rounded-xl border border-primary-clarity overflow-hidden">
                  {/* collapsed row */}
                  <div className="grid grid-cols-2 gap-3 bg-primary-lighest px-4 py-4 sm:grid-cols-[2fr_1.4fr_1fr_1fr_auto] sm:items-center">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-gray-600">{item.labourName?.label || '—'}</span>
                    <span className="font-bold text-primary sm:text-center">{currency(totalQty)}</span>
                    <span className="font-bold text-primary sm:text-center">{currency(totalPrice)}</span>
                    <div className="flex items-center gap-2 justify-end col-span-2 sm:col-span-1">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteItem(item.id)}
                        aria-label="Delete labour"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={item.expanded ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => toggleItemExpand(item.id)}
                        aria-label="Toggle details"
                      />
                    </div>
                  </div>

                  {/* expanded panel */}
                  {item.expanded && (
                    <div className="space-y-4 border-t border-primary-clarity bg-white p-5">
                      {/* type + labour name + totals row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Select
                          allowClear
                          value={item.category || undefined}
                          onChange={(v) => updateItemField(item.id, 'category', v)}
                          placeholder="LABOUR"
                          optionFilterProp="label"
                          options={CATALOG_OPTIONS}
                          suffixIcon={<DownOutlined className="text-gray-400" />}
                          className="w-40 [&_.ant-select-selector]:!border-gray-300"
                        />
                       
                        <div className="ml-auto flex items-center gap-2">
                          <div className="rounded-lg border border-primary-clarity bg-primary-lighest px-3 py-1.5 text-xs font-semibold text-gray-700">
                            Total Quantity : {totalQty}
                          </div>
                          <div className="rounded-lg border border-primary-clarity bg-primary-lighest px-3 py-1.5 text-xs font-semibold text-gray-700">
                            Total Price : {totalPrice}
                          </div>
                        </div>
                      </div>

                      {/* day cards */}
                      {item.days.map((day) => {
                        const dayTotal = day.shifts.reduce(
                          (sum, s) => sum + Number(s.qty || 0) * Number(s.price || 0),
                          0
                        );
                        return (
                          <div key={day.id} className="rounded-xl border border-primary-clarity bg-primary-lighest/40">
                            <div className="flex items-center justify-between px-4 py-3">
                              <button
                                type="button"
                                onClick={() => toggleDayExpand(item.id, day.id)}
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"
                              >
                                {day.expanded ? <UpOutlined /> : <DownOutlined />}
                                {day.label}
                              </button>
                              <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeDay(item.id, day.id)}
                                aria-label="Delete day"
                              />
                            </div>

                            {day.expanded && (
                              <div className="px-4 pb-4">
                                {/* shift header */}
                                <div className="hidden grid-cols-[1.4fr_1.2fr_0.8fr_0.7fr_0.9fr_auto] gap-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:grid">
                                  <span className="flex items-center gap-1">
                                    Labour Shift <PlusCircleOutlined className="text-gray-400" />
                                  </span>
                                  <span>Date</span>
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
                                        key={shift.id}
                                        className="grid grid-cols-2 gap-2 rounded-lg bg-white p-2 sm:grid-cols-[1.4fr_1.2fr_0.8fr_0.7fr_0.9fr_auto] sm:items-center"
                                      >
                                        <Select
                                          allowClear
                                          value={shift.shiftType || undefined}
                                          onChange={(v) => updateShift(item.id, day.id, shift.id, 'shiftType', v)}
                                          placeholder="Select Shift"
                                          options={SHIFT_OPTIONS}
                                          suffixIcon={<DownOutlined className="text-gray-400" />}
                                          className="w-full"
                                        />
                                        <DateField
                                          value={shift.date}
                                          onChange={(val) => updateShift(item.id, day.id, shift.id, 'date', val)}
                                        />
                                        <InputNumber
                                          style={{ width: '100%' }}
                                          min={0}
                                          value={shift.price}
                                          onChange={(v) => updateShift(item.id, day.id, shift.id, 'price', v ?? 0)}
                                        />
                                        <InputNumber
                                          style={{ width: '100%' }}
                                          min={0}
                                          value={shift.qty}
                                          onChange={(v) => updateShift(item.id, day.id, shift.id, 'qty', v ?? 0)}
                                        />
                                        <div className="rounded-md bg-gray-100 px-3 py-1.5 text-center text-sm font-semibold text-gray-700">
                                          {currency(shiftTotal)}
                                        </div>
                                        <div className="flex items-center justify-end gap-3 col-span-2 sm:col-span-1">
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<CopyOutlined className="text-primary" />}
                                            onClick={() => duplicateShift(item.id, day.id, shift.id)}
                                            aria-label="Duplicate shift"
                                          />
                                          <Button
                                            type="text"
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeShift(item.id, day.id, shift.id)}
                                            aria-label="Delete shift"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <Button
                                  type="primary"
                                  icon={<PlusOutlined />}
                                  onClick={() => addShift(item.id, day.id)}
                                  className="mt-3 rounded-lg"
                                >
                                  Add Shift
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* add another day */}
                      <button
                        type="button"
                        onClick={() => addDay(item.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary"
                      >
                        <PlusCircleOutlined />
                        Add Another Day
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EventSearchModal
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSelect={handleSelectEvent}
      />
    </div>
  );
};

export default EventLabourAgency;