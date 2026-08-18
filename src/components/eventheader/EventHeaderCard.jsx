import React, { useEffect, useRef, useState } from 'react';
import { Button, Typography, Input, Select, Spin } from 'antd';
import {
  PrinterOutlined,
  RedoOutlined,
  CheckSquareOutlined,
  DesktopOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import DateTimeField from '../form-inputs/DatePicker/DateTimeField';
import { getalluser } from '@/services/apiServices';

const { Text, Title, Link } = Typography;

const DEFAULT_ACTIONS = [
  { key: 'print', icon: <PrinterOutlined />, label: 'Print', handlerProp: 'onPrint' },
  { key: 'total', icon: <RedoOutlined />, label: 'Total', handlerProp: 'onTotal' },
  { key: 'status', icon: <CheckSquareOutlined />, label: 'Status', handlerProp: 'onStatus' },
  { key: 'presentation', icon: <DesktopOutlined />, label: 'Presentation', handlerProp: 'onPresentation' },
  { key: 'goto', icon: <ExportOutlined />, label: 'Go To', handlerProp: 'onGoTo' },
];

const FieldLabel = ({ children }) => (
  <Text type="secondary" className="block !text-xs font-semibold uppercase tracking-wide mb-2">
    {children}
  </Text>
);

const ReadField = ({ label, value, underline, onClick }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {onClick ? (
      <Link
        onClick={onClick}
        className={`!text-sm !font-semibold !text-gray-900 hover:!text-primary ${
          underline ? 'underline decoration-gray-400 hover:decoration-primary underline-offset-2' : ''
        }`}
      >
        {value}
      </Link>
    ) : (
      <Text
        strong
        className={`!text-sm text-gray-900 ${
          underline ? 'underline decoration-gray-400 underline-offset-2 w-fit' : ''
        }`}
      >
        {value}
      </Text>
    )}
  </div>
);

const inchargeDisplayName = (user) =>
  [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
  user.email ||
  user.companyName ||
  `User #${user.id}`;

const InchargeSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const debounceRef = useRef(null);

  const fetchOptions = async (query) => {
    setLoading(true);
    try {
      const res = await getalluser({
        cityId: null,
        clientId: null,
        companyName: '',
        countryId: null,
        isActive: true,
        isBlock: false,
        page: 0,
        roleId: null,
        search: query || '',
        size: 20,
        sortBy: 'id',
        sortDirection: 'DESC',
        stateId: null,
        userType: 'MEMBER',
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? [];
      setOptions((prev) => {
        const fetched = content.map((user) => ({ value: user.id, label: inchargeDisplayName(user) }));
        const preserved = value != null ? prev.filter((o) => o.value === value && !fetched.some((f) => f.value === o.value)) : [];
        return [...preserved, ...fetched];
      });
      setHasLoadedOnce(true);
    } catch (err) {
      console.error('Failed to fetch production incharge list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchOptions(text), 300);
  };

  const handleFocus = () => {
    if (!hasLoadedOnce && !loading) fetchOptions('');
  };

  // A preselected incharge id (e.g. loaded from a saved record) has no
  // matching option until the user opens/searches this select, so antd
  // renders the raw id instead of a name. Resolve it once in the
  // background so the label shows immediately on load.
  useEffect(() => {
    if (value == null) return;
    if (options.some((o) => o.value === value)) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await getalluser({
          cityId: null,
          clientId: null,
          companyName: '',
          countryId: null,
          isActive: null,
          isBlock: null,
          page: 0,
          roleId: null,
          search: '',
          size: 1000,
          sortBy: 'id',
          sortDirection: 'DESC',
          stateId: null,
          userType: 'MEMBER',
        });
        const body = res?.data ?? res;
        const content = body?.data?.content ?? [];
        const match = content.find((u) => u.id === value);
        if (match && !cancelled) {
          setOptions((prev) => (prev.some((o) => o.value === value) ? prev : [...prev, { value: match.id, label: inchargeDisplayName(match) }]));
        }
      } catch (err) {
        console.error('Failed to resolve production incharge label:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Select
      showSearch
      allowClear
      style={{ width: '100%' }}
      value={value ?? undefined}
      onChange={onChange}
      onSearch={handleSearch}
      onFocus={handleFocus}
      filterOption={false}
      placeholder="Select Incharge"
      options={options}
      notFoundContent={loading ? <Spin size="small" /> : 'No members found'}
    />
  );
};

/**
 * The header card shared by every "event x" page (Event Flower, Event
 * Lighting, etc.): title + toolbar, the read-only event summary row, and the
 * Reference / Incharge / Note + Setup / Dismantling inputs.
 *
 * Pass `actions` to fully replace the default toolbar buttons; otherwise the
 * standard Print/Total/Status/Presentation/Go To set is used, wired to
 * whichever on* handler props you pass (unset ones just render with no
 * onClick).
 */
const EventHeaderCard = ({
  title,
  eventInfo,
  onEventNoClick,

  reference,
  onReferenceChange,

  incharge,
  onInchargeChange,

  note,
  onNoteChange,

  setUpDateTime,
  onSetUpDateTimeChange,
  dismantlingDateTime,
  onDismantlingDateTimeChange,

  actions,
  onSave,
  onPrint,
  onTotal,
  onStatus,
  onPresentation,
  onGoTo,
}) => {
  const handlers = { onSave, onPrint, onTotal, onStatus, onPresentation, onGoTo };
  const toolbarActions = actions || DEFAULT_ACTIONS.map((a) => ({ ...a, onClick: handlers[a.handlerProp] }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Title level={3} className="!mb-0 !text-primary">{title}</Title>
        <div className="flex flex-wrap items-center gap-2">
          {toolbarActions.map((a) => (
            <Button
              key={a.key}
              type={a.primary ? 'primary' : 'default'}
              icon={a.icon}
              onClick={a.onClick}
              className='rounded-lg'
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        <ReadField label="Event No." value={eventInfo.eventNo} underline onClick={onEventNoClick} />
        <ReadField label="Event Name" value={eventInfo.eventName} />
        <ReadField label="Party Name" value={eventInfo.partyName} />
        <ReadField label="Venue" value={eventInfo.venue} />
        <ReadField label="Event Date (From - To)" value={eventInfo.eventDate} />
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <FieldLabel>Reference</FieldLabel>
          <Input
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="Enter reference"
        />
        </div>
        <div>
          <FieldLabel>Production Incharge</FieldLabel>
          <InchargeSelect value={incharge} onChange={onInchargeChange} />
        </div>
        <div>
          <FieldLabel>Note</FieldLabel>
          <Input
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add any special remarks…"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <FieldLabel>Setup</FieldLabel>
          <DateTimeField
            value={setUpDateTime}
            onChange={onSetUpDateTimeChange}
            placeholder="DD/MM/YYYY hh:mm A"
          />
        </div>
        <div>
          <FieldLabel>Dismantling</FieldLabel>
          <DateTimeField
            value={dismantlingDateTime}
            onChange={onDismantlingDateTimeChange}
            placeholder="DD/MM/YYYY hh:mm A"
          />
        </div>
      </div>
    </div>
  );
};

export default EventHeaderCard;