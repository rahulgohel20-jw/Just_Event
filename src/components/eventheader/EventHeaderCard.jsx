import React from 'react';
import { Button, Typography, Input, Select, DatePicker, TimePicker } from 'antd';
import {
  SaveOutlined,
  PrinterOutlined,
  RedoOutlined,
  CheckSquareOutlined,
  DesktopOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import DateTimeField from '../form-inputs/DatePicker/DateTimeField';

const { Text, Title, Link } = Typography;

const DEFAULT_ACTIONS = [
  { key: 'save', icon: <SaveOutlined />, label: 'Save', primary: true, handlerProp: 'onSave' },
  { key: 'print', icon: <PrinterOutlined />, label: 'Print', handlerProp: 'onPrint' },
  { key: 'total', icon: <RedoOutlined />, label: 'Total', handlerProp: 'onTotal' },
  { key: 'status', icon: <CheckSquareOutlined />, label: 'Status', handlerProp: 'onStatus' },
  { key: 'presentation', icon: <DesktopOutlined />, label: 'Presentation', handlerProp: 'onPresentation' },
  { key: 'goto', icon: <ExportOutlined />, label: 'Go To', handlerProp: 'onGoTo' },
];

/* ------------------------------------------------------------------ */
/* Small local field bits — inline here, not shared.                   */
/* ------------------------------------------------------------------ */
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

/**
 * The header card shared by every "event x" page (Event Flower, Event
 * Lighting, etc.): title + toolbar, the read-only event summary row, and the
 * Reference / Incharge / Note + Setup / Dismantling inputs.
 *
 * The page below it (item list / catalog) stays page-specific and is not
 * part of this component — only wire up what differs page to page (title,
 * toolbar handlers, incharge options) via props.
 *
 * Pass `actions` to fully replace the default toolbar buttons; otherwise the
 * standard Save/Print/Total/Status/Presentation/Go To set is used, wired to
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
  inchargeOptions = [],

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
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            value={incharge || undefined}
            onChange={onInchargeChange}
            placeholder="Select Incharge"
            optionFilterProp="label"
            options={inchargeOptions.map((o) => ({ value: o, label: o }))}
          />
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