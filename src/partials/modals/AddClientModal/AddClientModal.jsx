import { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { Search, Plus, UserPlus, Phone, Mail, X, Upload, Trash2 } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Translateapi } from "@/services/apiServices";
import { AddCategoryModal } from "../../../partials/modals/AddCategoryModal/AddCategoryModal"; // adjust path as needed
import { addupdateclientmaster, getAllCategoryMaster } from "../../../services/apiServices";
import { showApiResult, showApiError } from "../../../utils/swalHelpers";

const opbTypeOptions = [
  { value: "CR", label: "CR" },
  { value: "DR", label: "DR" },
];
const toInputDate = (date) => {
  if (!date) return "";

  const parts = date.split("/");

  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return date;
};
const toApiDate = (date) => {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return date;
};
const initialFormState = {
  fullName: {
    english: "",
    hindi: "",
    gujarati: "",
  },

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

const AddClientModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialData);
const userId = Number(localStorage.getItem("userId"));

const fetchCategories = useCallback(async () => {
    try {
      const payload = {
        categoryTypeId :1,
        nameEnglish: "",
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDirection: "DESC",
        userId,
      };

      const res = await getAllCategoryMaster(payload);

      const list =
        res?.data?.data?.content ||
        res?.data?.data ||
        res?.data ||
        [];

      const options = list
  .filter(
    (item) =>
      item.categoryTypeNameEnglish?.trim().toLowerCase() === "customer"
  )
        .map((item) => ({
          value: item.id,
          label: item.nameEnglish,
        }));

      setCategoryOptions(options);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategoryOptions([]);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        fullName: {
          english: initialData.nameEnglish || "",
          hindi: initialData.nameHindi || "",
          gujarati: initialData.nameGujarati || "",
        },
        category: initialData.categoryId || null,
        mobile1: initialData.mobileNo || "",
        office1: initialData.officeNo || "",
        emailAddress: initialData.email || "",
        homeAddress: initialData.address || "",
       birthDate: toInputDate(initialData.birthDate),
anniversaryDate: toInputDate(initialData.aniversaryDate),
opbDate: toInputDate(initialData.opbDate),
        opbAmount: initialData.openingBalance || "",
        opbType: "CR",
        mobile2: "",
        orderAddress: "",
      });
      setKycDocuments(
        initialData.kycDetails?.length
          ? initialData.kycDetails.map((item) => ({
            id: item.id,
            type: item.kycType || "",
            number: item.docNumber || "",
            file: null,
            fileName: item.documentName || "",
            documentUrl: item.document || "",
          }))
          : [
            {
              id: Date.now(),
              type: "",
              number: "",
              file: "",
            },
          ]
      );
    } else {
      setForm(initialFormState);
      setKycDocuments([
        {
          id: Date.now(),
          type: null,
          number: "",
          file: null,
        },
      ]);
    }

    setErrors({});
  }, [open, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.english.trim()) {
      newErrors.fullName = "Full Name is required";
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

    

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleFullNameChange = (name, updatedValue) => {
    setForm((prev) => ({ ...prev, [name]: updatedValue, }));

    setErrors((prev) => ({ ...prev, fullName: "", }));
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
      console.error("Failed to translate full name:", err);
      return null;
    }
  };

  const documentTypes = [
    { value: "AADHARCARD", label: "Aadhar Card" },
    { value: "PANCARD", label: "PAN Card" },
  ];

  const [kycDocuments, setKycDocuments] = useState([
    {
      id: Date.now(),
      type: null,
      number: "",
      file: null,
    },
  ]);

  const addDocument = () => {
    setKycDocuments((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: null,
        number: "",
        file: null,
      },
    ]);
  };

  const removeDocument = (id) => {
    setKycDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id, key, value) => {
    setKycDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
            ...doc,
            [key]: value,
          }
          : doc
      )
    );
    setErrors((prev) => ({
      ...prev,
      kyc: "",
    }));
  };

  const uploadDocument = (id, file) => {
    updateDocument(id, "file", file);
  };
const removeUploadedFile = (id) => {
  setKycDocuments(prev =>
    prev.map(doc =>
      doc.id === id
        ? {
            ...doc,
            file: null,
            fileName: "",
            documentUrl: "",
          }
        : doc
    )
  );
};
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value, }));

    setErrors((prev) => ({ ...prev, [field]: "", }));
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("id", initialData?.id ?? "");
    formData.append("nameEnglish", form.fullName.english);
    formData.append("nameHindi", form.fullName.hindi);
    formData.append("nameGujarati", form.fullName.gujarati);
    formData.append("categoryId", form.category);
    formData.append("mobileNo", form.mobile1);
    formData.append("officeNo", form.office1);
    formData.append("email", form.emailAddress);
    formData.append("address", form.homeAddress);
  formData.append("birthDate", toApiDate(form.birthDate));

formData.append(
  "aniversaryDate",
  toApiDate(form.anniversaryDate)
);

formData.append(
  "opbDate",
  toApiDate(form.opbDate)
);
    formData.append("openingBalance", form.opbAmount);
    formData.append("uniqueCode", "");
    formData.append("userId", userId); // Use the userId from localStorage
    kycDocuments.forEach((doc, index) => {
  formData.append(`kycDetails[${index}].kycType`, doc.type ?? "");
  formData.append(`kycDetails[${index}].docNumber`, doc.number);

  // Append only if an actual File exists
  if (doc.file instanceof File) {
    formData.append(`kycDetails[${index}].document`, doc.file);
  }
});

    try {
      const res = await addupdateclientmaster(formData);
      const success = showApiResult(res, {
        successTitle: isEditMode ? "Client Updated" : "Client Added",
        errorTitle: "Failed",
      });

      if (success) {
        const body = res?.data ?? res;
        await onSave?.(body?.data ?? body);
        handleReset();
      }
    } catch (err) {
      showApiError(err);
    }
  };

  const handleSaveNewCategory = ({ categoryName, mainCategory }) => {
    const newValue = categoryName.trim().toLowerCase().replace(/\s+/g, "-");
    const newOption = { value: newValue, label: categoryName.trim() };

    setCategoryOptions((prev) => [...prev, newOption]);
    updateField("category", newValue);
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
              className="px-5 py-2 rounded-lg bg-primary-inverse text-primary font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-light font-medium transition-colors"
            >
              <UserPlus size={16} />
              {isEditMode ? "Update Client" : "Save Client"}
            </button>
          </div>
        }
      >
        <div className="max-h-[75vh] overflow-y-auto px-2 pt-2 pb-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 px-6 pt-2 border-b border-primary-inverse">
            <div>
              <h2 className="text-xl font-semibold text-primary m-0">{isEditMode ? "Edit Client" : "Add Client"}</h2>
              <p className="text-sm text-gray-500">
                Add or update client information within the Just Event ecosystem.
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
              <MultiLangInputBox
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleFullNameChange}
                onTranslate={handleTranslate}
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-danger">
                  {errors.fullName}
                </p>
              )}
              <Field label="Category">
                <div className="flex items-center gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    />
                    <Select
                      value={form.category}
                      onChange={(val) => updateField("category", val)}
                      placeholder="Search or Select Category"
                      className={`w-full ${FIELD_HEIGHT} [&_.ant-select-selector]:!pl-9 [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-lg`}
                      options={categoryOptions}
                      showSearch
                      optionFilterProp="label"
                    />

                  </div>
                  <button
                    type="button"
                    className={`flex ${FIELD_HEIGHT} w-[42px] shrink-0 items-center justify-center rounded-lg bg-[#7A2E45] text-white hover:bg-[#66253a]`}
                    onClick={() => setIsAddCategoryOpen(true)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {errors.category && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.category}
                  </p>
                )}
              </Field>
            </Section>

            {/* Contact Details */}
            <Section title="Contact Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Mobile 1">
                  <IconInput
                    icon={<Phone size={15} />}
                    value={form.mobile1}
                    onChange={(value) => {
                      updateField("mobile1", value);

                      setErrors((prev) => ({
                        ...prev,
                        mobile1: "",
                      }));
                    }}
                    placeholder="Mobile 1"
                  />
                  {errors.mobile1 && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.mobile1}
                    </p>
                  )}
                </Field>
                <Field label="Office 1">
                  <IconInput
                    icon={<Phone size={15} />}
                    value={form.office1}
                    onChange={(v) => updateField("office1", v)}
                    placeholder="Office 1"
                  />
                </Field>

                <Field label="Email Address">
                  <IconInput
                    icon={<Mail size={15} />}
                    value={form.emailAddress}
                    onChange={(value) => {
                      updateField("emailAddress", value);

                      setErrors((prev) => ({
                        ...prev,
                        emailAddress: "",
                      }));
                    }}
                    placeholder="Email Address"
                    type="email"
                  />
                  {errors.emailAddress && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.emailAddress}
                    </p>
                  )}
                </Field>
              </div>
            </Section>

            {/* Physical Address */}
            <Section title="Address">
              <Field label="Home Address">
                <textarea
                  value={form.homeAddress}
                  onChange={(e) => updateField("homeAddress", e.target.value)}
                  placeholder="Home Address"
                  rows={3}
                  className={textareaClass}
                />
              </Field>
            </Section>

            {/* Identity & Financials */}
            <Section title="Identity & Financials">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end py-2">
                <FloatField
                  label="Birth Date"
                  type="date"
                  value={form.birthDate || ""}
                  onChange={(v) => updateField("birthDate", v)}
                />
                <FloatField
                  label="Anniversary Date"
                  type="date"
                  value={form.anniversaryDate || ""}
                  onChange={(v) => updateField("anniversaryDate", v)}
                />

                <FloatField
                  label="OPB Date"
                  type="date"
                  value={form.opbDate || ""}
                  onChange={(v) => updateField("opbDate", v)}
                />

                <Field label="OPB Amount">
                  <div className={`flex ${FIELD_HEIGHT} rounded-lg border border-gray-400 overflow-hidden`}>
                    <span className="flex items-center px-3 bg-primary-inverse text-xs font-medium text-primary whitespace-nowrap">
                      OPB
                    </span>
                    <input
                      type="text"
                      value={form.opbAmount}
                      onChange={(e) => updateField("opbAmount", e.target.value)}
                      className="flex-1 h-full px-3 text-sm focus:outline-none"
                    />
                    <Select
                      value={form.opbType}
                      onChange={(v) => updateField("opbType", v)}
                      options={opbTypeOptions}
                      className={`h-full w-20 [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-none`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <Section title="KYC Documents">
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

                {kycDocuments.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    {/* Document Type */}

                    <div className="md:col-span-3 col-span-6">
                      <Select
                        value={doc.type}
                        placeholder="Document Type"
                        options={documentTypes}
                        onChange={(value) =>
                          updateDocument(doc.id, "type", value)
                        }
                        className="w-full h-[42px] [&_.ant-select-selector]:!h-full [&_.ant-select-selector]:!items-center"
                      />
                    </div>

                    {/* Upload */}

                    <div className="md:col-span-4 col-span-6">
                     {doc.file instanceof File || doc.fileName ? (
                        <div className="border border-primary-clarity rounded-lg h-[42px] px-3 flex items-center justify-between">
                          <span className="truncate text-sm">
                           {doc.file instanceof File
  ? doc.file.name
  : doc.fileName}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeUploadedFile(doc.id)}
                          >
                            <X
                              size={16}
                              className="text-danger hover:text-red-700"
                            />
                          </button>
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
                            onChange={(e) =>
                              uploadDocument(doc.id, e.target.files?.[0])
                            }
                           
                          />
                        </>
                      )}
                    </div>

                    {/* Number */}

                    <div className="md:col-span-3 col-span-6">
                      <input
                        type="text"
                        placeholder="Document Number"
                        value={doc.number}
                        onChange={(e) =>
                          updateDocument(doc.id, "number", e.target.value)
                        }
                        className={inputClass}
                      
                      />
                    </div>

                    {/* Verify */}

                    <div className="md:col-span-2 col-span-6 flex items-center gap-2">
                  
                      {kycDocuments.length >= 1 && (
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
            {errors.kyc && (
              <p className="text-danger text-sm">
                {errors.kyc}
              </p>
            )}
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


const FIELD_HEIGHT = "h-[42px]";

const inputClass =
  `w-full ${FIELD_HEIGHT} rounded-lg border border-gray-400 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45]`;

const textareaClass =
  "w-full rounded-lg border border-gray-400 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7A2E45] focus:border-[#7A2E45] resize-none";

const Section = ({ title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="h-3.5 w-1 rounded-full bg-primary" />
      <h3 className="text-[11px] font-bold uppercase tracking-wide text-primary m-0">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// Generic label + field wrapper, matches the style already used by DateField
const Field = ({ label, children }) => (
  <div>
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

function FloatField({
  label,
  placeholder,
  className = "",
  ...props
}) {
  const title = label || placeholder;

  return (
    <div className="relative">
      {title && (
        <label className="absolute -top-3 left-3 bg-light px-1 text-[13px] font-medium text-primary z-5">
          {title}
        </label>
      )}

      <input
        {...props}
  value={props.value || ""}
  onChange={(e) =>
    props.onChange ? props.onChange(e.target.value) : null
  }
        placeholder={props.type === "date" ? undefined : placeholder}
        className={`w-full h-11 bg-light border placeholder:text-dark-clarity border-primary-lighter rounded-lg px-4 text-sm text-dark outline-none focus:border-primary-lighter focus:ring-0 ${className}`}
      />
    </div>
  );
}
export { AddClientModal };