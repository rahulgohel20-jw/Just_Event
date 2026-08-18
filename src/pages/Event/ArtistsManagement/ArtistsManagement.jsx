import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  MessageOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Save, Sparkles } from 'lucide-react';
import { AddUpdateIventory, getbyeventid, getalllistfuntionmaster, getAllClientMaster, getAllRawItemMaster, GetInventoryByFunction } from '@/services/apiServices';
import Swal from 'sweetalert2';
import EventHeaderCard from '../../../components/eventheader/EventHeaderCard';
import DateField from '../../../components/form-inputs/DatePicker/Datefield';
import TimeInput12h from '../../../components/form-inputs/Time/Timeinput12h';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import AddRowItem from '../../../partials/modals/add-row-item/AddRowItem';

const { Text, Title } = Typography;

const currency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// This page only ever shows the artists & entertainment inventory category.
const INVENTORY_ITEMS_FILTER = 'ARTIST_ENTERTAINMENT';
// TODO: confirm the real rawCategoryId for Artists & Entertainment against
// RawItemMaster — this is a placeholder until confirmed (mirrors the
// Lighting/Furniture pages' approach).
const ARTIST_RAW_CATEGORY_ID = 22;

const showToast = (icon, text) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: text,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

const AsyncSearchSelect = ({ fetcher, value, onChange, placeholder, className, debounceMs = 300 }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const cacheRef = useRef(new Map());
  const inFlightQueryRef = useRef(null);

  const runSearch = useCallback(
    async (query) => {
      if (cacheRef.current.has(query)) {
        setOptions(cacheRef.current.get(query));
        return;
      }
      inFlightQueryRef.current = query;
      setLoading(true);
      const results = (await fetcher(query)) || [];
      const mapped = results
        .map((o) => ({ ...o, value: o.id, label: o.label }))
        .filter((o) => o.value != null);
      if (inFlightQueryRef.current === query) {
        cacheRef.current.set(query, mapped);
        setOptions(mapped);
        setLoading(false);
      }
    },
    [fetcher]
  );

  const handleSearch = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (cacheRef.current.has(query)) {
      setOptions(cacheRef.current.get(query));
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => runSearch(query), debounceMs);
  };

  const handleFocus = () => {
    if (cacheRef.current.has('')) {
      setOptions(cacheRef.current.get(''));
      return;
    }
    runSearch('');
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleSelectChange = (opt) => {
    if (!opt) {
      onChange({ id: null, label: '' });
      return;
    }
    const full = options.find((o) => o.value === opt.value) || {};
    onChange({ ...full, id: opt.value, label: opt.label });
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
      onFocus={handleFocus}
      onChange={handleSelectChange}
      notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No matches" />}
      options={options}
    />
  );
};

const EVENTS_LIST = [
  { id: 1, code: 'B260001', name: 'Bina Ketan Shah', date: '19/02/2026', time: '08:00 AM', type: 'Wedding', partyName: 'Bina Ketan Shah', venue: 'Sunset Banquet Hall' },
  { id: 2, code: 'C260001', name: 'Just Catering', date: '24/03/2026', time: '08:00 AM', type: 'Wedding', partyName: 'Just Catering', venue: 'Grand Horizon Center' },
  { id: 3, code: 'D260001', name: 'Just Catering', date: '04/03/2026', time: '', type: 'Reception', partyName: 'Just Catering', venue: 'Grand Horizon Center' },
];

const EventSearchModal = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = EVENTS_LIST.filter(
    (ev) => !q || ev.name.toLowerCase().includes(q) || ev.code.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q) || ev.date.includes(q)
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
              avatar={<Avatar className={i % 2 === 0 ? 'bg-primary-lighest text-primary' : 'bg-violet-100 text-violet-600'}>{ev.name.charAt(0)}</Avatar>}
              title={ev.name}
              description={`${ev.code} · ${ev.date}${ev.time ? ` ${ev.time}` : ''} · ${ev.type}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
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
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-primary-lighest p-4">
          <div>
            <Text type="secondary" className="!text-[11px] font-semibold uppercase tracking-wide">Placement</Text>
            <div className="mt-1 text-sm font-bold text-gray-900">{placement.label}</div>
          </div>
          <div>
            <Text type="secondary" className="!text-[11px] font-semibold uppercase tracking-wide">Quantity</Text>
            <div className="mt-1 text-sm font-bold text-gray-900">{placement.qty}</div>
          </div>
        </div>
        {(placement.notes || placement.elements) ? (
          <>
            {placement.notes && (
              <div className="mt-5">
                <Text strong className="text-primary !text-xs uppercase tracking-wide">Notes</Text>
                <p className="mt-2 rounded-xl bg-primary-lighest p-3 text-sm leading-relaxed text-gray-700">{placement.notes}</p>
              </div>
            )}
            {placement.elements && (
              <div className="mt-5">
                <Text strong className="text-primary !text-xs uppercase tracking-wide">Elements &amp; Material</Text>
                <p className="mt-2 rounded-xl bg-primary-lighest p-3 text-sm leading-relaxed text-gray-700">{placement.elements}</p>
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No placement instructions on file for this item yet.</p>
        )}
      </>
    )}
  </Modal>
);

const buildItemPlacements = (itemPlacements, master) => {
  const qtyByExecId = new Map(
    (Array.isArray(itemPlacements) ? itemPlacements : [])
      .filter((p) => p.executionItemId != null)
      .map((p) => [p.executionItemId, p])
  );

  if (master.length > 0) {
    return master.map((m) => {
      const own = qtyByExecId.get(m.executionItemId);
      return {
        id: own?.id ?? null,
        executionItemId: m.executionItemId,
        label: m.label,
        qty: own?.qty ?? 0,
      };
    });
  }

  return (Array.isArray(itemPlacements) ? itemPlacements : []).map((p) => ({
    id: p.id ?? null,
    executionItemId: p.executionItemId,
    label: p.executionItemNameEnglish ?? '',
    qty: p.qty ?? 0,
  }));
};


const extractImageUrls = (images) =>
  (Array.isArray(images) ? images : [])
    .map((img) => (typeof img === 'string' ? img : img?.path))
    .filter(Boolean);

// Field names on the left of each `??` chain are guesses at the API's
// actual response — confirm against a real payload and adjust.
const mapInventoryItem = (item, master) => ({
  id: item.id ?? Date.now() + Math.random(),
  serverId: item.id ?? null,
  rawItemId: item.rawItemId ?? null,
  unitId: item.unitId ?? null,

  name:
    item.rawItemNameEnglish ??
    item.description ??
    'Untitled Item',

  vendor: {
    id: item.vendorId ?? null,
    label: item.vendorNameEnglish ?? '',
  },

  qty: item.qty ?? 0,
  rate: item.price ?? 0,
  description: item.description ?? '',
  unit: item.unitNameEnglish ?? '',
  date: item.itemDate ?? '',
  time: item.itemTime ?? '',
  note: item.note ?? '',

  // CHANGE THIS
  images: extractImageUrls(item.images),

  newFiles: [],

  placements: buildItemPlacements(item.placements, master),

  expanded: false,
});

const ArtistsManagement = () => {
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
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [activePlacement, setActivePlacement] = useState(null);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [reference, setReference] = useState('');
  const [incharge, setIncharge] = useState(null);
  const [note, setNote] = useState('');
  const [setUpDateTime, setSetUpDateTime] = useState('');
  const [dismantlingDateTime, setDismantlingDateTime] = useState('');

  const [selectedFunction, setSelectedFunction] = useState({ id: null, label: '' });
  const [functionOptions, setFunctionOptions] = useState([]);

  const [catalogPick, setCatalogPick] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [placementMaster, setPlacementMaster] = useState([]);
  const [inventoryId, setInventoryId] = useState(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [imageUploadItemId, setImageUploadItemId] = useState(null);
const imageFileInputRef = useRef(null);

const [isAddRowItemModalOpen, setIsAddRowItemModalOpen] = useState(false);
const [catalogRefreshKey, setCatalogRefreshKey] = useState(0);




const openImagePicker = (itemId) => {
  if (isLocked) return;

  setImageUploadItemId(itemId);
  imageFileInputRef.current?.click();
};

const handleImageFileSelected = (e) => {
  const file = e.target.files?.[0];

  // Allow selecting the same file again
  e.target.value = '';

  if (!file || imageUploadItemId == null) return;

  const previewUrl = URL.createObjectURL(file);

  setItems((prev) =>
    prev.map((it) => {
      if (it.id !== imageUploadItemId) return it;

      // Remove old temporary preview
      if (it.images?.[0]?.startsWith?.('blob:')) {
        URL.revokeObjectURL(it.images[0]);
      }

      return {
        ...it,
        images: [previewUrl],
        newFiles: [file],
      };
    })
  );

  setImageUploadItemId(null);
};

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

  const fetchInventoryForFunction = useCallback(async (eventFunctionId) => {
    if (!eventFunctionId) {
      setItems([]);
      return;
    }
    setItemsLoading(true);
    try {
      const res = await GetInventoryByFunction(eventFunctionId, INVENTORY_ITEMS_FILTER);
      const body = res?.data ?? res;
      const data = body?.data ?? {};

      setInventoryId(data?.id ?? null);
      setReference(data?.reference ?? '');
      setIncharge(data?.productionInchargeId ?? null);
      setNote(data?.note ?? '');
      setSetUpDateTime(data?.setupDateTime ?? '');
      setDismantlingDateTime(data?.dismantleDateTime ?? '');
      setInventoryStatus(data?.status ?? null);
      setIsLocked(!!data?.isLocked);

      const master = (Array.isArray(data?.placements) ? data.placements : [])
        .filter((p) => p.executionItemId != null)
        .map((p) => ({
          executionItemId: p.executionItemId,
          label: p.executionItemNameEnglish ?? '',
        }));
      setPlacementMaster(master);

      const rawItems = Array.isArray(data?.items) ? data.items : [];
      setItems(rawItems.map((item) => mapInventoryItem(item, master)));
    } catch (err) {
      console.error('Failed to fetch inventory for function:', err);
      setItems([]);
      setPlacementMaster([]);
    } finally {
      setItemsLoading(false);
    }
  }, []);

  const fetchArtistCatalogItems = useCallback(
    async (query) => {
      try {
        const res = await getAllRawItemMaster({
          isActive: true,
          nameEnglish: query || '',
          page: 0,
          rawCategoryId: ARTIST_RAW_CATEGORY_ID,
          rawSubCategoryId: null,
          size: 1000,
          sortBy: 'id',
          sortDirection: 'DESC',
          supplierId: null,
          unitId: null,
          userId,
        });
        const body = res?.data ?? res;
        const list = body?.data?.content ?? body?.data ?? [];
       return (Array.isArray(list) ? list : []).map((item) => ({
  id:
    item.id ??
    item.rawItemId ??
    item.rawItemMasterId ??
    item.itemId ??
    null,

  label:
    item.nameEnglish ??
    item.itemNameEnglish ??
    item.name ??
    '',

  unitId: item.unitId ?? null,

  unit: item.unitNameEnglish ?? '',

  availableQty: item.closingQuantity ?? null,

  images: extractImageUrls(item.images),
}));
      } catch (err) {
        console.error('Failed to fetch artist catalog items:', err);
        return [];
      }
    },
    [userId]
  );

  useEffect(() => {
    if (selectedFunction?.id) {
      fetchInventoryForFunction(selectedFunction.id);
    }
  }, [selectedFunction?.id, fetchInventoryForFunction]);

  const fetchVendorOptions = useCallback(
    async (query) => {
      try {
        const res = await getAllClientMaster({
          categoryType: -1,
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

  const buildInventoryFormData = () => {
    const formData = new FormData();

    if (inventoryId != null) {
      formData.append('id', inventoryId);
    }
    formData.append('eventFunctionId', selectedFunction?.id ?? '');
    formData.append('inventoryItem', INVENTORY_ITEMS_FILTER);
    formData.append('reference', reference ?? '');
    formData.append('productionInchargeId', incharge ?? '');
    formData.append('note', note ?? '');
    formData.append('setupDateTime', setUpDateTime ?? '');
    formData.append('dismantleDateTime', dismantlingDateTime ?? '');
    formData.append('status', inventoryStatus ?? '');
    formData.append('userId', userId);

    items.forEach((item, i) => {
      if (item.serverId != null) {
        formData.append(`items[${i}].id`, item.serverId);
      }
      formData.append(`items[${i}].rawItemId`, item.rawItemId ?? '');
      formData.append(`items[${i}].unitId`, item.unitId ?? '');
      formData.append(`items[${i}].vendorId`, item.vendor?.id ?? '');
      formData.append(`items[${i}].description`, item.description ?? '');
      formData.append(`items[${i}].itemDate`, item.date ?? '');
      formData.append(`items[${i}].itemTime`, item.time ?? '');
      formData.append(`items[${i}].length`, item.length ?? '');
      formData.append(`items[${i}].breadth`, item.breadth ?? '');
      formData.append(`items[${i}].height`, item.height ?? '');
      formData.append(`items[${i}].price`, item.rate ?? 0);
      formData.append(`items[${i}].qty`, item.qty ?? 0);
      formData.append(`items[${i}].note`, item.note ?? '');

      (item.newFiles || []).forEach((file) => {
        formData.append(`items[${i}].files`, file);
      });

      item.placements.forEach((p, j) => {
        if (p.id != null) {
          formData.append(`items[${i}].placements[${j}].id`, p.id);
        }
        formData.append(`items[${i}].placements[${j}].executionItemId`, p.executionItemId ?? '');
        formData.append(`items[${i}].placements[${j}].qty`, p.qty ?? 0);
      });
    });

    return formData;
  };

  const handleSave = async () => {
    if (!selectedFunction?.id) {
      showToast('warning', 'Please select a function first.');
      return;
    }
    setSaveLoading(true);
    try {
      const formData = buildInventoryFormData();
      const res = await AddUpdateIventory(formData);
      const body = res?.data ?? res;
      if (body?.success === false) {
        throw new Error(body?.msg || 'Save failed');
      }
      showToast('success', body?.msg || 'Inventory saved successfully.');
      fetchInventoryForFunction(selectedFunction.id);
    } catch (err) {
      console.error('Failed to save inventory:', err);
      Swal.fire({
        title: 'Error',
        text: err?.message || 'Failed to save inventory. Please try again.',
        icon: 'error',
        confirmButtonColor: '#005BA8',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const toggleExpand = (id) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, expanded: !it.expanded } : it)));

  const updateItem = (id, field, value) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const updatePlacement = (id, index, value) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, placements: it.placements.map((p, i) => (i === index ? { ...p, qty: value } : p)) } : it
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
    if (placementMaster.length === 0) {
      showToast('warning', 'Placements are still loading — please wait a moment and try again.');
      return;
    }
    const newItem = {
      id: Date.now(),
      serverId: null,
      rawItemId: catalogPick?.id ?? null,
      unitId: catalogPick?.unitId ?? null,
      name: catalogPick?.label || 'New Item',
      vendor: { id: null, label: '' },
      qty: 0,
      rate: 0,
      description: '',
      unit: catalogPick?.unit ?? '',
      availableQty: catalogPick?.availableQty ?? null,
      date: '',
      time: '',
      length: '',
      breadth: '',
      height: '',
      note: '',
      images: [],
      newFiles: [],
      placements: placementMaster.map((m) => ({
        id: null,
        executionItemId: m.executionItemId,
        label: m.label,
        qty: 0,
      })),
      expanded: true,
    };
    setItems((prev) => [...prev, newItem]);
    setCatalogPick(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <EventHeaderCard
          title="Event Artists & Entertainment"
          eventInfo={eventInfo}
          onEventNoClick={() => setIsEventModalOpen(true)}
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
              options={functionOptions}
              optionFilterProp="label"
              loading={eventLoading}
              placeholder="Select function"
              popupMatchSelectWidth={false}
              suffixIcon={<DownOutlined className="text-gray-400" />}
              className="min-w-[160px] [&_.ant-select-selector]:!rounded-full [&_.ant-select-selector]:!border-primary-clarity"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-primary-lighest p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchOutlined className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
              <AsyncSearchSelect
  key={`catalog-picker-${catalogRefreshKey}`}
  fetcher={fetchArtistCatalogItems}
  value={catalogPick}
  onChange={setCatalogPick}
  placeholder="Pick a catalog item to add…"
  className="w-full [&_.ant-select-selector]:!bg-white [&_.ant-select-selector]:!border-dashed [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!pl-9"
/>
            </div>
           <Button
  icon={<PlusOutlined />}
  onClick={addItem}
  disabled={
    itemsLoading ||
    placementMaster.length === 0 ||
    !catalogPick?.id
  }
  className="shrink-0 !bg-white rounded-lg"
>
  Add
</Button>
           <Button
  type="primary"
  icon={<Sparkles size={16} />}
  onClick={() => setIsAddRowItemModalOpen(true)}
  className="shrink-0 rounded-lg"
>
  Add Item
</Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={saveLoading}
              disabled={isLocked}
              className="shrink-0 rounded-lg"
            >
              <Save size={16} /> Save
            </Button>
          </div>

          <div className="mt-6 hidden grid-cols-[2fr_1.4fr_0.8fr_0.8fr_1fr_auto] gap-3 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
            <span>Item Name</span>
            <span>Vendor</span>
            <span className="text-center">Qty</span>
            <span className="text-center">Rate</span>
            <span className="text-right">Total Amount</span>
            <span />
          </div>

          {itemsLoading ? (
            <div className="flex justify-center py-10">
              <Spin />
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {items.map((item) => {
                      const allocatedTotal = item.placements.reduce((sum, p) => sum + Number(p.qty || 0), 0);
                const combinedQty = Number(item.qty || 0) + allocatedTotal;
                const total = combinedQty * Number(item.rate || 0); 
                return (
                  <div key={item.id} className="rounded-xl border border-primary-clarity overflow-hidden">
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
                          disabled={isLocked}
                          aria-label="Edit item"
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => deleteItem(item.id)}
                          disabled={isLocked}
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

                    {item.expanded && (
                      <div className="grid grid-cols-1 gap-6 border-t border-primary-clarity bg-white p-5 lg:grid-cols-2">
                        <div className="space-y-4">
                          <Text strong className="text-primary !text-xs uppercase tracking-wide">Item Details</Text>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Item Name</Text>
                            <Input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                          </div>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Description</Text>
                            <Input.TextArea rows={2} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Add a short description…" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Vendor</Text>
                              <AsyncSearchSelect fetcher={fetchVendorOptions} value={item.vendor} onChange={(v) => updateItem(item.id, 'vendor', v)} placeholder="Select vendor" />
                            </div>
                            <div>
                              <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Unit</Text>
                              <Input value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Date</Text>
                              <DateField value={item.date} onChange={(val) => updateItem(item.id, 'date', val)} />
                            </div>
                            <div>
                              <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Time</Text>
                              <TimeInput12h value={item.time} onChange={(val) => updateItem(item.id, 'time', val)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Base Price (₹)</Text>
                              <InputNumber style={{ width: '100%' }} min={0} value={item.rate} onChange={(v) => updateItem(item.id, 'rate', v ?? 0)} />
                            </div>
                          </div>
                          <div>
                            <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Note</Text>
                            <Input.TextArea rows={2} value={item.note} onChange={(e) => updateItem(item.id, 'note', e.target.value)} placeholder="Add any special instructions…" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Text strong className="text-primary !text-xs uppercase tracking-wide">Allocation &amp; Media</Text>

                          <div className="rounded-xl border border-primary-clarity bg-primary-lighest p-4">
                            <div className="flex items-center justify-between pb-2">
                              <span className="font-bold text-gray-900">Placements</span>
                              <span className="text-xs font-semibold uppercase text-gray-500">Qty</span>
                            </div>
                            <div className="space-y-2.5">
                              {item.placements.map((p, i) => (
                                <div key={p.executionItemId ?? i} className="flex items-center justify-between gap-3">
                                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                    {p.label}
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<InfoCircleOutlined className="text-gray-400 hover:text-primary" />}
                                      onClick={() => setActivePlacement({ label: p.label, qty: p.qty })}
                                      aria-label={`${p.label} placement instructions`}
                                    />
                                  </span>
                                  <InputNumber min={0} value={p.qty} onChange={(v) => updatePlacement(item.id, i, v ?? 0)} className="w-20" />
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-primary-clarity pt-3">
                              <span className="text-sm font-bold text-gray-900">
                                Allocated Total: <span className="font-bold">{allocatedTotal} {item.unit}</span>
                              </span>
                              <span className="text-sm font-bold text-primary">Total: {currency(total)}</span>
                            </div>
                          </div>

                          <Text type="secondary" className="block !text-xs font-semibold uppercase mb-2">Reference Image</Text>
                          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 p-4">
                           {item.images?.length > 0 ? (
  <img
    src={item.images[0]}
    alt={item.name}
    className="h-12 w-12 shrink-0 rounded-lg object-cover"
  />
) : (
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
    <PictureOutlined style={{ fontSize: 20 }} />
  </div>
)}

<span className="flex-1 text-sm text-gray-500">
  {item.images?.length > 0
    ? `${item.images.length} image(s) attached`
    : 'No image uploaded'}
</span>
                            <Button
  type="text"
  className="text-primary bg-primary-lighest rounded-full"
  disabled={isLocked}
  onClick={() => openImagePicker(item.id)}
>
  Change Image
</Button>
                          </div>

                          <Button icon={<MessageOutlined />}>SMS</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {items.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No inventory items for this function yet — use Add or Add Item above."
                  className="py-10"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <EventSearchModal open={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSelect={handleSelectEvent} />

      <PlacementInstructionsModal open={!!activePlacement} onClose={() => setActivePlacement(null)} placement={activePlacement} />

        <AddRowItem
  open={isAddRowItemModalOpen}
  onClose={() => setIsAddRowItemModalOpen(false)}
  onSave={async () => {
    setCatalogRefreshKey((k) => k + 1);
    setIsAddRowItemModalOpen(false);
  }}
  initialData={null}
/>

<input
  type="file"
  accept="image/*"
  ref={imageFileInputRef}
  onChange={handleImageFileSelected}
  className="hidden"
/>
    </div>
  );
};

export default ArtistsManagement;