import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
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
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  MessageOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getalllistfuntionmaster, getAllClientMaster } from '@/services/apiServices';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import { Sparkles } from 'lucide-react';
import DateField from '../../../components/form-inputs/DatePicker/Datefield';
import TimeInput12h from '../../../components/form-inputs/Time/Timeinput12h';

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
/* Placement instructions modal                                        */
/* ------------------------------------------------------------------ */
// Reference info per placement type — size/notes/materials are fixed specs
// for that placement, quantity comes from the item's current placement qty.
const PLACEMENT_DETAILS = {
  'Welcome Board': {
    size: '10x12 ft',
    sqFt: '120 sq ft',
    notes:
      'Standard placement at the main entrance. Ensure lighting is directed towards the center of the board.',
    elements: 'Vinyl print on 3mm foam board with matte finish. Reinforced wooden frame backing.',
  },
  'Entry Gate': {
    size: '8x10 ft',
    sqFt: '80 sq ft',
    notes:
      'Position at the main entry point. Confirm structural anchoring before installation.',
    elements: 'Powder-coated metal frame with fabric backdrop and LED trim.',
  },
  Props: {
    size: '4x4 ft',
    sqFt: '16 sq ft',
    notes:
      'Distribute evenly across the venue based on the floor plan. Handle with care during transport.',
    elements: 'Mixed foam and resin props with a hand-painted finish.',
  },
  'Artiste Stage Platform': {
    size: '20x16 ft',
    sqFt: '320 sq ft',
    notes:
      'Set up on a level, non-slip surface. Verify weight capacity before the artiste takes the stage.',
    elements: 'Modular aluminum decking with anti-slip surface and skirting.',
  },
};

const PlacementInstructionsModal = ({ open, onClose, placement }) => (
  <Modal
    open={open}
    onCancel={onClose}
    destroyOnClose
    title={
      <span className="flex items-center gap-2">
        <InfoCircleOutlined className="text-primary" />
        Placement Instructions
      </span>
    }
    footer={
      <Button type="primary" onClick={onClose}>
        Close
      </Button>
    }
  >
    {placement && (
      <>
        <div className="grid grid-cols-3 gap-3 rounded-xl bg-primary-lighest p-4">
          <div>
            <Text type="secondary" className="!text-[11px] font-semibold uppercase tracking-wide">Size</Text>
            <div className="mt-1 text-sm font-bold text-gray-900">{placement.size}</div>
          </div>
          <div>
            <Text type="secondary" className="!text-[11px] font-semibold uppercase tracking-wide">Quantity</Text>
            <div className="mt-1 text-sm font-bold text-gray-900">{placement.qty}</div>
          </div>
          <div>
            <Text type="secondary" className="!text-[11px] font-semibold uppercase tracking-wide">Sq Ft</Text>
            <div className="mt-1 text-sm font-bold text-gray-900">{placement.sqFt}</div>
          </div>
        </div>

        <div className="mt-5">
          <Text strong className="text-primary !text-xs uppercase tracking-wide">Notes</Text>
          <p className="mt-2 rounded-xl bg-primary-lighest p-3 text-sm leading-relaxed text-gray-700">
            {placement.notes}
          </p>
        </div>

        <div className="mt-5">
          <Text strong className="text-primary !text-xs uppercase tracking-wide">Elements &amp; Material</Text>
          <p className="mt-2 rounded-xl bg-primary-lighest p-3 text-sm leading-relaxed text-gray-700">
            {placement.elements}
          </p>
        </div>
      </>
    )}
  </Modal>
);

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
// Production Incharge and the decor/lighting catalog search are still
// static/mock — not part of this integration. Function Name and Vendor below
// are wired to the real list APIs (see fetchFunctionOptions / fetchVendorOptions).
const CATALOG_OPTIONS = [
  'Decorative Lighting',
  'LED Uplighting',
  'Chandelier',
  'Spotlights',
  'Fairy Lights',
  'Stage Wash Lights',
].map((o) => ({ value: o, label: o }));

const INCHARGE_OPTIONS = ['Rakesh Sharma', 'Priya Mehta', 'Anil Kumar', 'Sunita Rao'];

const initialItems = [
  {
    id: 1,
    name: 'Decorative Lighting',
    vendor: { id: null, label: 'Lumina Events' },
    qty: 50,
    rate: 150,
    description: 'Warm white LED fairy lights, 10m rolls',
    unit: 'Rolls',
    date: '',
    time: '',
    note: '',
    placements: [
      { label: 'Welcome Board', qty: 5 },
      { label: 'Entry Gate', qty: 20 },
      { label: 'Props', qty: 10 },
      { label: 'Artiste Stage Platform', qty: 15 },
    ],
    expanded: true,
  },
  {
    id: 2,
    name: 'LED Uplighting',
    vendor: { id: null, label: 'Bright Spark Rentals' },
    qty: 40,
    rate: 300,
    description: '',
    unit: 'Pieces',
    date: '',
    time: '',
    note: '',
    placements: [
      { label: 'Welcome Board', qty: 0 },
      { label: 'Entry Gate', qty: 0 },
      { label: 'Props', qty: 0 },
      { label: 'Artiste Stage Platform', qty: 0 },
    ],
    expanded: false,
  },
  {
    id: 3,
    name: 'Chandelier',
    vendor: { id: null, label: 'Lumina Events' },
    qty: 4,
    rate: 4500,
    description: '',
    unit: 'Pieces',
    date: '',
    time: '',
    note: '',
    placements: [
      { label: 'Welcome Board', qty: 0 },
      { label: 'Entry Gate', qty: 0 },
      { label: 'Props', qty: 0 },
      { label: 'Artiste Stage Platform', qty: 0 },
    ],
    expanded: false,
  },
];

const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const EventMandap = () => {
  const userId = Number(localStorage.getItem('userId'));

  const [eventInfo, setEventInfo] = useState({
    eventNo: 'EVT-2023-042',
    eventName: "Global Tech Summit '24",
    partyName: 'Acme Corp International',
    venue: 'Grand Horizon Center',
    eventDate: 'Oct 12, 2026 - Oct 15, 2026',
  });
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activePlacement, setActivePlacement] = useState(null);

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

  // Vendor dropdown — same list API VendorMaster.jsx uses (getAllClientMaster),
  // with the same "not Customer" category filter so this only ever offers
  // real vendors, not customer records.
  const fetchVendorOptions = useCallback(
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
        console.error('Failed to fetch vendors:', err);
        return [];
      }
    },
    [userId]
  );

  const toggleExpand = (id) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)));

  const updateItem = (id, field, value) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const updatePlacement = (id, index, value) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, placements: it.placements.map((p, i) => (i === index ? { ...p, qty: value } : p)) }
          : it
      )
    );

  const deleteItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

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

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: catalogPick || 'New Item',
      vendor: { id: null, label: '' },
      qty: 0,
      rate: 0,
      description: '',
      unit: '',
      date: '',
      time: '',
      note: '',
      placements: [
        { label: 'Welcome Board', qty: 0 },
        { label: 'Entry Gate', qty: 0 },
        { label: 'Props', qty: 0 },
        { label: 'Artiste Stage Platform', qty: 0 },
      ],
      expanded: true,
    };
    setItems((prev) => [...prev, newItem]);
    setCatalogPick('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ---------------- Header card ---------------- */}
        <EventHeaderCard
          title="Event Mandap"
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

          {/* Search / add row — light tint container matching the reference */}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary-lighest p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchOutlined className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
              <Select
                showSearch
                allowClear
                value={catalogPick || undefined}
                onChange={setCatalogPick}
                placeholder="Search decor, lighting, catering…"
                optionFilterProp="label"
                options={CATALOG_OPTIONS}
                suffixIcon={<DownOutlined className="text-gray-400" />}
                className="w-full [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!border-dashed [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!pl-9"
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
              Add Item
            </Button>
          </div>

          {/* Table header */}
          <div className="mt-6 hidden grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1fr_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
            <span>Item Name</span>
            <span>Vendor</span>
            <span className="text-center">Qty</span>
            <span className="text-center">Rate</span>
            <span className="text-right">Total Amount</span>
            <span />
          </div>

          {/* Item rows */}
          <div className="mt-2 space-y-3">
            {items.map((item) => {
              const total = item.qty * item.rate;
              const allocatedTotal = item.placements.reduce((sum, p) => sum + Number(p.qty || 0), 0);
              return (
                <div key={item.id} className="rounded-xl border border-primary-clarity overflow-hidden">
                  {/* collapsed row */}
                  <div className="grid grid-cols-2 gap-3 bg-primary-lighest px-4 py-4 sm:grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1fr_auto] sm:items-center">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-gray-600">{item.vendor?.label || '—'}</span>
                    <span className="text-gray-600 sm:text-center">{item.qty}</span>
                    <span className="text-gray-600 sm:text-center">{currency(item.rate)}</span>
                    <span className="font-bold text-primary sm:text-right">{currency(total)}</span>
                    <div className="flex items-center gap-3 justify-end col-span-2 sm:col-span-1">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => toggleExpand(item.id)}
                        aria-label="Edit item"
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteItem(item.id)}
                        aria-label="Delete item"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={item.expanded ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => toggleExpand(item.id)}
                        aria-label="Toggle details"
                      />
                    </div>
                  </div>

                  {/* expanded panel */}
                  {item.expanded && (
                    <div className="grid grid-cols-1 gap-6 border-t border-primary-clarity bg-white p-5 lg:grid-cols-2">
                      {/* Item details */}
                      <div className="space-y-4">
                        <Text strong className="text-primary text-md  uppercase tracking-wide">Item Details</Text>
                        <div>
                          <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Item Name</Text>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Description</Text>
                          <Input.TextArea
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Add a short description…"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Vendor</Text>
                            <AsyncSearchSelect
                              fetcher={fetchVendorOptions}
                              value={item.vendor}
                              onChange={(v) => updateItem(item.id, 'vendor', v)}
                              placeholder="Select vendor"
                            />
                          </div>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Unit</Text>
                            <Input
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Date</Text>
                            <DateField
                              value={item.date}
                              onChange={(val) => updateItem(item.id, 'date', val)}
                            />
                          </div>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Time</Text>
                            <TimeInput12h
                              value={item.time}
                              onChange={(val) => updateItem(item.id, 'time', val)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Price (₹)</Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              min={0}
                              value={item.rate}
                              onChange={(v) => updateItem(item.id, 'rate', v ?? 0)}
                            />
                          </div>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Total Qty</Text>
                            <InputNumber
                              style={{ width: '100%' }}
                              min={0}
                              value={item.qty}
                              onChange={(v) => updateItem(item.id, 'qty', v ?? 0)}
                            />
                          </div>
                        </div>
                        {/* <div>
                          <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Note</Text>
                          <Input.TextArea
                            rows={2}
                            value={item.note}
                            onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                            placeholder="Add any special instructions…"
                          />
                        </div> */}
                      </div>

                      {/* Allocation & media */}
                      <div className="space-y-4">
                        <Text strong className="text-primary text-md font-medium uppercase tracking-wide">Allocation &amp; Media</Text>

                        <div className="rounded-xl border border-primary-clarity bg-primary-lighest p-4">
                          <div className="flex items-center justify-between pb-2">
                            <span className="font-bold text-gray-900">Placements</span>
                            <span className="text-xs font-semibold uppercase text-gray-500">Qty</span>
                          </div>
                          <div className="space-y-2.5">
                            {item.placements.map((p, i) => (
                              <div key={p.label} className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                  {p.label}
                                  <Button
                                    type="text"
                                    size="small"
                                    icon={<InfoCircleOutlined className="text-gray-400 hover:text-primary" />}
                                    onClick={() =>
                                      setActivePlacement({
                                        ...(PLACEMENT_DETAILS[p.label] || {}),
                                        label: p.label,
                                        qty: p.qty,
                                      })
                                    }
                                    aria-label={`${p.label} placement instructions`}
                                  />
                                </span>
                                <InputNumber
                                  min={0}
                                  value={p.qty}
                                  onChange={(v) => updatePlacement(item.id, i, v ?? 0)}
                                  className="w-20"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-col gap-1 border-t border-primary-clarity pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-900">
                                Allocated Total: <span className="font-bold">{allocatedTotal} {item.unit}</span>
                              </span>
                              <span className="text-sm font-bold text-primary">Total Quantity: {currency(total)}</span>
                            </div>
                            <div className="flex justify-end">
                              <span className="text-sm font-bold text-primary">Total Price: {currency(total)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Reference Image</Text>
                          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                              <PictureOutlined style={{ fontSize: 20 }} />
                            </div>
                            <span className="flex-1 text-sm text-gray-500">No image uploaded</span>
                            <Button type="text" className="text-primary bg-primary-lighest rounded-full">
                              Change Image
                            </Button>
                          </div>
                        </div>

                        <Button icon={<MessageOutlined />}>SMS</Button>
                      </div>
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

      <PlacementInstructionsModal
        open={!!activePlacement}
        onClose={() => setActivePlacement(null)}
        placement={activePlacement}
      />
    </div>
  );
};

export default EventMandap;