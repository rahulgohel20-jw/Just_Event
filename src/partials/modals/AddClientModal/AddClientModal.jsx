import { useState } from "react";
import { Select } from "antd";
import { Search, Plus, UserPlus, Phone, Mail } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed
import { AddCategoryModal } from "../../../partials/modals/AddCategoryModal/AddCategoryModal"; // adjust path as needed

const defaultCategoryOptions = [
  { value: "corporate", label: "Corporate" },
  { value: "wedding", label: "Wedding" },
  { value: "vip", label: "VIP" },
  { value: "social", label: "Social" },
];

const opbTypeOptions = [
  { value: "CR", label: "CR" },
  { value: "DR", label: "DR" },
];

const initialFormState = {
  fullName: "",
  category: null,
  mobile1: "",
  office1: "",
  mobile2: "",
  emailAddress: "",
  orderAddress: "",
  homeAddress: "",
  birthDate: "",
  vatNumber: "",
  anniversaryDate: "",
  panCardNo: "",
  opbDate: "",
  gstNo: "",
  opbAmount: "",
  opbType: "CR",
  aadharCardNo: "",
};

const AddClientModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialFormState);
  const [categoryOptions, setCategoryOptions] = useState(defaultCategoryOptions);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    setForm(initialFormState);
    onClose();
  };

  const handleSave = () => {
    if (!form.fullName.trim()) return;
    onSave?.({
      ...form,
      category: categoryOptions.find((c) => c.value === form.category) || null,
    });
    setForm(initialFormState);
  };

  const handleSaveNewCategory = ({ categoryName, mainCategory }) => {
    const newValue = categoryName.trim().toLowerCase().replace(/\s+/g, "-");
    const newOption = { value: newValue, label: categoryName.trim() };

    setCategoryOptions((prev) => [...prev, newOption]);
    updateField("category", newValue); // auto-select the newly created category
    setIsAddCategoryOpen(false);
  };

  return (
    <>
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
              Save Client
            </button>
          </div>
        }
      >
        <div className="max-h-[75vh] overflow-y-auto px-2 pt-2 pb-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 px-6 pt-2">
            <div>
              <h2 className="text-xl font-semibold text-[#7A2E45]">Add Client</h2>
              <p className="text-sm text-gray-500 mt-1">
                Add and manage client information within the Just Event ecosystem.
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
            {/* Basic Information */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Full Name"
                  className={inputClass}
                />

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    />
                    <Select
                      value={form.category}
                      onChange={(val) => updateField("category", val)}
                      placeholder="Search or Select Category"
                      className="w-full [&_.ant-select-selector]:!pl-9 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg"
                      options={categoryOptions}
                      showSearch
                      optionFilterProp="label"
                    />
                  </div>
                  <button
                    type="button"
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-[#7A2E45] text-white hover:bg-[#66253a]"
                    onClick={() => setIsAddCategoryOpen(true)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </Section>

            {/* Contact Details */}
            <Section title="Contact Details">
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

            {/* Physical Address */}
            <Section title="Physical Address">
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
                <DateField
                  label="Birth Date"
                  value={form.birthDate}
                  onChange={(v) => updateField("birthDate", v)}
                />
                <input
                  type="text"
                  value={form.vatNumber}
                  onChange={(e) => updateField("vatNumber", e.target.value)}
                  placeholder="VAT Number"
                  className={inputClass}
                />

                <DateField
                  label="Anniversary Date"
                  value={form.anniversaryDate}
                  onChange={(v) => updateField("anniversaryDate", v)}
                />
                <input
                  type="text"
                  value={form.panCardNo}
                  onChange={(e) => updateField("panCardNo", e.target.value)}
                  placeholder="PAN Card No."
                  className={inputClass}
                />

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

      {/* Quick-add category modal, opened from the + button above */}
      <AddCategoryModal
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSave={handleSaveNewCategory}
      />
    </>
  );
};


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

export { AddClientModal };