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
import { Save, MessageSquareText, Printer } from 'lucide-react';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import DateField from '../../../components/form-inputs/DatePicker/Datefield';
import TimeInput12h from '../../../components/form-inputs/Time/Timeinput12h';
import {
  getbyeventid,
  GetAllTrip,
  getAllClientMaster,
  GetAllTransportaion,
  AddUpdateEventFunctionTransportation,
  GetEventFunctionTransportation,
} from '@/services/apiServices';
import { AddTransportationModal } from '../../Master/TransportationMaster/AddTransportationModal';
import { showApiResult, showApiError } from '@/utils/swalHelpers';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { SelectReportTypeModal } from "@/partials/modals/Reports_Modal/Selectreporttypemodal";

const { Text, Title } = Typography;

const currency = (n, symbol = '₹') => `${symbol}${Number(n || 0).toLocaleString('en-IN')}`;

const emptyRow = (overrides = {}) => ({
  _uid: Date.now() + Math.random(),
  id: null,
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

const fetchTripLabelMap = async (userId) => {
  try {
    const res = await GetAllTrip({ nameEnglish: '', page: 0, size: 1000, sortBy: 'id', sortDirection: 'DESC', userId });
    const body = res?.data ?? res;
    const content = body?.data?.content ?? body?.data ?? [];
    return Object.fromEntries((Array.isArray(content) ? content : []).map((t) => [t.id, t.nameEnglish ?? '']));
  } catch (err) {
    console.error('Failed to fetch trip label map:', err);
    return {};
  }
};

const fetchVendorLabelMap = async (userId) => {
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
    console.error('Failed to fetch vendor label map:', err);
    return {};
  }
};

const EventTransportation = () => {
  const userId = Number(localStorage.getItem('userId'));

  const { eventId: routeEventId, functionId: routeFunctionId } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = routeEventId ?? searchParams.get('eventId');

  const [eventLoading, setEventLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

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

  const [transportPick, setTransportPick] = useState({ id: null, label: '' });
  const [isAddTransportationModalOpen, setIsAddTransportationModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [loadingRows, setLoadingRows] = useState(false);
  const [rows, setRows] = useState([]);
const [reportModalOpen, setReportModalOpen] = useState(false);

  const headerLoadedRef = useRef(false);

  useEffect(() => {
    if (!eventId) {
      setEventLoading(false);
      return;
    }
    headerLoadedRef.current = false;
    setEventLoading(true);
    getbyeventid(eventId)
      .then((res) => {
        const body = res?.data ?? res;
        const data = body?.data ?? body;
        setEventData(data);

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

  const fetchRecordForFunction = useCallback(
    async (eventFunctionId) => {
      if (!eventFunctionId) {
        setRecordId(null);
        setRows([]);
        return;
      }
      setLoadingRows(true);
      try {
        const res = await GetEventFunctionTransportation(eventFunctionId);
        const body = res?.data ?? res;
        const data = body?.data ?? null;

        if (!data) {
          setRecordId(null);
          setRows([]);
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

        const details = Array.isArray(data.transportationDetails) ? data.transportationDetails : [];

        setRows(
          details.map((item) =>
            emptyRow({
              id: item.id ?? null,
              date: item.date ?? '',
              vehicleNo: item.vehicleNumber ?? '',
              voucherNo: item.voucherNo ?? '',
              from: { id: item.fromId ?? null, label: '' },
              to: { id: item.toId ?? null, label: '' },
              transporter: { id: item.transporterId ?? null, label: '' },
              amount: item.amount ?? 0,
              timing: item.timing ?? '',
              remark: item.remarkEnglish ?? '',
            })
          )
        );

        const [tripMap, vendorMap] = await Promise.all([fetchTripLabelMap(userId), fetchVendorLabelMap(userId)]);

        setRows((prev) =>
          prev.map((row) => ({
            ...row,
            from: { ...row.from, label: tripMap[row.from.id] ?? row.from.label },
            to: { ...row.to, label: tripMap[row.to.id] ?? row.to.label },
            transporter: { ...row.transporter, label: vendorMap[row.transporter.id] ?? row.transporter.label },
          }))
        );
      } catch (err) {
        console.error('Failed to fetch event function transportation:', err);
        setRecordId(null);
        setRows([]);
      } finally {
        setLoadingRows(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (selectedFunction?.id) {
      fetchRecordForFunction(selectedFunction.id);
    }
  }, [selectedFunction?.id, fetchRecordForFunction]);

  const fetchTripOptions = useCallback(
    async (query) => {
      try {
        const res = await GetAllTrip({ nameEnglish: query, page: 0, size: 20, sortBy: 'id', sortDirection: 'DESC', userId });
        const body = res?.data ?? res;
        const content = body?.data?.content ?? body?.data ?? [];
        return (Array.isArray(content) ? content : []).map((item) => ({ id: item.id, label: item.nameEnglish }));
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        return [];
      }
    },
    [userId]
  );

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
        const vendorsOnly = Array.isArray(list) ? list.filter((item) => item.categoryTypeNameEnglish !== 'Customer') : [];
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

  const fetchTransportationOptions = useCallback(
    async (query) => {
      try {
        const res = await GetAllTransportaion({ page: 0, size: 50, sortBy: 'id', sortDirection: 'DESC', userId });
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
          .filter((o, i) => {
            const src = content[i];
            return !q || o.label.toLowerCase().includes(q) || src?.from?.nameEnglish?.toLowerCase().includes(q);
          });
      } catch (err) {
        console.error('Failed to fetch transportation list:', err);
        return [];
      }
    },
    [userId]
  );

  const updateRow = (uid, field, value) =>
    setRows((prev) => prev.map((r) => (r._uid === uid ? { ...r, [field]: value } : r)));

  const toggleExpand = (uid) =>
    setRows((prev) => prev.map((r) => (r._uid === uid ? { ...r, expanded: !r.expanded } : r)));

  const toggleConfirmed = (uid) =>
    setRows((prev) => prev.map((r) => (r._uid === uid ? { ...r, confirmed: !r.confirmed } : r)));

  const deleteRow = (uid) => setRows((prev) => prev.filter((r) => r._uid !== uid));

  const sendSms = (uid) => updateRow(uid, 'smsSent', true);

  const addBlankRow = () => setRows((prev) => [...prev, emptyRow()]);

  const handleTransportPickChange = (picked) => {
    setTransportPick(picked);
    if (!picked?.id) return;
    const raw = picked.raw || {};
    setRows((prev) => [
      ...prev,
      emptyRow({
        from: { id: raw.from?.id ?? null, label: raw.from?.nameEnglish ?? '' },
        to: { id: raw.to?.id ?? null, label: raw.to?.nameEnglish ?? '' },
        transporter: { id: raw.partyId ?? null, label: raw.partyName ?? '' },
        amount: raw.amount ?? 0,
      }),
    ]);
    setTransportPick({ id: null, label: '' });
  };

  const handleTransportationCreated = (saved) => {
    setRows((prev) => [
      ...prev,
      emptyRow({
        from: { id: saved?.from?.id ?? saved?.fromId ?? null, label: saved?.from?.nameEnglish ?? '' },
        to: { id: saved?.to?.id ?? saved?.toId ?? null, label: saved?.to?.nameEnglish ?? '' },
        transporter: { id: saved?.partyId ?? null, label: saved?.partyName ?? '' },
        amount: saved?.amount ?? 0,
      }),
    ]);
    setIsAddTransportationModalOpen(false);
  };

  const handleSaveAll = async () => {
    if (!selectedFunction?.id) {
      showApiError({ message: 'Select a function before saving.' }, { title: 'No function selected' });
      return;
    }

    const rowsToSave = rows.filter((r) => r.from?.id && r.to?.id);
    const skipped = rows.length - rowsToSave.length;

    // if (rowsToSave.length === 0) {
    //   showApiError(
    //     { message: 'Add at least one row with both From and To selected before saving.' },
    //     { title: 'Nothing to save' }
    //   );
    //   return;
    // }

    setSaving(true);
    try {
      const payload = {
        id: recordId ?? null,
        eventId: Number(eventId),
        eventFunctionId: selectedFunction.id,
        reference,
        productionInchargeId: incharge ?? 0,
        notesEnglish: note,
        notesGujarati: '',
        notesHindi: '',
        setUpDateTime,
        dismantlingDateTime,
        transportationDetails: rowsToSave.map((row) => ({
          id: row.id ?? null,
          fromId: row.from?.id,
          toId: row.to?.id,
          transporterId: row.transporter?.id ?? 0,
          amount: row.amount,
          vehicleNumber: row.vehicleNo,
          voucherNo: row.voucherNo,
          date: row.date,
          timing: row.timing,
          remarkEnglish: row.remark,
          remarkGujarati: '',
          remarkHindi: '',
        })),
        userId,
      };

      const res = await AddUpdateEventFunctionTransportation(payload);

      const success = showApiResult(res, {
        successTitle:
          skipped > 0
            ? `Saved ${rowsToSave.length} transport(s), skipped ${skipped} incomplete row(s)`
            : 'All transports saved',
        errorTitle: 'Failed to save',
      });

      if (success) {
        fetchRecordForFunction(selectedFunction.id);
      }
    } catch (err) {
      console.error('Save event function transportation failed:', err);
      showApiError(err, { title: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const totalAmount = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        
        <EventHeaderCard
          title="Event Transportation"
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
            <div className='flex justify-between'>

            
          <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-100">
            <Title level={4} className="!mb-0 !text-gray-900">
              Function Name
            </Title>
            <Select
              showSearch
              allowClear={false}
              value={selectedFunction?.id ?? undefined}
              onChange={(id) => {
                const opt = functionOptions.find((o) => o.value === id);
                setSelectedFunction(opt ? { id: opt.value, label: opt.label } : { id: null, label: '' });
              }}
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
 <Button
    icon={<Printer size={16} />}
    onClick={() => setReportModalOpen(true)}
    className="shrink-0 !bg-white rounded-lg "
  >
    Print
  </Button>
             <Button icon={<Save size={15} />} type="primary" loading={saving} onClick={handleSaveAll} className="rounded-lg">
              Save
            </Button>
          </div>

          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Text strong className="!text-lg text-gray-900">
              | Transportation
            </Text>
            <div className="flex flex-wrap items-center gap-2">
              <Button icon={<PlusOutlined />} onClick={addBlankRow} className="rounded-lg">
                Add
              </Button>
              <Button type="primary" icon={<Save size={15} />} onClick={() => setIsAddTransportationModalOpen(true)} className="rounded-lg">
                Add Transportation
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <AsyncTransportationSelect
              fetcher={fetchTransportationOptions}
              value={transportPick}
              onChange={handleTransportPickChange}
              placeholder="Search a planned route (origin, destination, transporter)…"
            />
          </div>

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

          {loadingRows ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {rows.map((row) => (
                <div
                  key={row._uid}
                  className={`rounded-xl border px-3 py-3 ${
                    row.confirmed ? 'border-primary-clarity bg-primary-lighest/40' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[28px_1fr_1.2fr_1.2fr_1fr_1fr_1.2fr_1fr_1fr_1.2fr_1.2fr]">
                    <Checkbox checked={row.confirmed} onChange={() => toggleConfirmed(row._uid)} />

                    <DateField value={row.date} onChange={(val) => updateRow(row._uid, 'date', val)} />

                    <Input value={row.vehicleNo} onChange={(e) => updateRow(row._uid, 'vehicleNo', e.target.value)} placeholder="Vehicle No." />

                    <Input value={row.voucherNo} onChange={(e) => updateRow(row._uid, 'voucherNo', e.target.value)} placeholder="Voucher No." />

                    <AsyncSearchSelect fetcher={fetchTripOptions} value={row.from} onChange={(v) => updateRow(row._uid, 'from', v)} placeholder="From" />

                    <AsyncSearchSelect fetcher={fetchTripOptions} value={row.to} onChange={(v) => updateRow(row._uid, 'to', v)} placeholder="To" />

                    <AsyncSearchSelect
                      fetcher={fetchVendorOptions}
                      value={row.transporter}
                      onChange={(v) => updateRow(row._uid, 'transporter', v)}
                      placeholder="Transporter"
                    />

                    <InputNumber min={0} value={row.amount} onChange={(v) => updateRow(row._uid, 'amount', v ?? 0)} prefix="₹" style={{ width: '100%' }} />

                    <TimeInput12h value={row.timing} onChange={(val) => updateRow(row._uid, 'timing', val)} />

                    <Input value={row.remark} onChange={(e) => updateRow(row._uid, 'remark', e.target.value)} placeholder="Remark" />

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="small"
                        icon={<MessageSquareText size={13} />}
                        onClick={() => sendSms(row._uid)}
                        className={`rounded-full !text-xs ${row.smsSent ? '!bg-emerald-50 !text-emerald-600 !border-emerald-200' : ''}`}
                      >
                        SMS
                      </Button>
                      <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => deleteRow(row._uid)} aria-label="Delete row" />
                      <Button
                        type="text"
                        size="small"
                        icon={row.expanded ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => toggleExpand(row._uid)}
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
                        onChange={(e) => updateRow(row._uid, 'remark', e.target.value)}
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
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4">
            <Text type="secondary" className="text-sm">
              Showing {rows.length} planned {rows.length === 1 ? 'transport' : 'transports'}
            </Text>
            <Text strong className="!text-sm text-gray-700">
              TOTAL AMOUNT <span className="text-lg font-bold text-primary"> : {currency(totalAmount)}</span>
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
      <SelectReportTypeModal
  open={reportModalOpen}
  onClose={() => setReportModalOpen(false)}
  eventId={eventId}
  mode="transportation"
  onGenerateReport={() => {
    setReportModalOpen(false);
  }}
/>

    </div>
  );
};

export default EventTransportation;