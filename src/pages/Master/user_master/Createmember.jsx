import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import PaginatedSearchSelect from "@/components/form-inputs/select/PaginatedSearchSelect";
import {
  signup,
  getallrolemaster,
  getstatebycountry,
  getbycitiesbystate,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";

const DEFAULT_COUNTRY_ID = 1; // static - Country is not user-selectable

const EMPTY_FORM = {
  id: null,
  firstName: "",
  lastName: "",
  countryId: DEFAULT_COUNTRY_ID,
  stateId: null,
  cityId: null,
  mobileNo: "",
  roleId: null,
  email: "",
  officeEmail: "",
  password: "",
  confirmPassword: "",
  isChildUser: false,
};

const Createmember = ({ open, onClose, onSave, initialData, onAddRole }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initialData?.id);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              id: initialData.id,
              firstName: initialData.firstName ?? "",
              lastName: initialData.lastName ?? "",
              countryId: initialData.countryId ?? DEFAULT_COUNTRY_ID,
              stateId: initialData.stateId ?? null,
              cityId: initialData.cityId ?? null,
              mobileNo: initialData.mobileNo ?? "",
              roleId: initialData.roleId ?? null,
              email: initialData.email ?? "",
              officeEmail: initialData.officeEmail ?? "",
              password: "",
              confirmPassword: "",
              isChildUser: initialData.isChildUser ?? false,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // picking a new State resets the dependent City selection
  const handleStateChange = (value) => {
    setForm((prev) => ({ ...prev, stateId: value, cityId: null }));
    setErrors((prev) => ({ ...prev, stateId: undefined, cityId: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.lastName?.trim()) next.lastName = "Last name is required.";
    if (!form.stateId) next.stateId = "State is required.";
    if (!form.cityId) next.cityId = "City is required.";
    if (!form.mobileNo?.trim()) next.mobileNo = "Mobile number is required.";
    if (!form.roleId) next.roleId = "Role is required.";
    if (!form.email?.trim()) next.email = "Email is required.";
    if (!isEdit && !form.password?.trim()) next.password = "Password is required.";
    if (!isEdit && form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
      const userId = Number(localStorage.getItem("userId"));

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        address: form.address ?? "", // TODO: no Address field in the current UI
        cityId: form.cityId,
        clientId: userId , // TODO: not in UI - confirm what this should be
        companyEmail: form.officeEmail, // assumption: UI's "Office Email" maps here
        companyName: form.companyName ?? "", // TODO: no Company Name field in the current UI
        confirmPassword: form.confirmPassword,
        contactNo: form.mobileNo,
        countryCode: form.countryCode ?? "+91", // TODO: not in UI - confirm what this should be
        countryId: form.countryId,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        officeNo: form.officeNo ?? "", // TODO: not in UI - confirm what this should be
        password: form.password,
        roleId: form.roleId,
        stateId: form.stateId,
      };

      const res = await signup(payload);
      showApiResult(res, {
        successTitle: isEdit ? "Updated" : "Added",
        fallbackSuccess: isEdit ? "Member updated successfully." : "Member added successfully.",
        errorTitle: isEdit ? "Update Failed" : "Add Failed",
        onSuccess: () => onSave?.(),
      });
    } catch (err) {
      showApiError(err, { title: isEdit ? "Update Failed" : "Add Failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-3 px-5 pb-4">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
    </div>
  );

  return (
    <CustomModal open={open} onClose={onClose} title="Create Member" footer={footer}>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={handleChange("firstName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={handleChange("lastName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Last name"
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <PaginatedSearchSelect
              value={form.stateId}
              onChange={handleStateChange}
              fetchFn={getstatebycountry}
              sizeParamName="size"
              searchParamName="nameEnglish"
              extraParams={{
                countryId: form.countryId,
                sortBy: "id",
                sortDirection: "ASC",
              }}
              labelKey="nameEnglish"
              valueKey="id"
              placeholder="Select state..."
            />
            {errors.stateId && <p className="text-xs text-red-500 mt-1">{errors.stateId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <PaginatedSearchSelect
              key={form.stateId} // remounts (and refetches) when the parent state changes
              value={form.cityId}
              onChange={handleChange("cityId")}
              fetchFn={getbycitiesbystate}
              sizeParamName="size"
              searchParamName="nameEnglish"
              extraParams={{
                stateId: form.stateId,
                sortBy: "id",
                sortDirection: "ASC",
              }}
              labelKey="nameEnglish"
              valueKey="id"
              placeholder="Select city..."
              disabled={!form.stateId}
            />
            {errors.cityId && <p className="text-xs text-red-500 mt-1">{errors.cityId}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile No <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.mobileNo}
            onChange={handleChange("mobileNo")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Mobile No"
          />
          {errors.mobileNo && <p className="text-xs text-red-500 mt-1">{errors.mobileNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <PaginatedSearchSelect
                value={form.roleId}
                onChange={handleChange("roleId")}
                fetchFn={getallrolemaster}
                sizeParamName="size"
                searchParamName="nameEnglish"
                extraParams={{
                  sortBy: "id",
                  sortDirection: "DSEC",
                  userId: Number(localStorage.getItem("userId")),
                }}
                labelKey="nameEnglish"
                valueKey="id"
                placeholder="Select Role"
              />
            </div>
            {/* TODO: wire onAddRole - opens AddRole modal to create a role
                without leaving this form; passed in from the parent so this
                modal doesn't need to own role-master CRUD logic itself. */}
          
          </div>
          {errors.roleId && <p className="text-xs text-red-500 mt-1">{errors.roleId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Email"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Email</label>
            <input
              type="email"
              value={form.officeEmail}
              onChange={handleChange("officeEmail")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Office Email"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={isEdit ? "Leave blank to keep current password" : "Password"}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <label htmlFor="isChildUser" className="text-sm font-medium text-gray-700">
            Is Child User
          </label>
          <button
            type="button"
            id="isChildUser"
            onClick={() => handleChange("isChildUser")(!form.isChildUser)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isChildUser ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isChildUser ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div> */}
      </div>
    </CustomModal>
  );
};

export { Createmember };