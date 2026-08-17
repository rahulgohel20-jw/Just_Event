import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Checkbox,
  Empty,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Save, MessageSquareText } from 'lucide-react';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import {
  getalllistfuntionmaster,
  GetAllTrip,
  getAllClientMaster,
  GetAllTransportaion,
   AddUpdateEventFunctionTransportation,
  GetEventFunctionTransportation,
  AddTransportation,
} from '@/services/apiServices';
import { AddTransportationModal } from '../../Master/TransportationMaster/AddTransportationModal';
import { showApiResult, showApiError } from '@/utils/swalHelpers';
import { useSearchParams } from 'react-router-dom';
import DateTimeField from '../../../components/form-inputs/DatePicker/DateTimeField';
import DateField from '../../../components/form-inputs/DatePicker/Datefield';
import TimeInput12h from '../../../components/form-inputs/Time/Timeinput12h';

const { Text, Title } = Typography;

/* ------------------------------------------------------------------ */
/* Small async search-select — same pattern used in EventSound.jsx     */
/* ------------------------------------------------------------------ */
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
      suffixIcon={<DownOutlined className="text-gray-400" />}
    />
  );
};

const INCHARGE_OPTIONS = ['Rakesh Sharma', 'Priya Mehta', 'Anil Kumar', 'Sunita Rao'];

const currency = (n, symbol = '₹') => `${symbol}${Number(n || 0).toLocaleString('en-IN')}`;

const emptyRow = (overrides = {}) => ({
  id: Date.now() + Math.random(),
  masterId: null,
  confirmed: false,
  date: '',
  vehicleNo: '',
  voucherNo: '',
  from: { id: null, label: '' },
  to: { id: null, label: '' },
  transporter: { id: null, label: '' },
  amount: 0,
  timing: '',
  remark: '',
  smsSent: false,
  expanded: false,
  ...overrides,
});

const EventTransportation = () => {
  const userId = Number(localStorage.getItem('userId'));

  const [eventInfo, setEventInfo] = useState({
    eventNo: 'EVT-2023-042',
    eventName: "Global Tech Summit '24",
    partyName: 'Acme Corp International',
    venue: 'Grand Horizon Center',
    eventDate: 'Oct 12, 2026 - Oct 15, 2026',
  });

  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get('eventId')); 


  const [reference, setReference] = useState('');
  const [incharge, setIncharge] = useState('');
  const [note, setNote] = useState('');
 const [setUpDateTime, setSetUpDateTime] = useState('');
const [dismantlingDateTime, setDismantlingDateTime] = useState('');

  const [selectedFunction, setSelectedFunction] = useState({ id: null, label: 'Gala Dinner' });
  const [functionOptions, setFunctionOptions] = useState([]);

  // The value currently picked from the Transportation Master search dropdown,
  // waiting to be inserted into the table via "Add" (search-pick flow).
  const [transportPick, setTransportPick] = useState({ id: null, label: '' });

  // Controls the full "Add Transportation" modal (create a brand-new
  // Transportation Master record and drop it straight into this table).
  const [isAddTransportationModalOpen, setIsAddTransportationModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState([]);

  // Load existing event-function transportation records when a function is chosen.
  useEffect(() => {
    if (!selectedFunction?.id) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await GetEventFunctionTransportation(selectedFunction.id);
        const body = res?.data ?? res;
        const content = body?.data?.content ?? body?.data ?? [];

        const loaded = (Array.isArray(content) ? content : []).map((item, idx) => ({
          id: item.id ?? Date.now() + idx,
          masterId: item.id ?? null,
          confirmed: item.confirmed ?? false,
          date: item.date ?? '',
          vehicleNo: item.vehicleNo ?? '',
          voucherNo: item.voucherNo ?? '',
          from: { id: item.fromId ?? item.from?.id ?? null, label: item.from?.nameEnglish ?? item.fromName ?? '' },
          to: { id: item.toId ?? item.to?.id ?? null, label: item.to?.nameEnglish ?? item.toName ?? '' },
          transporter: { id: item.partyId ?? null, label: item.partyName ?? item.transporterName ?? '' },
          amount: item.amount ?? 0,
          timing: item.timing ?? '',
          remark: item.remark ?? '',
          smsSent: item.smsSent ?? false,
          expanded: false,
        }));

        if (!cancelled) setRows(loaded);
      } catch (err) {
        console.error('Failed to load event-function transportation:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedFunction?.id]);

  

  // Function Name dropdown — same list/search API FunctionMaster.jsx uses.
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

  // From / To dropdowns — Trip Master locations (same source Transportation
  // Master's Add modal uses for Transport_begin / Transport_end).
  const fetchTripOptions = useCallback(
    async (query) => {
      try {
        const res = await GetAllTrip({
          nameEnglish: query,
          page: 0,
          size: 20,
          sortBy: 'id',
          sortDirection: 'DESC',
          userId,
        });
        const body = res?.data ?? res;
        const content = body?.data?.content ?? body?.data ?? [];
        return (Array.isArray(content) ? content : []).map((item) => ({
          id: item.id,
          label: item.nameEnglish,
        }));
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        return [];
      }
    },
    [userId]
  );

  // Transporter dropdown — vendor list, same "not Customer" rule VendorMaster
  // and Transportation Master's Agency picker use.
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

  // Search dropdown over the Transportation Master list itself — pick an
  // existing planned route (from / to / transporter / amount) and drop it
  // straight into the table via "Add Transportation".
  const fetchTransportationOptions = useCallback(
    async (query) => {
      try {
        const res = await GetAllTransportaion({
          page: 0,
          size: 50,
          sortBy: 'id',
          sortDirection: 'DESC',
          userId,
        });
        const body = res?.data ?? res;
        const content = body?.data?.content ?? body?.data ?? [];
        const q = (query || '').trim().toLowerCase();

        return (Array.isArray(content) ? content : [])
          .map((item) => ({
            id: item.id,
            from: item.from,
            to: item.to,
            partyId: item.partyId,
            partyName: item.partyName,
            amount: item.amount,
            label: `${item.from?.nameEnglish || '?'} → ${item.to?.nameEnglish || '?'} · ${item.partyName || 'No transporter'} · ${currency(item.amount)}`,
          }))
          .filter(
            (o) =>
              !q ||
              o.label.toLowerCase().includes(q) ||
              item?.from?.nameEnglish?.toLowerCase().includes(q)
          );
      } catch (err) {
        console.error('Failed to fetch transportation list:', err);
        return [];
      }
    },
    [userId]
  );

  const updateRow = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const toggleExpand = (id) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, expanded: !r.expanded } : r)));

  const toggleConfirmed = (id) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, confirmed: !r.confirmed } : r)));

  const deleteRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const sendSms = (id) => {
    // TODO: wire to real SMS/notification API once available.
    updateRow(id, 'smsSent', true);
  };

  // "+ Add" — blank row the user fills in manually.
  const addBlankRow = () => setRows((prev) => [...prev, emptyRow()]);

  // Picking from the search dropdown above the table drops the route
  // straight into a new row (no extra click needed, since "Add Transportation"
  // now opens the full create modal instead).
  const handleTransportPickChange = (picked) => {
    setTransportPick(picked);
    if (!picked?.id) return;
    const raw = picked.raw || {};
    setRows((prev) => [
      ...prev,
      emptyRow({
        masterId: raw.id ?? null,
        from: { id: raw.from?.id ?? null, label: raw.from?.nameEnglish ?? '' },
        to: { id: raw.to?.id ?? null, label: raw.to?.nameEnglish ?? '' },
        transporter: { id: raw.partyId ?? null, label: raw.partyName ?? '' },
        amount: raw.amount ?? 0,
      }),
    ]);
    setTransportPick({ id: null, label: '' });
  };

  // Called when AddTransportationModal saves a brand-new Transportation
  // Master record — drop it straight into this event's table as a row.
  const handleTransportationCreated = (saved) => {
    setRows((prev) => [
      ...prev,
      emptyRow({
        masterId: saved?.id ?? null,
        from: { id: saved?.from?.id ?? saved?.fromId ?? null, label: saved?.from?.nameEnglish ?? '' },
        to: { id: saved?.to?.id ?? saved?.toId ?? null, label: saved?.to?.nameEnglish ?? '' },
        transporter: {
          id: saved?.partyId ?? null,
          label: saved?.partyName ?? '',
        },
        amount: saved?.amount ?? 0,
      }),
    ]);
    setIsAddTransportationModalOpen(false);
  };

  // Main "Save" button — persists every row as a Transportation Master
  // record (from/to/agency/amount + vehicle no, voucher no, date, timing,
  // remark). New rows are created (id: null); rows that came from an
  // existing master record (masterId set) are updated in place.
const handleSaveAll = async () => {
  if (!selectedFunction?.id) {
    showApiError(
      { message: 'Please select a Function Name before saving.' },
      { title: 'Function required' }
    );
    return;
  }

  const rowsToSave = rows.filter((r) => r.from?.id && r.to?.id);
  const skipped = rows.length - rowsToSave.length;

  if (rowsToSave.length === 0) {
    showApiError(
      { message: 'Add at least one row with both From and To selected before saving.' },
      { title: 'Nothing to save' }
    );
    return;
  }

  setSaving(true);
  try {
    const payload = {
      dismantlingDateTime: dismantlingDateTime || '',
      eventFunctionId: selectedFunction.id,
      eventId: eventId,
      id: null,
      notesEnglish: note || '',
      notesGujarati: '',
      notesHindi: '',
      productionInchargeId: null,
      reference: reference || '',
      setUpDateTime: setUpDateTime || '',
      transportationDetails: rowsToSave.map((row) => ({
        amount: row.amount ?? 0,
        date: row.date ?? '',
        fromId: row.from?.id ?? 0,
        id: null,
        remarkEnglish: row.remark ?? '',
        remarkGujarati: '',
        remarkHindi: '',
        timing: row.timing ?? '',
        toId: row.to?.id ?? 0,
        transporterId: row.transporter?.id ?? 0,
        vehicleNumber: row.vehicleNo ?? '',
        voucherNo: row.voucherNo ?? '',
      })),
      userId,
    };

    await AddUpdateEventFunctionTransportation(payload);

    showApiResult(
      { data: { success: true } },
      {
        successTitle:
          skipped > 0
            ? `Saved ${rowsToSave.length} transport(s), skipped ${skipped} incomplete row(s)`
            : 'All transports saved',
      }
    );
  } catch (err) {
    console.error('Save transportation failed:', err);
    showApiError(err, { title: 'Something went wrong' });
  } finally {
    setSaving(false);
  }
};
  const totalAmount = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
       

        {/* ---------------- Header card (reused from EventSound) ---------------- */}
  <EventHeaderCard
  title="Event Transportation"
  eventInfo={eventInfo}
  onEventNoClick={() => {}}
  reference={reference}
  onReferenceChange={setReference}
  incharge={incharge}
  onInchargeChange={setIncharge}
  inchargeOptions={INCHARGE_OPTIONS}
  note={note}
  onNoteChange={setNote}
  setUpDateTime={setUpDateTime}
  onSetUpDateTimeChange={setSetUpDateTime}
  dismantlingDateTime={dismantlingDateTime}
  onDismantlingDateTimeChange={setDismantlingDateTime}
  onSave={handleSaveAll}
/>

        {/* ---------------- Transportation card ---------------- */}
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

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Text strong className="!text-lg text-gray-900">| Transportation</Text>
            <div className="flex flex-wrap items-center gap-2">
              <Button icon={<PlusOutlined />} onClick={addBlankRow} className="rounded-lg">
                Add
              </Button>
              <Button
                type="primary"
                icon={<Save size={15} />}
                onClick={() => setIsAddTransportationModalOpen(true)}
                className="rounded-lg"
              >
                Add Transportation
              </Button>
            </div>
          </div>

          {/* Search dropdown over the Transportation Master list */}
          <div className="mt-3">
            <AsyncTransportationSelect
              fetcher={fetchTransportationOptions}
              value={transportPick}
              onChange={handleTransportPickChange}
              placeholder="Search a planned route (origin, destination, transporter)…"
            />
          </div>

          {/* Table header */}
          <div className="mt-6 hidden grid-cols-[28px_1fr_1.2fr_1.2fr_1fr_1fr_1.2fr_1fr_1fr_1.2fr_1.2fr] items-center gap-2 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
            <span />
            <span>Date</span>
            <span>Vehicle No.</span>
            <span>Voucher No.</span>
            <span>From</span>
            <span>To</span>
            <span>Transporter</span>
            <span className="text-right">Amount</span>
            <span>Timing</span>
            <span>Remark</span>
            <span className="text-right">Action</span>
          </div>

          {/* Rows */}
          <div className="mt-2 space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className={`rounded-xl border px-3 py-3 ${
                  row.confirmed ? 'border-primary-clarity bg-primary-lighest/40' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[28px_1fr_1.2fr_1.2fr_1fr_1fr_1.2fr_1fr_1fr_1.2fr_1.2fr]">
                  <Checkbox checked={row.confirmed} onChange={() => toggleConfirmed(row.id)} />

                  <DateField value={row.date} onChange={(val) => updateRow(row.id, 'date', val)} />

                  <Input
                    value={row.vehicleNo}
                    onChange={(e) => updateRow(row.id, 'vehicleNo', e.target.value)}
                    placeholder="Vehicle No."
                  />

                  <Input
                    value={row.voucherNo}
                    onChange={(e) => updateRow(row.id, 'voucherNo', e.target.value)}
                    placeholder="Voucher No."
                  />

                  <AsyncSearchSelect
                    fetcher={fetchTripOptions}
                    value={row.from}
                    onChange={(v) => updateRow(row.id, 'from', v)}
                    placeholder="From"
                  />

                  <AsyncSearchSelect
                    fetcher={fetchTripOptions}
                    value={row.to}
                    onChange={(v) => updateRow(row.id, 'to', v)}
                    placeholder="To"
                  />

                  <AsyncSearchSelect
                    fetcher={fetchVendorOptions}
                    value={row.transporter}
                    onChange={(v) => updateRow(row.id, 'transporter', v)}
                    placeholder="Transporter"
                  />

                  <InputNumber
                    min={0}
                    value={row.amount}
                    onChange={(v) => updateRow(row.id, 'amount', v ?? 0)}
                    prefix="₹"
                    style={{ width: '100%' }}
                  />

                  <TimeInput12h value={row.timing} onChange={(val) => updateRow(row.id, 'timing', val)} />

                  <Input
                    value={row.remark}
                    onChange={(e) => updateRow(row.id, 'remark', e.target.value)}
                    placeholder="Remark"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="small"
                      icon={<MessageSquareText size={13} />}
                      onClick={() => sendSms(row.id)}
                      className={`rounded-full !text-xs ${
                        row.smsSent ? '!bg-emerald-50 !text-emerald-600 !border-emerald-200' : ''
                      }`}
                    >
                      SMS
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deleteRow(row.id)}
                      aria-label="Delete row"
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={row.expanded ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => toggleExpand(row.id)}
                      aria-label="Toggle details"
                    />
                  </div>
                </div>

                {row.expanded && (
                  <div className="mt-3 rounded-lg bg-primary-lighest p-3 text-sm text-gray-600">
                    <Text type="secondary" className="!text-xs font-semibold uppercase tracking-wide">
                      Full remark
                    </Text>
                    <Input.TextArea
                      className="mt-2"
                      rows={2}
                      value={row.remark}
                      onChange={(e) => updateRow(row.id, 'remark', e.target.value)}
                      placeholder="Add any special instructions for this transport…"
                    />
                  </div>
                )}
              </div>
            ))}

            {rows.length === 0 && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No transports planned yet — use Add or Add Transportation above."
                className="py-10"
              />
            )}
          </div>

          {/* Footer summary */}
          <div className="mt-5 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
            <Text type="secondary" className="text-sm">
              Showing {rows.length} planned {rows.length === 1 ? 'transport' : 'transports'}
            </Text>
            <Text strong className="!text-sm text-gray-700">
              TOTAL AMOUNT <span className='text-lg font-bold text-primary'> : {currency(totalAmount)}</span>
            </Text>
          </div>
        </div>
      </div>

      <AddTransportationModal
        open={isAddTransportationModalOpen}
        onClose={() => setIsAddTransportationModalOpen(false)}
        onSave={handleTransportationCreated}
        initialData={null}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Search dropdown over existing Transportation Master records         */
/* ------------------------------------------------------------------ */
const AsyncTransportationSelect = ({ fetcher, value, onChange, placeholder, debounceMs = 300 }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await fetcher(query);
      setOptions(results || []);
      setLoading(false);
    }, debounceMs);
  };

  return (
    <Select
      showSearch
      allowClear
      value={value?.id || undefined}
      placeholder={placeholder}
      style={{ width: '100%' }}
      filterOption={false}
      onSearch={handleSearch}
      onFocus={() => handleSearch('')}
      onChange={(id) => {
        const picked = options.find((o) => o.id === id);
        onChange(picked ? { id: picked.id, label: picked.label, raw: picked } : { id: null, label: '' });
      }}
      notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No matches" />}
      options={options.map((o) => ({ value: o.id, label: o.label }))}
      suffixIcon={<SearchOutlined className="text-gray-400" />}
      className="[&_.ant-select-selector]:!bg-primary-lighest [&_.ant-select-selector]:!border-dashed"
    />
  );
};

export default EventTransportation;