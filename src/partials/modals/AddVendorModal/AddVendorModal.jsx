import { useState } from "react";
import { Select } from "antd";
import { UserPlus, Phone, Mail } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const categoryOptions = [
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "decor-styling", label: "Decor & Styling" },
  { value: "audio-visual", label: "Audio Visual" },
  { value: "printing-services", label: "Printing Services" },
];

const opbTypeOptions = [
  { value: "CR", label: "CR" },
  { value: "DR", label: "DR" },
];

// Simple auto-gen preview for the read-only Vendor Code field.
// Replace with a real generator/API call when wiring this up.
const generateVendorCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VND-${year}-${random}`;
};

const initialFormState = {
  vendorName: "",
  vendorFirmName: "",
  vendorCode: generateVendorCode(),
  category: null,
  mobile1: "",
  office1: "",
  mobile2: "",
  emailAddress: "",
  orderAddress: "",
  homeAddress: "",
  opbAmount: "",
  opbType: "CR",
  opbDate: "",
  gstNo: "",
  gstPercent: "",
  panCardNo: "",
  tdsPercent: "",
  aadharCardNo: "",
};

const AddVendorModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialFormState);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm({ ...initialFormState, vendorCode: generateVendorCode() });
    onClose();
  };

  const handleSave = () => {
    if (!form.vendorName.trim()) return;
    onSave?.({
      ...form,
      category: categoryOptions.find((c) => c.value === form.category) || null,
    });
    setForm({ ...initialFormState, vendorCode: generateVendorCode() });
  };

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={900}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-8 pb-6">
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <UserPlus size={16} />
            Save Vendor
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pt-2 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 px-6 pt-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">Add Vendor</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage vendor information, business details, taxation details,
              and financial records to maintain a precise enterprise ledger.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="px-6 space-y-7">
          {/* Vendor Information */}
          <Section title="Vendor Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={form.vendorName}
                onChange={(e) => updateField("vendorName", e.target.value)}
                placeholder="Vendor Name"
                className={inputClass}
              />
              <input
                type="text"
                value={form.vendorFirmName}
                onChange={(e) => updateField("vendorFirmName", e.target.value)}
                placeholder="Vendor Firm Name"
                className={inputClass}
              />

              <div>
                <input
                  type="text"
                  value={form.vendorCode}
                  readOnly
                  className={`${inputClass} bg-[#FBF1F3] text-[#7A2E45] cursor-not-allowed`}
                />
                <p className="text-xs text-gray-400 mt-1">Vendor Code (Auto-gen)</p>
              </div>

              <Select
                value={form.category}
                onChange={(val) => updateField("category", val)}
                placeholder="Category"
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={categoryOptions}
                showSearch
                optionFilterProp="label"
              />
            </div>
          </Section>

          {/* Contact Information */}
          <Section title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IconInput
                icon={<Phone size={15} />}
                value={form.mobile1}
                onChange={(v) => updateField("mobile1", v)}
                placeholder="Mobile 1"
              />
              <IconInput
                icon={<Phone size={15} />}
                value={form.office1}
                onChange={(v) => updateField("office1", v)}
                placeholder="Office 1"
              />
              <IconInput
                icon={<Phone size={15} />}
                value={form.mobile2}
                onChange={(v) => updateField("mobile2", v)}
                placeholder="Mobile 2"
              />
              <IconInput
                icon={<Mail size={15} />}
                value={form.emailAddress}
                onChange={(v) => updateField("emailAddress", v)}
                placeholder="Email Address"
                type="email"
              />
            </div>
          </Section>

          {/* Address Information */}
          <Section title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={form.orderAddress}
                onChange={(e) => updateField("orderAddress", e.target.value)}
                placeholder="Order Address"
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <textarea
                value={form.homeAddress}
                onChange={(e) => updateField("homeAddress", e.target.value)}
                placeholder="Home Address"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </Section>

          {/* Identity & Financials */}
          <Section title="Identity & Financials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex rounded-lg border border-gray-400 overflow-hidden">
                <span className="flex items-center px-3 bg-[#F7E5EA] text-xs font-medium text-[#7A2E45] whitespace-nowrap">
                  OPB
                </span>
                <input
                  type="text"
                  value={form.opbAmount}
                  onChange={(e) => updateField("opbAmount", e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                <Select
                  value={form.opbType}
                  onChange={(v) => updateField("opbType", v)}
                  options={opbTypeOptions}
                  className="[&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!rounded-none w-20"
                />
              </div>

              <DateField
                label="OPB Date"
                value={form.opbDate}
                onChange={(v) => updateField("opbDate", v)}
              />

              <input
                type="text"
                value={form.gstNo}
                onChange={(e) => updateField("gstNo", e.target.value)}
                placeholder="GST No."
                className={inputClass}
              />
              <input
                type="text"
                value={form.gstPercent}
                onChange={(e) => updateField("gstPercent", e.target.value)}
                placeholder="GST (%)"
                className={inputClass}
              />

              <input
                type="text"
                value={form.panCardNo}
                onChange={(e) => updateField("panCardNo", e.target.value)}
                placeholder="PAN Card No."
                className={inputClass}
              />
              <input
                type="text"
                value={form.tdsPercent}
                onChange={(e) => updateField("tdsPercent", e.target.value)}
                placeholder="TDS (%)"
                className={inputClass}
              />

              <input
                type="text"
                value={form.aadharCardNo}
                onChange={(e) => updateField("aadharCardNo", e.target.value)}
                placeholder="Aadhar Card No."
                className={inputClass}
              />
            </div>
          </Section>
        </div>
      </div>
    </CustomModal>
  );
};

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------
const inputClass =
  "w-full rounded-lg border border-gray-400 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]";

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="h-3.5 w-1 rounded-full bg-[#7A2E45]" />
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">
        {title}
      </h3>
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

const DateField = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-medium text-[#7A2E45] mb-1 block">{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </div>
);

export { AddVendorModal };