import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InputNumber,
  Input,
  Select,
  Button,
  Typography,
  Empty,
  Spin,
  Checkbox,
  DatePicker,
} from 'antd';

import { PlusOutlined, DeleteOutlined, DownOutlined, UploadOutlined, PrinterOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Save, Sparkles } from 'lucide-react';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import {
  getbyeventid,
  getalllistfuntionmaster,
  // TODO: confirm real endpoint names for this feature
  getfunctionflex,
  addupdateeventflex,
} from '@/services/apiServices';
import { showApiResult, showApiError } from '@/utils/swalHelpers';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
const { Title, Text } = Typography;

const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

let uid = 100;
const nextId = () => `id-${uid++}`;

const DATE_FORMAT = 'DD/MM/YYYY';

/* A single onsite expense row — maps 1:1 to a flexExpenseDetails entry */
const makeExpense = () => ({
  id: null,             // real detail id, null = new
  _uid: nextId(),
  included: true,       // the row checkbox — assumed to mean "include in billing/quotation"
  date: '',              // DD/MM/YYYY
  description: '',
  amount: 0,
  receiptUrl: null,      // existing receipt url from backend
  receiptFile: null,     // newly picked File, if any, pending upload
});

const buildExpensesFromDetails = (details) =>
  (details ?? []).map((row) => ({
    id: row.id ?? null,
    _uid: nextId(),
    included: row.included ?? true,
    date: row.date ?? '',
    description: row.particulars ?? '',
    amount: row.amount ?? 0,
    receiptUrl: row.receiptPath ?? null,
    receiptFile: null,
  }));

const EventFlexPage = () => {
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

  const [expenses, setExpenses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);


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

  /* ---------------- Function Name dropdown ---------------- */
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

  /* ---------------- load record for selected function ---------------- */
  const fetchRecordForFunction = useCallback(
    async (eventFunctionId) => {
      if (!eventFunctionId) {
        setRecordId(null);
        setExpenses([]);
        return;
      }
      setLoadingExpenses(true);
      try {
        const res = await getfunctionflex(eventFunctionId);
        const body = res?.data ?? res;
        const data = body?.data ?? null;

        if (!data) {
          setRecordId(null);
          setExpenses([]);
          setReference('');
          setIncharge(null);
          setNote('');
          setSetUpDateTime('');
          setDismantlingDateTime('');
          return;
        }

        setRecordId(data.id ?? null);

        setReference(data.reference ?? '');
        setIncharge(data.productionInchargeId ?? null);
        setNote(data.notesEnglish ?? '');
        setSetUpDateTime(data.setUpDateTime ?? '');
        setDismantlingDateTime(data.dismantlingDateTime ?? '');

      setExpenses(buildExpensesFromDetails(data.flexDetails));
      } catch (err) {
        console.error('Failed to fetch event flex detail:', err);
        setRecordId(null);
        setExpenses([]);
      } finally {
        setLoadingExpenses(false);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedFunction?.id) {
      fetchRecordForFunction(selectedFunction.id);
    }
  }, [selectedFunction?.id, fetchRecordForFunction]);

  /* ---------------- expense row helpers ---------------- */
  const addExpense = () => setExpenses((prev) => [...prev, makeExpense()]);

  const updateExpense = (uidToUpdate, field, value) =>
    setExpenses((prev) =>
      prev.map((e) => (e._uid === uidToUpdate ? { ...e, [field]: value } : e))
    );

  const removeExpense = (uidToRemove) =>
    setExpenses((prev) => prev.filter((e) => e._uid !== uidToRemove));

  const allIncluded = expenses.length > 0 && expenses.every((e) => e.included);
  const someIncluded = expenses.some((e) => e.included);

  const toggleAllIncluded = (checked) =>
    setExpenses((prev) => prev.map((e) => ({ ...e, included: checked })));

  const handleReceiptPick = (uidToUpdate, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateExpense(uidToUpdate, 'receiptFile', file);
    updateExpense(uidToUpdate, 'receiptUrl', previewUrl);
  };

  
  /* ---------------- save (THE ONLY handleSaveAll IN THIS FILE) ---------------- */
  const handleSaveAll = async () => {
    if (!selectedFunction?.id) {
      showApiError({ message: 'Select a function before saving.' }, { title: 'No function selected' });
      return;
    }

    if (!incharge) {
      showApiError({ message: 'Production Incharge is required.' }, { title: 'Missing Production Incharge' });
      return;
    }

    setSaving(true);
try {
  const formData = new FormData();

  if (recordId != null) formData.append('id', recordId);
  formData.append('eventId', Number(eventId));
  formData.append('eventFunctionId', selectedFunction.id);
  formData.append('reference', reference ?? '');
  formData.append('productionInchargeId', incharge ?? 0);
  formData.append('notesEnglish', note ?? '');
  formData.append('notesGujarati', '');
  formData.append('notesHindi', '');
  formData.append('setUpDateTime', setUpDateTime ?? '');
  formData.append('dismantlingDateTime', dismantlingDateTime ?? '');
  formData.append('userId', userId);

  const filteredExpenses = expenses.filter(
    (e) => e.description || Number(e.amount) > 0 || e.date
  );

  filteredExpenses.forEach((expense, index) => {
    const prefix = `flexDetails[${index}]`;
    if (expense.id != null) formData.append(`${prefix}.id`, expense.id);
    formData.append(`${prefix}.date`, expense.date ?? '');
    formData.append(`${prefix}.particulars`, expense.description ?? '');
    formData.append(`${prefix}.amount`, Number(expense.amount || 0));
    if (expense.receiptFile) {
      formData.append(`${prefix}.receipt`, expense.receiptFile);
    }
  });

  const res = await addupdateeventflex(formData);

      const success = showApiResult(res, {
        successTitle: 'Flex detail saved',
        errorTitle: 'Failed to save',
      });

      if (success) {
        fetchRecordForFunction(selectedFunction.id);
      }
    } catch (err) {
      console.error('Save event flex detail failed:', err);
      showApiError(err, { title: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  const flexActions = [
    { key: 'print', icon: <PrinterOutlined />, label: 'Print', onClick: () => {} },
    { key: 'status', icon: <InfoCircleOutlined />, label: 'Status', onClick: () => {} },
    { key: 'save', icon: <Save size={15} />, label: 'Save', primary: true, onClick: handleSaveAll },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <EventHeaderCard
          title="Event Flex Detail"
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
          actions={flexActions}
        />

        <div className="rounded-2xl border border-primary-clarity bg-white p-6 shadow-sm">
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

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-lighest p-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <span className="inline-block h-4 w-1 rounded bg-primary" />
              Onsite Expense Details
            </div>
            <Button type="primary" icon={<Sparkles size={16} />} onClick={addExpense} className="shrink-0 rounded-lg">
              Add Expense
            </Button>
          </div>

          {loadingExpenses ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-primary-clarity">
           

             <div className="hidden grid-cols-[1.2fr_2.4fr_1fr_1fr_auto] gap-3 bg-primary-lighest px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
  <span>Date</span>
  <span>Particular (Description)</span>
  <span>Amount</span>
  <span>Receipt</span>
  <span />
</div>

<div className="divide-y divide-gray-100">
  {expenses.map((expense) => (
    <div
      key={expense._uid}
      className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-[1.2fr_2.4fr_1fr_1fr_auto] sm:items-center"
    >
      <DatePicker
        style={{ width: '100%' }}
        format={DATE_FORMAT}
        value={expense.date ? dayjs(expense.date, DATE_FORMAT, true) : null}
        onChange={(val) => updateExpense(expense._uid, 'date', val ? val.format(DATE_FORMAT) : '')}
        placeholder="DD/MM/YYYY"
      />

      <Input
        value={expense.description}
        onChange={(e) => updateExpense(expense._uid, 'description', e.target.value)}
        placeholder="Describe the expense"
      />

      <InputNumber
        style={{ width: '100%' }}
        min={0}
        prefix="₹"
        value={expense.amount}
        onChange={(v) => updateExpense(expense._uid, 'amount', v ?? 0)}
      />

      <div className="flex items-center gap-2">
        <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white overflow-hidden">
          {expense.receiptUrl ? (
            expense.receiptFile?.type === 'application/pdf' ||
            /\.pdf($|\?)/i.test(expense.receiptUrl) ? (
              <span className="text-[10px] font-semibold text-gray-500">PDF</span>
            ) : (
              <img src={expense.receiptUrl} alt="Receipt" className="h-full w-full object-cover" />
            )
          ) : (
            <UploadOutlined className="text-gray-400" />
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleReceiptPick(expense._uid, e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="flex items-center justify-end col-span-2 sm:col-span-1">
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeExpense(expense._uid)}
          aria-label="Delete expense"
        />
      </div>
    </div>
  ))}

  {expenses.length === 0 && (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="No expenses yet — hit Add Expense to start."
      className="py-10"
    />
  )}
</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFlexPage;