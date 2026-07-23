import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import {
  Info,
  Plus,
  X,
  MapPin,
  Phone,
  User,
  Mail,
  Globe,
  Instagram,
  Image as ImageIcon,
  FileText,
  Save,
} from "lucide-react";

const venueTypeOptions = [
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "banquet", label: "Banquet" },
  { value: "farmhouse", label: "Farmhouse" },
];

const subVenueTypeOptions = [
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
];

const stateOptions = [
  { value: "gujarat", label: "Gujarat" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "maharashtra", label: "Maharashtra" },
];

const createEmptySubVenue = () => ({
  id: Date.now() + Math.random(),
  name: "",
  shortName: "",
  capacity: "",
  type: "internal",
  parking: "",
});

const initialFormState = {
  venueName: "",
  venueType: null,
  overallCapacity: "",
  subVenues: [createEmptySubVenue()],
  contactPerson: "",
  phoneNumber: "",
  emailAddress: "",
  website: "",
  instagramHandle: "",
  fullAddress: "",
  city: "",
  state: null,
  pincode: "",
  galleryFiles: [],
  additionalRemarks: "",
};

const MAX_REMARKS_LENGTH = 500;

const AddVenuePage = ({ onSaveDraft, onSaveVenue }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCancel = () => navigate("/venues");

  // ---- Sub-venues ----
  const addSubVenue = () =>
    setForm((prev) => ({
      ...prev,
      subVenues: [...prev.subVenues, createEmptySubVenue()],
    }));

  const removeSubVenue = (id) =>
    setForm((prev) => ({
      ...prev,
      subVenues: prev.subVenues.filter((sv) => sv.id !== id),
    }));

  const updateSubVenue = (id, field, value) =>
    setForm((prev) => ({
      ...prev,
      subVenues: prev.subVenues.map((sv) =>
        sv.id === id ? { ...sv, [field]: value } : sv
      ),
    }));

  // ---- Gallery ----
  const processFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const valid = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });
    const withPreviews = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({
      ...prev,
      galleryFiles: [...prev.galleryFiles, ...withPreviews],
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeGalleryImage = (index) =>
    setForm((prev) => ({
      ...prev,
      galleryFiles: prev.galleryFiles.filter((_, i) => i !== index),
    }));

  // ---- Save actions ----
  const handleSaveDraft = () => {
    onSaveDraft?.(form);
  };

  const handleSaveVenue = () => {
    if (!form.venueName.trim()) return;
    onSaveVenue?.({
      ...form,
      venueType: venueTypeOptions.find((o) => o.value === form.venueType) || null,
      state: stateOptions.find((o) => o.value === form.state) || null,
    });
    navigate("/venues");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rose-100 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-[#7A2E45]">Add New Venue</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure your premier location, sub-spaces, and logistical details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-lg bg-[#F7E5EA] text-sm font-medium text-[#7A2E45] hover:bg-[#f0d3dc] transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSaveVenue}
            className="px-4 py-2 rounded-lg bg-[#7A2E45] text-sm font-medium text-white hover:bg-[#66253a] transition-colors"
          >
            Save Venue
          </button>
        </div>
      </div>

      <div className="max-w-1xl mx-auto px-6 py-6 space-y-6">
        {/* Venue Details */}
        <Section icon={<Info size={13} />} title="Venue Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={form.venueName}
              onChange={(e) => updateField("venueName", e.target.value)}
              placeholder="Venue Name"
              className={inputClass}
            />
            <Select
              value={form.venueType}
              onChange={(val) => updateField("venueType", val)}
              placeholder="Venue Type"
              className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
              options={venueTypeOptions}
            />
            <input
              type="number"
              value={form.overallCapacity}
              onChange={(e) => updateField("overallCapacity", e.target.value)}
              placeholder="Overall Capacity"
              className={inputClass}
            />
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
          <div className="space-y-3">
            {form.subVenues.map((sv, index) => (
              <div
                key={sv.id}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center"
              >
                <input
                  type="text"
                  value={sv.name}
                  onChange={(e) => updateSubVenue(sv.id, "name", e.target.value)}
                  placeholder="Sub-Venue Name"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={sv.shortName}
                  onChange={(e) => updateSubVenue(sv.id, "shortName", e.target.value)}
                  placeholder="Short Name"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={sv.capacity}
                  onChange={(e) => updateSubVenue(sv.id, "capacity", e.target.value)}
                  placeholder="Capacity"
                  className={inputClass}
                />
                <Select
                  value={sv.type}
                  onChange={(val) => updateSubVenue(sv.id, "type", val)}
                  className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                  options={subVenueTypeOptions}
                />
                <input
                  type="text"
                  value={sv.parking}
                  onChange={(e) => updateSubVenue(sv.id, "parking", e.target.value)}
                  placeholder="Parking"
                  className={inputClass}
                />
                {form.subVenues.length > 1 && (
                  <button
                    onClick={() => removeSubVenue(sv.id)}
                    className="flex h-9 w-9 items-center justify-center text-gray-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Contact Details */}
        <Section icon={<Phone size={13} />} title="Contact Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IconInput
              icon={<User size={15} />}
              value={form.contactPerson}
              onChange={(v) => updateField("contactPerson", v)}
              placeholder="Contact Person"
            />
            <IconInput
              icon={<Phone size={15} />}
              value={form.phoneNumber}
              onChange={(v) => updateField("phoneNumber", v)}
              placeholder="Phone Number"
            />
            <IconInput
              icon={<Mail size={15} />}
              value={form.emailAddress}
              onChange={(v) => updateField("emailAddress", v)}
              placeholder="Email Address"
              type="email"
            />
            <IconInput
              icon={<Globe size={15} />}
              value={form.website}
              onChange={(v) => updateField("website", v)}
              placeholder="Website"
            />
            <IconInput
              icon={<Instagram size={15} />}
              value={form.instagramHandle}
              onChange={(v) => updateField("instagramHandle", v)}
              placeholder="Instagram Handle"
            />
          </div>
        </Section>

        {/* Location */}
        <Section icon={<MapPin size={13} />} title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <textarea
                value={form.fullAddress}
                onChange={(e) => updateField("fullAddress", e.target.value)}
                placeholder="Full Address"
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
                <Select
                  value={form.state}
                  onChange={(val) => updateField("state", val)}
                  placeholder="State"
                  className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                  options={stateOptions}
                />
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => updateField("pincode", e.target.value)}
                  placeholder="Pincode"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Map placeholder — wire to your maps provider */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 min-h-[160px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-rose-100" />
              <div className="relative flex flex-col items-center gap-1 text-[#7A2E45]">
                <MapPin size={24} />
                <span className="text-xs font-medium">Pin Location</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Gallery */}
        <Section icon={<ImageIcon size={13} />} title="Gallery">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[#7A2E45] bg-[#FBF1F3]"
                : "border-gray-400 bg-[#FDF9FA] hover:bg-[#FBF1F3]"
            }`}
          >
            <FileText size={20} className="text-gray-400" />
            <p className="text-sm text-gray-600">Drop high-res images here</p>
            <p className="text-xs text-gray-400">PNG, JPG or WEBP up to 10MB each</p>
            <span className="mt-1 px-4 py-1.5 rounded-lg bg-[#7A2E45] text-white text-xs font-medium">
              Browse Files
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              onChange={(e) => processFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {form.galleryFiles.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {form.galleryFiles.map((img, index) => (
                <div key={index} className="relative group h-24 rounded-lg overflow-hidden">
                  <img
                    src={img.preview}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Additional Remarks */}
        <Section title="Additional Remarks">
          <textarea
            value={form.additionalRemarks}
            onChange={(e) => {
              if (e.target.value.length <= MAX_REMARKS_LENGTH) {
                updateField("additionalRemarks", e.target.value);
              }
            }}
            placeholder="Internal Notes or Special Instructions"
            rows={4}
            className={`${inputClass} resize-none bg-[#FBF1F3]`}
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {form.additionalRemarks.length}/{MAX_REMARKS_LENGTH}
          </p>
        </Section>
      </div>

      {/* Sticky bottom confirm bar */}
      <div className="sticky bottom-0 border-t border-rose-100 bg-white px-6 py-4 flex justify-end">
        <button
          onClick={handleSaveVenue}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
        >
          <Save size={16} />
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

export default AddVenuePage;