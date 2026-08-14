import { useEffect, useRef, useState } from "react";
import { DatePicker } from "antd";
import { Save, Loader2, Upload, X } from "lucide-react";
import dayjs from "dayjs";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { addupadtebankaccount } from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const initialFormState = {
  accountHolderName: "",
  accountNo: "",
  bankName: "",
  branchName: "",
  ifscCode: "",
  upiId: "",
  openingBalance: "",
  openingDate: dayjs(),
  qrCode: null,
  existingQrCodeUrl: null,
  isPrimary: false,
};

const AddBankAccount = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (!open) return;

    setErrors({});
  if (initialData) {
      setForm({
        accountHolderName: initialData.accountHolderName || "",
        accountNo: initialData.accountNo || "",
        bankName: initialData.bankName || "",
        branchName: initialData.branchName || "",
        ifscCode: initialData.ifscCode || "",
        upiId: initialData.upiId || "",
        openingBalance: initialData.openingBalance ?? "",
        openingDate: initialData.openingDate
          ? dayjs(initialData.openingDate, "DD/MM/YYYY")
          : dayjs(),
        qrCode: null,
        existingQrCodeUrl: initialData.qrCode || null,
        isPrimary: initialData.isPrimary ?? false,
      });
    } else {
      setForm(initialFormState);
    }
  }, [open, initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleChange("qrCode", file);
  };

  const handleRemoveFile = () => {
    handleChange("qrCode", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.accountHolderName.trim()) {
      nextErrors.accountHolderName = "Account holder name is required";
    }
    if (!form.accountNo.trim()) {
      nextErrors.accountNo = "Account number is required";
    }
    if (!form.bankName.trim()) {
      nextErrors.bankName = "Bank name is required";
    }
    if (!form.branchName.trim()) {
      nextErrors.branchName = "Branch name is required";
    }
    if (!form.ifscCode.trim()) {
      nextErrors.ifscCode = "IFSC code is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const userId = Number(localStorage.getItem("userId")) || 0;
    const openingBalance = Number(form.openingBalance) || 0;

    // matches BankDetailsRequestDto exactly
    const jsonPayload = {
      id: initialData?.id ?? null,
      accountHolderName: form.accountHolderName,
      accountNo: form.accountNo,
      bankName: form.bankName,
      branchName: form.branchName,
      ifscCode: form.ifscCode,
      upiId: form.upiId,
      openingBalance,
      currentBalance: isEditMode
        ? initialData?.currentBalance ?? openingBalance
        : openingBalance,
      openingDate: form.openingDate.format("YYYY-MM-DD"),
      isPrimary: form.isPrimary,
      userId,
    };

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(jsonPayload)], { type: "application/json" })
    );
    if (form.qrCode) {
      formData.append("qrCode", form.qrCode);
    }

    setSaving(true);
    try {
      const res = await addupadtebankaccount(formData);

      const success = showApiResult(res, {
        successTitle: isEditMode ? "Bank Account Updated" : "Bank Account Saved",
        fallbackSuccess: "Operation completed successfully.",
        errorTitle: "Failed",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          setForm(initialFormState);
          onClose?.();
        },
      });

      if (!success) {
        return;
      }
    } catch (err) {
      console.error("Failed to save bank account:", err);
      showApiError(err, {
        title: "Failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <CustomModal
      open={open}
      onClose={handleReset}
      width={760}
      centered
      title={null}
      footer={
        <div className="flex justify-end items-center gap-3 px-6 pb-6">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-medium transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save
          </button>
        </div>
      }
    >
      <div className="px-6 pt-5 pb-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-primary">
            {isEditMode ? "Edit Bank Details" : "Add Bank Details"}
          </h2>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 mt-1"
          >
            <i className="ki-filled ki-cross text-lg"></i>
          </button>
        </div>

        {/* Account Holder Name + Account Number */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>Account Holder Name
            </label>
            <input
              type="text"
              value={form.accountHolderName}
              onChange={(e) => handleChange("accountHolderName", e.target.value)}
              placeholder="Enter account holder name"
              className={inputClass("accountHolderName")}
            />
            {errors.accountHolderName && (
              <p className="text-xs text-red-500 mt-1">{errors.accountHolderName}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>Account Number
            </label>
            <input
              type="text"
              value={form.accountNo}
              onChange={(e) => handleChange("accountNo", e.target.value)}
              placeholder="Enter account number"
              className={inputClass("accountNo")}
            />
            {errors.accountNo && (
              <p className="text-xs text-red-500 mt-1">{errors.accountNo}</p>
            )}
          </div>
        </div>

        {/* Bank Name + Branch Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>Bank Name
            </label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
              placeholder="Enter bank name"
              className={inputClass("bankName")}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>Branch Name
            </label>
            <input
              type="text"
              value={form.branchName}
              onChange={(e) => handleChange("branchName", e.target.value)}
              placeholder="Enter branch name"
              className={inputClass("branchName")}
            />
            {errors.branchName && (
              <p className="text-xs text-red-500 mt-1">{errors.branchName}</p>
            )}
          </div>
        </div>

        {/* IFSC Code + UPI ID */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              <span className="text-red-500 mr-0.5">*</span>IFSC Code
            </label>
            <input
              type="text"
              value={form.ifscCode}
              onChange={(e) =>
                handleChange("ifscCode", e.target.value.toUpperCase())
              }
              placeholder="Enter IFSC code (e.g., SBIN00012...)"
              className={inputClass("ifscCode")}
            />
            {errors.ifscCode && (
              <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              UPI ID (Optional)
            </label>
            <input
              type="text"
              value={form.upiId}
              onChange={(e) => handleChange("upiId", e.target.value)}
              placeholder="Enter UPI ID (e.g., user@bank)"
              className={inputClass("upiId")}
            />
          </div>
        </div>

        {/* Bank Opening Balance + Bank Opening Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              Bank Opening Balance
            </label>
            <input
              type="number"
              value={form.openingBalance}
              onChange={(e) => handleChange("openingBalance", e.target.value)}
              placeholder="Enter Balance"
              className={inputClass("openingBalance")}
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1.5 block">
              Bank Opening Date
            </label>
            <DatePicker
              value={form.openingDate}
              onChange={(date) => handleChange("openingDate", date || dayjs())}
              format="DD/MM/YYYY"
              className="w-full !py-2.5"
              allowClear={false}
            />
          </div>
        </div>

        {/* QR Code Image */}
     {/* QR Code Image */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 mb-1.5 block">QR Code Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {form.qrCode ? (
            // a new file was just picked, replacing whatever existed before
            <div className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700">
              <span className="truncate max-w-[200px]">{form.qrCode.name}</span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ) : form.existingQrCodeUrl ? (
            // showing the QR code already saved on this account
            <div className="flex items-center gap-3">
              <img
                src={form.existingQrCodeUrl}
                alt="Current QR code"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                <Upload size={15} />
                Replace QR Code
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <Upload size={15} />
              Upload QR Code
            </button>
          )}
        </div>

        {/* Is Primary Account toggle */}
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-gray-700">Is Primary Account?</label>
          <button
            type="button"
            onClick={() => handleChange("isPrimary", !form.isPrimary)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isPrimary ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isPrimary ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export { AddBankAccount };