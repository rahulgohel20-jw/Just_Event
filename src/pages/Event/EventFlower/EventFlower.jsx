import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Save,
  Printer,
  RotateCcw,
  ListChecks,
  MonitorPlay,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Pencil,
  Trash2,
  Info,
  ImageIcon,
  MessageSquare,
  Loader2,
  X,
  AlignLeft,
  Layers,
} from 'lucide-react';
import { getalllistfuntionmaster, getAllClientMaster } from '@/services/apiServices';

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const MAROON = '#9C2249';
const MAROON_DARK = '#7E1B3B';
const TINT_BG = '#FBEFF2';
const TINT_BORDER = '#F2D9E0';

/* ------------------------------------------------------------------ */
/* Reusable searchable dropdown                                        */
/* ------------------------------------------------------------------ */
/**
 * Two modes:
 *  - static:  pass `options` (array of strings) — filters client-side, `value`/`onChange` are plain strings.
 *  - async:   pass `fetcher` (async (query) => [{ id, label }]) — debounces the query, hits the API on
 *             every keystroke (and once on open), shows a loading state, `value`/`onChange` are
 *             `{ id, label }` objects so the underlying id survives for save payloads.
 */
const SearchableSelect = ({
  options,
  fetcher,
  value,
  onChange,
  placeholder = 'Select…',
  leadingIcon,
  className = '',
  debounceMs = 300,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Async mode: re-fetch from the API whenever the dropdown is open and the
  // query changes, debounced so we don't fire a request on every keystroke.
  useEffect(() => {
    if (!fetcher || !open) return;
    let cancelled = false;
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await fetcher(query);
      if (!cancelled) {
        setAsyncOptions(Array.isArray(results) ? results : []);
        setLoading(false);
      }
    }, debounceMs);
    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
  }, [fetcher, open, query, debounceMs]);

  const list = fetcher
    ? asyncOptions.map((o) => ({ key: o.id ?? o.label, label: o.label, raw: o }))
    : (options || [])
        .filter((o) => o.toLowerCase().includes(query.toLowerCase()))
        .map((o) => ({ key: o, label: o, raw: o }));

  const displayLabel = fetcher ? value?.label : value;
  const isSelected = (opt) =>
    fetcher ? value && opt.raw.id === value.id : opt.raw === value;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-sm text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249] transition-colors"
      >
        {leadingIcon && <span className="text-gray-400 shrink-0">{leadingIcon}</span>}
        <span className={`flex-1 truncate ${displayLabel ? 'text-gray-900' : 'text-gray-400'}`}>
          {displayLabel || placeholder}
        </span>
        {loading ? (
          <Loader2 size={16} className="animate-spin text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search…"
              className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#9C2249]/30"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {loading && (
              <div className="px-3.5 py-2 text-sm text-gray-400">Searching…</div>
            )}
            {!loading && list.length === 0 && (
              <div className="px-3.5 py-2 text-sm text-gray-400">No matches</div>
            )}
            {!loading &&
              list.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    onChange(opt.raw);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm hover:bg-[#FBEFF2] transition-colors ${
                    isSelected(opt) ? 'text-[#9C2249] font-medium bg-[#FBEFF2]' : 'text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">
    {children}
  </label>
);

const ReadField = ({ label, value, underline, onClick }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {onClick ? (
      <button
        type="button"
        onClick={onClick}
        className={`text-sm font-semibold text-gray-900 hover:text-[#9C2249] transition-colors ${
          underline ? 'underline decoration-gray-400 hover:decoration-[#9C2249] underline-offset-2' : ''
        }`}
      >
        {value}
      </button>
    ) : (
      <div
        className={`text-sm font-semibold text-gray-900 ${
          underline ? 'underline decoration-gray-400 underline-offset-2 w-fit' : ''
        }`}
      >
        {value}
      </div>
    )}
  </div>
);

const ToolbarButton = ({ icon, label, primary, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      primary
        ? 'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors'
        : 'flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
    }
    style={primary ? { backgroundColor: MAROON } : undefined}
    onMouseEnter={(e) => {
      if (primary) e.currentTarget.style.backgroundColor = MAROON_DARK;
    }}
    onMouseLeave={(e) => {
      if (primary) e.currentTarget.style.backgroundColor = MAROON;
    }}
  >
    {icon}
    {label}
  </button>
);

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

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filtered = EVENTS_LIST.filter((ev) =>
    !q ||
    ev.name.toLowerCase().includes(q) ||
    ev.code.toLowerCase().includes(q) ||
    ev.type.toLowerCase().includes(q) ||
    ev.date.includes(q)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-6 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, type or date…"
              className="w-full rounded-xl border border-transparent bg-[#FBEFF2] py-2.5 pl-10 pr-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto px-3 pb-4">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-gray-400">No events found</div>
          )}
          {filtered.map((ev, i) => {
            const isRose = i % 2 === 0;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => onSelect(ev)}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isRose ? 'bg-[#FBEFF2] text-[#9C2249]' : 'bg-violet-100 text-violet-600'
                  }`}
                >
                  {ev.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-gray-900">{ev.name}</span>
                  <span className="block truncate text-sm text-gray-500">
                    {ev.code} · {ev.date}{ev.time ? ` ${ev.time}` : ''} · {ev.type}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
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

const PlacementInstructionsModal = ({ open, onClose, placement }) => {
  if (!open || !placement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <Info size={18} style={{ color: MAROON }} />
            <h2 className="text-base font-bold text-gray-900">Placement Instructions</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-3 gap-3 rounded-xl p-4" style={{ backgroundColor: TINT_BG }}>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Size</div>
              <div className="mt-1 text-sm font-bold text-gray-900">{placement.size}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Quantity</div>
              <div className="mt-1 text-sm font-bold text-gray-900">{placement.qty}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Sq Ft</div>
              <div className="mt-1 text-sm font-bold text-gray-900">{placement.sqFt}</div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: MAROON }}>
            <AlignLeft size={13} />
            Notes
          </div>
          <p className="mt-2 rounded-xl p-3 text-sm leading-relaxed text-gray-700" style={{ backgroundColor: TINT_BG }}>
            {placement.notes}
          </p>
        </div>

        <div className="px-6 pt-5 pb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: MAROON }}>
            <Layers size={13} />
            Elements &amp; Material
          </div>
          <p className="mt-2 rounded-xl p-3 text-sm leading-relaxed text-gray-700" style={{ backgroundColor: TINT_BG }}>
            {placement.elements}
          </p>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: MAROON }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MAROON_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = MAROON)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
// Production Incharge and the decor/lighting/catering catalog search are still
// static/mock — not part of this integration. Function Name and Vendor below
// are wired to the real list APIs (see fetchFunctionOptions / fetchVendorOptions).
const INCHARGE_OPTIONS = ['Rakesh Sharma', 'Priya Mehta', 'Anil Kumar', 'Sunita Rao'];
const CATALOG_OPTIONS = [
  'Flowers & Props',
  'Decorative Lighting',
  'Floral Centerpieces',
  'Balloon Arch',
  'Fabric Draping',
  'Candle Stands',
];

const initialItems = [
  {
    id: 1,
    name: 'Flowers & Props',
    vendor: { id: null, label: 'Vishal Bhai' },
    qty: 100,
    rate: 12,
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
    id: 2,
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
    id: 3,
    name: 'Floral Centerpieces',
    vendor: { id: null, label: 'Vishal Bhai' },
    qty: 25,
    rate: 800,
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

const currency = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN')}`;

const EventFlower = () => {
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
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it))
    );

  const updateItem = (id, field, value) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );

  const updatePlacement = (id, index, value) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              placements: it.placements.map((p, i) =>
                i === index ? { ...p, qty: value } : p
              ),
            }
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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold" style={{ color: MAROON }}>
              Event Flower
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <ToolbarButton primary icon={<Save size={16} />} label="Save" />
              <ToolbarButton icon={<Printer size={16} />} label="Print" />
              <ToolbarButton icon={<RotateCcw size={16} />} label="Total" />
              <ToolbarButton icon={<ListChecks size={16} />} label="Status" />
              <ToolbarButton icon={<MonitorPlay size={16} />} label="Presentation" />
              <ToolbarButton icon={<ExternalLink size={16} />} label="Go To" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
            <ReadField
              label="Event No."
              value={eventInfo.eventNo}
              underline
              onClick={() => setIsEventModalOpen(true)}
            />
            <ReadField label="Event Name" value={eventInfo.eventName} />
            <ReadField label="Party Name" value={eventInfo.partyName} />
            <ReadField label="Venue" value={eventInfo.venue} />
            <ReadField label="Event Date (From - To)" value={eventInfo.eventDate} />
          </div>

          <div className="my-6 border-t border-gray-200" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <FieldLabel>Reference</FieldLabel>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter reference"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
              />
            </div>
            <div>
              <FieldLabel>Production Incharge</FieldLabel>
              <SearchableSelect
                options={INCHARGE_OPTIONS}
                value={incharge}
                onChange={setIncharge}
                placeholder="Select Incharge"
              />
            </div>
            <div>
              <FieldLabel>Note</FieldLabel>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any special remarks…"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FieldLabel>Setup</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={setupDate}
                  onChange={(e) => setSetupDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                />
                <input
                  type="time"
                  value={setupTime}
                  onChange={(e) => setSetupTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Dismantling</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={dismantleDate}
                  onChange={(e) => setDismantleDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                />
                <input
                  type="time"
                  value={dismantleTime}
                  onChange={(e) => setDismantleTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Function card ---------------- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Function Name</h2>
            <SearchableSelect
              fetcher={fetchFunctionOptions}
              value={selectedFunction}
              onChange={setSelectedFunction}
              placeholder="Select function"
              className="w-48"
            />
          </div>

          {/* Search / add row */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <SearchableSelect
              options={CATALOG_OPTIONS}
              value={catalogPick}
              onChange={setCatalogPick}
              placeholder="Search decor, lighting, catering…"
              leadingIcon={<Search size={16} />}
              className="flex-1"
            />
            <button
              type="button"
              onClick={addItem}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
            >
              <Plus size={16} />
              Add
            </button>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors shrink-0"
              style={{ backgroundColor: MAROON }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MAROON_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = MAROON)}
            >
              <Sparkles size={16} />
              Add Item
            </button>
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
              const allocatedTotal = item.placements.reduce(
                (sum, p) => sum + Number(p.qty || 0),
                0
              );
              return (
                <div
                  key={item.id}
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: TINT_BORDER }}
                >
                  {/* collapsed row */}
                  <div
                    className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1fr_auto] sm:items-center"
                    style={{ backgroundColor: TINT_BG }}
                  >
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="text-gray-600">{item.vendor?.label || '—'}</span>
                    <span className="text-gray-600 sm:text-center">{item.qty}</span>
                    <span className="text-gray-600 sm:text-center">{currency(item.rate)}</span>
                    <span
                      className="font-bold sm:text-right"
                      style={{ color: MAROON }}
                    >
                      {currency(total)}
                    </span>
                    <div className="flex items-center gap-3 justify-end col-span-2 sm:col-span-1">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleExpand(item.id)}
                        aria-label="Edit item"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteItem(item.id)}
                        aria-label="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => toggleExpand(item.id)}
                        aria-label="Toggle details"
                      >
                        {item.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* expanded panel */}
                  {item.expanded && (
                    <div className="grid grid-cols-1 gap-6 border-t bg-white p-5 lg:grid-cols-2" style={{ borderColor: TINT_BORDER }}>
                      {/* Item details */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: MAROON }}>
                          Item Details
                        </h3>
                        <div>
                          <FieldLabel>Item Name</FieldLabel>
                          <input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                          />
                        </div>
                        <div>
                          <FieldLabel>Description</FieldLabel>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Add a short description…"
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249] resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>Vendor</FieldLabel>
                            <SearchableSelect
                              fetcher={fetchVendorOptions}
                              value={item.vendor}
                              onChange={(v) => updateItem(item.id, 'vendor', v)}
                              placeholder="Select vendor"
                            />
                          </div>
                          <div>
                            <FieldLabel>Unit</FieldLabel>
                            <input
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>Date</FieldLabel>
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) => updateItem(item.id, 'date', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                            />
                          </div>
                          <div>
                            <FieldLabel>Time</FieldLabel>
                            <input
                              type="time"
                              value={item.time}
                              onChange={(e) => updateItem(item.id, 'time', e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel>Base Price (₹)</FieldLabel>
                            <input
                              type="number"
                              min={0}
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                            />
                          </div>
                          <div>
                            <FieldLabel>Total Qty</FieldLabel>
                            <input
                              type="number"
                              min={0}
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                            />
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Note</FieldLabel>
                          <textarea
                            rows={2}
                            value={item.note}
                            onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                            placeholder="Add any special instructions…"
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249] resize-none"
                          />
                        </div>
                      </div>

                      {/* Allocation & media */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: MAROON }}>
                          Allocation &amp; Media
                        </h3>

                        <div className="rounded-xl border p-4" style={{ backgroundColor: TINT_BG, borderColor: TINT_BORDER }}>
                          <div className="flex items-center justify-between pb-2">
                            <span className="font-bold text-gray-900">Placements</span>
                            <span className="text-xs font-semibold uppercase text-gray-500">Qty</span>
                          </div>
                          <div className="space-y-2.5">
                            {item.placements.map((p, i) => (
                              <div key={p.label} className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                  {p.label}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActivePlacement({
                                        ...(PLACEMENT_DETAILS[p.label] || {}),
                                        label: p.label,
                                        qty: p.qty,
                                      })
                                    }
                                    className="text-gray-400 hover:text-[#9C2249] transition-colors"
                                    aria-label={`${p.label} placement instructions`}
                                  >
                                    <Info size={13} />
                                  </button>
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  value={p.qty}
                                  onChange={(e) => updatePlacement(item.id, i, Number(e.target.value))}
                                  className="w-20 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 text-right focus:outline-none focus:ring-2 focus:ring-[#9C2249]/20 focus:border-[#9C2249]"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: TINT_BORDER }}>
                            <span className="text-sm font-bold text-gray-900">
                              Allocated Total: <span className="font-bold">{allocatedTotal} {item.unit}</span>
                            </span>
                            <span className="text-sm font-bold" style={{ color: MAROON }}>
                              Total: {currency(total)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <FieldLabel>Reference Image</FieldLabel>
                          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                              <ImageIcon size={20} />
                            </div>
                            <span className="flex-1 text-sm text-gray-500">No image uploaded</span>
                            <button
                              type="button"
                              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
                              style={{ color: MAROON, backgroundColor: TINT_BG }}
                            >
                              Change Image
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <MessageSquare size={16} />
                          SMS
                        </button>
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

export default EventFlower;