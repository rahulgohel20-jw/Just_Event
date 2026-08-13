import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Select } from "antd";
import {
  Info,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import LocationPicker from "@/components/LocationPicker/LocationPicker";
import {
  Translateapi,
  addupadtevenuemaster,
  getstatebycountry,
  getbycitiesbystate,
  getbyvenuid,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { ProgressBarLoader } from "../../../components/loaders/ProgressBarLoader";
// Matches schema enum: venueType [ RESORT, HALL ]
const venueTypeOptions = [
  { value: "RESORT", label: "Resort" },
  { value: "HALL", label: "Hall" },
];

// TODO: schema says subVenueType is an Enum with 6 values — replace with the real list
const subVenueTypeOptions = [
  { value: "RESORT_LAWN", label: "Resort Lawn" },
  { value: "RESORT_BANQUET_HALL", label: "Resort Banquet Hall" },
  { value: "RESORT_POOL_SIDE", label: "Resort Pool Side" },
  { value: "CONFERENCE_HALL", label: "Conference Hall" },
  { value: "BANQUET_HALL", label: "Banquet Hall" },
  { value: "PARTY_HALL", label: "Party Hall" },
];

// TODO: replace with real country master API (e.g. getalllistcountry)
const countryOptions = [{ value: 1, label: "India" }];

const createEmptySubVenue = () => ({
  id: null,
  name: { english: "", hindi: "", gujarati: "" },
  shortName: "",
  capacity: "",
  subVenueType: "",
  parking: "",
  isActive: true,
});

const initialFormState = {
  id: null,
  venueName: { english: "", hindi: "", gujarati: "" },
  venueType: null,
  capacity: "",
  subVenues: [createEmptySubVenue()],
  contactNo: "",
  mobileNo: "",
  email: "",
  website: "",
  instagram: "",
  address: { english: "", hindi: "", gujarati: "" },
  countryId: null,
  stateId: null,
  cityId: null,
  pincode: "",
  latitude: "",
  longitude: "",
  remarks: "",
  isActive: true,
  galleryFiles: [], // newly added File objects: [{ file, preview }]
  existingImages: [], // images already on server: [{ id, path }]
};

const MAX_REMARKS_LENGTH = 500;

const AddVenuePage = ({ onSaveDraft, onClose, onSave, initialData: initialDataProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const venueId = location.state?.venueId;

  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [fetchingVenue, setFetchingVenue] = useState(false);
  const [initialData, setInitialData] = useState(initialDataProp || null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const isEditMode = Boolean(venueId || initialData);
  const userId = Number(localStorage.getItem("userId"));

  // Fetch venue detail when arriving via navigate state { venueId }
  useEffect(() => {
    if (!venueId) return;
    const fetchVenue = async () => {
      setFetchingVenue(true);
      try {
        const res = await getbyvenuid(venueId);
        const body = res?.data ?? res;
        const venue = body?.data ?? body;
        setInitialData(venue);
      } catch (err) {
        console.error("Failed to fetch venue for edit:", err);
        showApiError(err, { title: "Failed to load venue" });
      } finally {
        setFetchingVenue(false);
      }
    };
    fetchVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  // Fetch states whenever country changes
  useEffect(() => {
    if (!form.countryId) {
      setStateOptions([]);
      return;
    }
    const fetchStates = async () => {
      setStatesLoading(true);
      try {
        const res = await getstatebycountry({ countryId: form.countryId });
        const body = res?.data ?? res;
        const records = body?.data?.content ?? body?.data ?? [];
        setStateOptions(
          records.map((s) => ({ value: s.id, label: s.nameEnglish ?? s.name }))
        );
      } catch (err) {
        console.error("Failed to fetch states:", err);
        setStateOptions([]);
      } finally {
        setStatesLoading(false);
      }
    };
    fetchStates();
  }, [form.countryId]);

  // Fetch cities whenever state changes
  useEffect(() => {
    if (!form.stateId) {
      setCityOptions([]);
      return;
    }
    const fetchCities = async () => {
      setCitiesLoading(true);
      try {
        const res = await getbycitiesbystate({ stateId: form.stateId });
        const body = res?.data ?? res;
        const records = body?.data?.content ?? body?.data ?? [];
        setCityOptions(
          records.map((c) => ({ value: c.id, label: c.nameEnglish ?? c.name }))
        );
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setCityOptions([]);
      } finally {
        setCitiesLoading(false);
      }
    };
    fetchCities();
  }, [form.stateId]);



  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id ?? null,
        venueName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        venueType: initialData.venueType || null,
        capacity: String(initialData.capacity ?? ""),
        subVenues:
          initialData.subVenues?.length
            ? initialData.subVenues.map((sv) => ({
                id: sv.id ?? null,
                name: {
                  english: sv.nameEnglish || "",
                  hindi: sv.nameHindi || "",
                  gujarati: sv.nameGujarati || "",
                },
                shortName: sv.shortName || "",
                capacity: String(sv.capacity ?? ""),
                subVenueType: sv.subVenueType || "INTERNAL",
                parking: String(sv.parking ?? ""),
                isActive: sv.isActive ?? true,
              }))
            : [createEmptySubVenue()],
        contactNo: initialData.contactNo || "",
        mobileNo: initialData.mobileNo || "",
        email: initialData.email || "",
        website: initialData.website || "",
        instagram: initialData.instagram || "",
        address: {
          english: initialData.addressEnglish || "",
          hindi: initialData.addressHindi || "",
          gujarati: initialData.addressGujarati || "",
        },
        countryId: initialData.countryId ?? null,
        stateId: initialData.stateId ?? null,
        cityId: initialData.cityId ?? null,
        pincode: initialData.pincode || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        remarks: initialData.remarks || "",
        isActive: initialData.isActive ?? true,
        galleryFiles: [],
        existingImages: initialData.images || [],
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCountryChange = (val) =>
    setForm((prev) => ({ ...prev, countryId: val, stateId: null, cityId: null }));

  const handleStateChange = (val) =>
    setForm((prev) => ({ ...prev, stateId: val, cityId: null }));

  const handleVenueNameChange = (_name, updatedValue) =>
    setForm((prev) => ({ ...prev, venueName: updatedValue }));

  const handleAddressChange = (_name, updatedValue) =>
    setForm((prev) => ({ ...prev, address: updatedValue }));

  const handleLocationChange = (lat, lng) =>
    setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lng) }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setForm((prev) => ({ ...prev, galleryFiles: [...prev.galleryFiles, ...newImages] }));
    e.target.value = "";
  };

  const removeGalleryImage = (index) =>
    setForm((prev) => ({
      ...prev,
      galleryFiles: prev.galleryFiles.filter((_, i) => i !== index),
    }));

  const removeExistingImage = (id) =>
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.id !== id),
    }));

  const handleTranslate = async (englishText) => {
    try {
      const res = await Translateapi(englishText);
      const data = res?.data ?? res;
      return { hindi: data?.hindi, gujarati: data?.gujarati };
    } catch (err) {
      console.error("Translation failed:", err);
      return null;
    }
  };

  const handleCancel = () => {
    if (onClose) return onClose();
    navigate("/master/venuemaster");
  };

  // ---- Sub-venues ----
  const addSubVenue = () =>
    setForm((prev) => ({ ...prev, subVenues: [...prev.subVenues, createEmptySubVenue()] }));

  const removeSubVenue = (index) =>
    setForm((prev) => ({ ...prev, subVenues: prev.subVenues.filter((_, i) => i !== index) }));

  const updateSubVenue = (index, field, value) =>
    setForm((prev) => ({
      ...prev,
      subVenues: prev.subVenues.map((sv, i) => (i === index ? { ...sv, [field]: value } : sv)),
    }));

  const updateSubVenueName = (index, _name, updatedValue) =>
    setForm((prev) => ({
      ...prev,
      subVenues: prev.subVenues.map((sv, i) => (i === index ? { ...sv, name: updatedValue } : sv)),
    }));

  const handleSubVenueTranslate = () => async (englishText) => handleTranslate(englishText);

  // ---- Save ----
  const handleSaveDraft = () => onSaveDraft?.(form);

  const buildPayload = () => ({
    id: form.id,
    nameEnglish: form.venueName.english,
    nameHindi: form.venueName.hindi,
    nameGujarati: form.venueName.gujarati,
    venueType: form.venueType,
    capacity: form.capacity ? Number(form.capacity) : null,
      subVenues: form.subVenues
    .filter((sv) => sv.name.english?.trim()) // only keep sub-venues the user actually named
    .map((sv) => ({
      id: sv.id,
      nameEnglish: sv.name.english,
      nameHindi: sv.name.hindi,
      nameGujarati: sv.name.gujarati,
      shortName: sv.shortName,
      capacity: sv.capacity ? Number(sv.capacity) : null,
      subVenueType: sv.subVenueType,
      parking: sv.parking ? Number(sv.parking) : null,
      isActive: sv.isActive,
    })),
    contactNo: form.contactNo,
    mobileNo: form.mobileNo,
    email: form.email,
    website: form.website,
    instagram: form.instagram,
    addressEnglish: form.address.english,
    addressHindi: form.address.hindi,
    addressGujarati: form.address.gujarati,
    countryId: form.countryId,
    stateId: form.stateId,
    cityId: form.cityId,
    pincode: form.pincode,
    latitude: form.latitude,
    longitude: form.longitude,
    remarks: form.remarks,
// in buildPayload
isActive: Boolean(form.isActive),
    userId,
  });

  const handleSaveVenue = async () => {
    if (!form.venueName.english.trim()) return;

    const payload = buildPayload();

    const formData = new FormData();
    const dataBlob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    formData.append("data", dataBlob);

    form.galleryFiles.forEach((img) => {
      if (img.file instanceof File) {
        formData.append("images", img.file);
      }
    });

    setSaving(true);
    try {
      const res = await addupadtevenuemaster(formData);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Venue Updated" : "Venue Saved",
        fallbackSuccess: "Operation completed successfully.",
        errorTitle: "Failed",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          setForm(initialFormState);
          navigate("/master/venuemaster");
        },
      });

      if (!success) return;
    } catch (err) {
      console.error("Failed to save venue:", err);
      showApiError(err, { title: "Failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {fetchingVenue && <ProgressBarLoader />}
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rose-100 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-[#7A2E45]">
            {isEditMode ? "Edit Venue" : "Add New Venue"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure your premier location, sub-spaces, and logistical details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-60"
          >
            Cancel
          </button>
        
          <button
            onClick={handleSaveVenue}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7A2E45] text-sm font-medium text-white hover:bg-[#66253a] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Venue
          </button>
        </div>
      </div>

      <div className="max-w-1xl mx-auto px-6 py-6 space-y-6">
        {/* Venue Details */}
        <Section icon={<Info size={13} />} title="Venue Details">
          <div className="space-y-4">
            <MultiLangInputBox
              label="Venue Name"
              name="venueName"
              value={form.venueName}
              onChange={handleVenueNameChange}
              onTranslate={handleTranslate}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Venue Type
  </label>

  <Select
    value={form.venueType}
    onChange={(val) => updateField("venueType", val)}
    placeholder="Venue Type"
    className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
    options={venueTypeOptions}
  />
</div>

<div>
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Overall Capacity
  </label>

  <input
    type="number"
    value={form.capacity}
    onChange={(e) => updateField("capacity", e.target.value)}
    placeholder="Overall Capacity"
    className={inputClass}
  />
</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
                <ToggleSwitch
                  checked={form.isActive}
                  onChange={() => updateField("isActive", !form.isActive)}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Sub-Venues */}
        <Section
          icon={<MapPin size={13} />}
          title="Sub-Venues"
          action={
            <button
              onClick={addSubVenue}
              className="flex items-center gap-1 text-xs font-medium text-[#7A2E45] hover:underline"
            >
              <Plus size={13} />
              Add Another Sub Venue
            </button>
          }
        >
          <div className="space-y-4">
            {form.subVenues.map((sv, index) => (
              <div
                key={index}
                className="rounded-lg border border-rose-100 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <MultiLangInputBox
                      label="Sub-Venue Name"
                      name={`subVenueName-${index}`}
                      value={sv.name}
                      onChange={(name, val) => updateSubVenueName(index, name, val)}
                      onTranslate={handleSubVenueTranslate(index)}
                    />
                  </div>
                  {form.subVenues.length > 1 && (
                    <button
                      onClick={() => removeSubVenue(index)}
                      className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center text-gray-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

             <div className="space-y-4">

  {/* Names */}
 

  {/* Details */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">

    {/* Short Name */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Short Name
      </label>

      <input
        type="text"
        value={sv.shortName}
        onChange={(e) =>
          updateSubVenue(index, "shortName", e.target.value)
        }
        placeholder="Short Name"
        className={inputClass}
      />
    </div>

    {/* Capacity */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Capacity
      </label>

      <input
        type="number"
        value={sv.capacity}
        onChange={(e) =>
          updateSubVenue(index, "capacity", e.target.value)
        }
        placeholder="Capacity"
        className={inputClass}
      />
    </div>

    {/* Sub Venue Type */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Sub Venue Type
      </label>

      <Select
        value={sv.subVenueType}
        onChange={(val) =>
          updateSubVenue(index, "subVenueType", val)
        }
        className="w-full [&_.ant-select-selector]:!h-[42px]
                   [&_.ant-select-selector]:!rounded-lg
                   [&_.ant-select-selector]:!items-center"
        options={subVenueTypeOptions}
      />
    </div>

    {/* Parking */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Parking
      </label>

      <input
        type="number"
        value={sv.parking}
        onChange={(e) =>
          updateSubVenue(index, "parking", e.target.value)
        }
        placeholder="Parking"
        className={inputClass}
      />
    </div>

    {/* Status */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Status
      </label>

      <div className="h-[42px] flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {sv.isActive ? "Active" : "Inactive"}
        </span>

        <ToggleSwitch
          checked={sv.isActive}
          onChange={() =>
            updateSubVenue(
              index,
              "isActive",
              !sv.isActive
            )
          }
        />
      </div>
    </div>

  </div>
</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact Details */}
      <Section icon={<Phone size={13} />} title="Contact Details">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Contact No */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Contact No
      </label>
      <IconInput
        icon={<Phone size={15} />}
        value={form.contactNo}
        onChange={(v) => updateField("contactNo", v)}
        placeholder="Contact No"
      />
    </div>

    {/* Mobile No */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Mobile No
      </label>
      <IconInput
        icon={<Phone size={15} />}
        value={form.mobileNo}
        onChange={(v) => updateField("mobileNo", v)}
        placeholder="Mobile No"
      />
    </div>

    {/* Email */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Email Address
      </label>
      <IconInput
        icon={<Mail size={15} />}
        value={form.email}
        onChange={(v) => updateField("email", v)}
        placeholder="Email Address"
        type="email"
      />
    </div>

    {/* Website */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Website
      </label>
      <IconInput
        icon={<Globe size={15} />}
        value={form.website}
        onChange={(v) => updateField("website", v)}
        placeholder="Website"
      />
    </div>

    {/* Instagram */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Instagram Handle
      </label>
      <IconInput
        icon={<Instagram size={15} />}
        value={form.instagram}
        onChange={(v) => updateField("instagram", v)}
        placeholder="Instagram Handle"
      />
    </div>

  </div>
</Section>

        {/* Location */}
        <Section icon={<MapPin size={13} />} title="Location">
          <div className="space-y-4">
            <MultiLangInputBox
              label="Address"
              name="address"
              value={form.address}
              onChange={handleAddressChange}
              onTranslate={handleTranslate}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select
                value={form.countryId}
                onChange={handleCountryChange}
                placeholder="Country"
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={countryOptions}
              />
              <Select
                value={form.stateId}
                onChange={handleStateChange}
                placeholder={statesLoading ? "Loading states..." : "State"}
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={stateOptions}
                loading={statesLoading}
                disabled={!form.countryId}
                showSearch
                optionFilterProp="label"
              />
              <Select
                value={form.cityId}
                onChange={(val) => updateField("cityId", val)}
                placeholder={citiesLoading ? "Loading cities..." : "City"}
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={cityOptions}
                loading={citiesLoading}
                disabled={!form.stateId}
                showSearch
                optionFilterProp="label"
              />
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
                placeholder="Pincode"
                className={inputClass}
              />
            </div>

            <LocationPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={handleLocationChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={form.latitude}
                onChange={(e) => updateField("latitude", e.target.value)}
                placeholder="Latitude"
                className={inputClass}
              />
              <input
                type="text"
                value={form.longitude}
                onChange={(e) => updateField("longitude", e.target.value)}
                placeholder="Longitude"
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        {/* Gallery */}
        <Section icon={<ImageIcon size={13} />} title="Gallery">
          <div className="flex gap-3 flex-wrap">
            <label className="w-24 h-24 border-2 border-dashed border-[#7A2E45] rounded-xl cursor-pointer flex flex-col justify-center items-center shrink-0">
              <Upload size={20} className="text-[#7A2E45]" />
              <span className="text-xs mt-1">Upload</span>
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            {form.existingImages.map((img) => (
              <div
                key={img.id}
                className="relative group w-24 h-24 rounded-xl overflow-hidden shrink-0"
              >
                <img src={img.path} alt="Venue" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {form.galleryFiles.map((img, index) => (
              <div
                key={`new-${index}`}
                className="relative group w-24 h-24 rounded-xl overflow-hidden shrink-0"
              >
                <img
                  src={img.preview}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Additional Remarks */}
        <Section title="Additional Remarks">
          <textarea
            value={form.remarks}
            onChange={(e) => {
              if (e.target.value.length <= MAX_REMARKS_LENGTH) {
                updateField("remarks", e.target.value);
              }
            }}
            placeholder="Internal Notes or Special Instructions"
            rows={4}
            className={`${inputClass} resize-none bg-[#FBF1F3]`}
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {form.remarks.length}/{MAX_REMARKS_LENGTH}
          </p>
        </Section>
      </div>

      {/* Sticky bottom confirm bar */}
      <div className="sticky bottom-0 border-t border-rose-100 bg-white px-6 py-4 flex justify-end">
        <button
          onClick={handleSaveVenue}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Confirm and Save Venue
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const inputClass =
  "w-full rounded-lg border border-gray-400 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]";

const Section = ({ icon, title, action, children }) => (
  <div className="rounded-xl bg-white border border-rose-100 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[#7A2E45]">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">
          {title}
        </h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const IconInput = ({ icon, value, onChange, placeholder, type = "text" }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} pl-9`}
    />
  </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-[#7A2E45]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default AddVenuePage;