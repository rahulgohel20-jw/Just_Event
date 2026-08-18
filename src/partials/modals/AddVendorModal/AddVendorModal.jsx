import { useCallback, useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { UserPlus, Phone, Mail, Plus, Upload, Trash2, X } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { addupdateclientmaster, generateUniqueCodeforvendor, getAllCategoryMaster } from "@/services/apiServices"; // ⚠️ confirm real function name
import Swal from "sweetalert2";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";
import { DateField } from "@/components/form-inputs/DatePicker/Datefield"; // ⚠️ adjust path to wherever you place DateField.jsx
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const opbTypeOptions = [
  { value: "CR", label: "CR" },
  { value: "DR", label: "DR" },
];

const documentTypes = [
  { value: "AADHARCARD", label: "Aadhar Card" },
  { value: "PANCARD", label: "PAN Card" },
];

const initialFormState = {
  vendorName: { english: "", hindi: "", gujarati: "" },
  vendorFirmName: "",
  vendorCode: "",
  category: null,
  mobile1: "",
  office1: "",
  mobile2: "",
  emailAddress: "",
  orderAddress: "",
  opbAmount: "",
  opbType: "CR",
  opbDate: "",
  birthDate: "",
  aniversaryDate: "",
  gstNo: "",
  gstPercent: "",
  panCardNo: "",
  tdsPercent: "",
  aadharCardNo: "",
};

const AddVendorModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [codeLoading, setCodeLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [kycDocuments, setKycDocuments] = useState([
    { id: 0, docId: "", type: null, number: "", file: null },
  ]);
  const isEditMode = Boolean(initialData);
  const nextKycIdRef = useRef(1); // 0 is used by the first row created above
  const userId = Number(localStorage.getItem("userId"));

  const fetchUniqueCode = useCallback(async () => {
    setCodeLoading(true);
    try {
      const res = await generateUniqueCodeforvendor(userId);
      const body = res?.data ?? res;
      const code = body?.data;

      if (!code) {
        console.warn("generateUniqueCodeforvendor returned no code", body);
        setForm((prev) => ({ ...prev, vendorCode: "" }));
      } else {
        setForm((prev) => ({ ...prev, vendorCode: code }));
      }
    } catch (err) {
      console.error("Failed to generate vendor code:", err);
    } finally {
      setCodeLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await getAllCategoryMaster({
        nameEnglish: "",
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDirection: "DESC",
        userId,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? [];

      const filtered = content.filter(
        (item) => item.categoryTypeNameEnglish !== "Customer"
      );

      setCategoryOptions(
        filtered.map((item) => ({
          value: item.id,
          label: item.nameEnglish,
        }))
      );
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategoryOptions([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  const handleVendorNameChange = (name, updatedValue) => {
    setForm((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, vendorName: "" }));
  };

  const handleTranslate = async (englishText) => {
    try {
      const res = await Translateapi(englishText);
      const data = res?.data ?? res;
      return {
        hindi: data?.hindi,
        gujarati: data?.gujarati,
      };
    } catch (err) {
      console.error("Failed to translate vendor name:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        vendorName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        vendorFirmName: initialData.vendorFirmName || "",
        vendorCode: initialData.uniqueCode || "",
        category: initialData.categoryId || null,
        mobile1: initialData.mobileNo || "",
        office1: initialData.officeNo || "",
        mobile2: initialData.mobile2 || "",
        emailAddress: initialData.email || "",
        orderAddress: initialData.address || "",
        opbAmount: initialData.openingBalance || "",
        opbType: "CR",
        opbDate: initialData.opbDate || "",
        birthDate: initialData.birthDate || "",
        aniversaryDate: initialData.aniversaryDate || "",
        gstNo: initialData.gstNo || "",
        gstPercent: initialData.gstPercent || "",
        panCardNo: initialData.panCardNo || "",
        tdsPercent: initialData.tdsPercent || "",
        aadharCardNo: initialData.aadharCardNo || "",
      });

      const existingDocs = initialData.kycDetails || [];
setKycDocuments(
  existingDocs.length
    ? existingDocs.map((doc, index) => ({
        id: index,
        docId: doc.id ?? "",
        type: doc.kycType ?? null,
        number: doc.docNumber ?? "",
        file: null,
        fileName: doc.documentPath ? doc.documentPath.split("/").pop() : "",
        documentUrl: doc.documentPath ?? "",
      }))
    : [{ id: 0, docId: "", type: null, number: "", file: null }]
);
      nextKycIdRef.current = existingDocs.length || 1;
    } else {
      setForm(initialFormState);
      fetchUniqueCode();
      setKycDocuments([{ id: 0, docId: "", type: null, number: "", file: null }]);
      nextKycIdRef.current = 1;
    }

    setErrors({});
  }, [open, initialData, fetchUniqueCode]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.vendorName.english.trim()) {
      newErrors.vendorName = "Vendor Name is required";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.mobile1.trim()) {
      newErrors.mobile1 = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile1)) {
      newErrors.mobile1 = "Enter a valid Mobile Number";
    }

    if (
      form.emailAddress &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)
    ) {
      newErrors.emailAddress = "Enter a valid Email";
    }

    // KYC is optional — no longer a blocking requirement to save

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addDocument = () => {
    setKycDocuments((prev) => [
      ...prev,
      { id: nextKycIdRef.current++, docId: "", type: null, number: "", file: null },
    ]);
  };

  const removeDocument = (id) => {
    setKycDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id, key, value) => {
    setKycDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [key]: value } : doc))
    );
    setErrors((prev) => ({ ...prev, kyc: "" }));
  };

  const uploadDocument = (id, file) => {
    updateDocument(id, "file", file);
  };

  const removeUploadedFile = (id) => {
    setKycDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, file: null, fileName: "", documentUrl: "" }
          : doc
      )
    );
  };

  const handleReset = () => {
    setForm(initialFormState);
    setKycDocuments([{ id: 0, docId: "", type: null, number: "", file: null }]);
    nextKycIdRef.current = 1;
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const userId = Number(localStorage.getItem("userId"));

    const formData = new FormData();
    formData.append("id", initialData?.id ?? "");
    formData.append("nameEnglish", form.vendorName.english);
    formData.append("nameHindi", form.vendorName.hindi);
    formData.append("nameGujarati", form.vendorName.gujarati);
    formData.append("uniqueCode", form.vendorCode);
    formData.append("categoryId", form.category);
    formData.append("mobileNo", form.mobile1);
    formData.append("officeNo", form.office1);
    formData.append("email", form.emailAddress);
    formData.append("address", form.orderAddress);
    formData.append("openingBalance", form.opbAmount);
    formData.append("opbDate", form.opbDate);
    formData.append("birthDate", form.birthDate);
    formData.append("aniversaryDate", form.aniversaryDate);
    formData.append("userId", userId);

    // only include KYC rows the user actually filled in (type or number or file present)
    const filledDocs = kycDocuments.filter(
      (doc) => doc.type || doc.number || doc.file instanceof File || doc.documentUrl
    );

    filledDocs.forEach((doc, index) => {
      formData.append(`kycDetails[${index}].id`, doc.docId ?? "");
      formData.append(`kycDetails[${index}].kycType`, doc.type ?? "");
      formData.append(`kycDetails[${index}].docNumber`, doc.number ?? "");
      if (doc.file instanceof File) {
        formData.append(`kycDetails[${index}].document`, doc.file);
      }
    });

    try {
      const res = await addupdateclientmaster(formData);
      const success = showApiResult(res, {
        successTitle: isEditMode ? "Vendor Updated" : "Vendor Added",
        errorTitle: "Failed",
      });

      if (success) {
        await onSave?.();
        handleReset();
      }
    } catch (err) {
      showApiError(err);
    }
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
            {isEditMode ? "Update Vendor" : "Save Vendor"}
          </button>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto px-2 pt-2 pb-4">
        <div className="flex justify-between items-start mb-6 px-6 pt-2">
          <div>
            <h2 className="text-xl font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Vendor" : "Add Vendor"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage vendor information, business details, taxation details,
              and financial records to maintain a precise enterprise ledger.
            </p>
          </div>
          <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 mt-1">
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        <div className="px-6 space-y-7">
          <Section title="Vendor Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <MultiLangInputBox
                  label="Vendor Name"
                  name="vendorName"
                  value={form.vendorName}
                  onChange={handleVendorNameChange}
                  onTranslate={handleTranslate}
                  required
                />
                {errors.vendorName && (
                  <p className="mt-1 text-xs text-danger">{errors.vendorName}</p>
                )}
              </div>
            

              <div>
                <label>
                   Vendor Code
                </label>
                <input
                  type="text"
                  value={codeLoading ? "Generating..." : form.vendorCode}
                  readOnly
                  className={`${inputClass} bg-[#FBF1F3] text-[#7A2E45] cursor-not-allowed`}
                />
                <p className="text-xs text-gray-400 mt-1">Vendor Code (Auto-generated)</p>
              </div>

              <div>
                <label>
                  Category
                </label>
                <Select
                  value={form.category}
                  onChange={(val) => updateField("category", val)}
                  placeholder={categoriesLoading ? "Loading categories..." : "Category"}
                  className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                  options={categoryOptions}
                  loading={categoriesLoading}
                  showSearch
                  optionFilterProp="label"
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-danger">{errors.category}</p>
                )}
              </div>

              <DateField
                label="Birth Date"
                value={form.birthDate}
                onChange={(v) => updateField("birthDate", v)}
              />
              <DateField
                label="Anniversary Date"
                value={form.aniversaryDate}
                onChange={(v) => updateField("aniversaryDate", v)}
              />
            </div>
          </Section>

         <Section title="Contact Information">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Mobile No */}
    <div>
      <label className="block mb-1 text-sm font-medium">
        Mobile No
      </label>

      <IconInput
        icon={<Phone size={15} />}
        value={form.mobile1}
        onChange={(v) => updateField("mobile1", v)}
        placeholder="Mobile 1"
      />

      {errors.mobile1 && (
        <p className="mt-1 text-xs text-danger">{errors.mobile1}</p>
      )}
    </div>

    {/* Office No */}
    <div>
      <label className="block mb-1 text-sm font-medium">
        Office No
      </label>

      <IconInput
        icon={<Phone size={15} />}
        value={form.office1}
        onChange={(v) => updateField("office1", v)}
        placeholder="Office 1"
      />
    </div>

    {/* Email Address */}
    <div>
      <label className="block mb-1 text-sm font-medium">
        Email Address
      </label>

      <IconInput
        icon={<Mail size={15} />}
        value={form.emailAddress}
        onChange={(v) => updateField("emailAddress", v)}
        placeholder="Email Address"
        type="email"
      />

      {errors.emailAddress && (
        <p className="mt-1 text-xs text-danger">{errors.emailAddress}</p>
      )}
    </div>
  </div>
</Section>

          <Section title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={form.orderAddress}
                onChange={(e) => updateField("orderAddress", e.target.value)}
                placeholder="Address"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </Section>

          <Section title="Identity & Financials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex h-[42px] rounded-lg border border-gray-400 overflow-hidden">
                <span className="flex items-center px-3 bg-[#F7E5EA] text-xs font-medium text-[#7A2E45] whitespace-nowrap shrink-0">
                  OPB
                </span>
                <input
                  type="text"
                  value={form.opbAmount}
                  onChange={(e) => updateField("opbAmount", e.target.value)}
                  className="flex-1 min-w-0 px-3 text-sm focus:outline-none"
                />
                <Select
                  value={form.opbType}
                  onChange={(v) => updateField("opbType", v)}
                  options={opbTypeOptions}
                  className="w-20 shrink-0 h-full [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!border-l [&_.ant-select-selector]:!border-gray-400 [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!items-center"
                />
              </div>

              <DateField
                label="OPB Date"
                value={form.opbDate}
                onChange={(v) => updateField("opbDate", v)}
              />
            </div>
          </Section>

          <Section title="KYC Documents (Optional)">
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addDocument}
                  className="flex items-center gap-1 text-primary font-medium hover:underline"
                >
                  <Plus size={16} />
                  Add Another
                </button>
              </div>

              {kycDocuments.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 col-span-6">
                    <Select
                      value={doc.type}
                      placeholder="Document Type"
                      options={documentTypes}
                      onChange={(value) => updateDocument(doc.id, "type", value)}
                      className="w-full h-[42px] [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!items-center"
                    />
                  </div>

                 <div className="md:col-span-4 col-span-6">
  {doc.file instanceof File ? (
    // Newly selected file — not uploaded yet, no URL to preview
    <div className="border border-primary-clarity rounded-lg h-[42px] px-3 flex items-center justify-between">
      <span className="truncate text-sm">{doc.file.name}</span>
      <button type="button" onClick={() => removeUploadedFile(doc.id)}>
        <X size={16} className="text-danger hover:text-red-700" />
      </button>
    </div>
  ) : doc.documentUrl ? (
    // Existing document from server — link opens it in a new tab
    <div className="border border-primary-clarity rounded-lg h-[42px] px-3 flex items-center justify-between gap-2">
      <a
        href={doc.documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-sm text-primary underline hover:opacity-80"
        title={doc.fileName}
      >
        {doc.fileName || "View Document"}
      </a>
      <div className="flex items-center gap-2 shrink-0">
        <label
          htmlFor={`upload-${doc.id}`}
          className="text-xs text-gray-500 hover:text-primary cursor-pointer"
          title="Replace document"
        >
          <Upload size={16} />
        </label>
        <input
          id={`upload-${doc.id}`}
          type="file"
          hidden
          onChange={(e) => uploadDocument(doc.id, e.target.files?.[0])}
        />
        <button type="button" onClick={() => removeUploadedFile(doc.id)}>
          <X size={16} className="text-danger hover:text-red-700" />
        </button>
      </div>
    </div>
  ) : (
    <>
      <label
        htmlFor={`upload-${doc.id}`}
        className="border border-dashed border-primary-lighter rounded-lg h-[42px] flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50"
      >
        <Upload size={18} />
        Upload Document
      </label>
      <input
        id={`upload-${doc.id}`}
        type="file"
        hidden
        onChange={(e) => uploadDocument(doc.id, e.target.files?.[0])}
      />
    </>
  )}
</div>

                  <div className="md:col-span-3 col-span-6">
                    <input
                      type="text"
                      placeholder="Document Number"
                      value={doc.number}
                      onChange={(e) => updateDocument(doc.id, "number", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2 col-span-6 flex items-center gap-2">
                    <button
                      type="button"
                      className="flex-1 h-[42px] rounded-lg bg-primary text-white hover:opacity-90"
                    >
                      Verify
                    </button>
                    {kycDocuments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </CustomModal>
  );
};

const inputClass =
  "w-full rounded-lg border border-gray-400 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]";

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="h-3.5 w-1 rounded-full bg-[#7A2E45]" />
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#7A2E45]">{title}</h3>
    </div>
    {children}
  </div>
);

const IconInput = ({ icon, value, onChange, placeholder, type = "text" }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputClass} pl-9`}
    />
  </div>
);

export { AddVendorModal };