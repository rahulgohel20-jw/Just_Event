import { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { Plus, Route } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import {
  AddTransportation,
  GetAllTrip,
  getAllClientMaster,
} from "@/services/apiServices";
import { showApiResult, showApiError } from "@/utils/swalHelpers";
import { AddTripModal } from "../TripMaster/AddTripModal";
import { AddVendorModal } from "../../../partials/modals/AddVendorModal/AddVendorModal";

const initialFormState = {
  tripBegin: null,
  tripEnd: null,
  amount: "",
  agency: null,
};

const AddTransportationModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [tripOptions, setTripOptions] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const [agencyOptions, setAgencyOptions] = useState([]);
  const [agenciesLoading, setAgenciesLoading] = useState(false);

  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  const isEditMode = Boolean(initialData);
  const userId = Number(localStorage.getItem("userId"));

  const fetchTripOptions = useCallback(async () => {
    setTripsLoading(true);
    try {
      const res = await GetAllTrip({
        nameEnglish: "",
        page: 0,
        size: 1000,
        sortBy: "id",
        sortDirection: "DESC",
        userId,
      });
      const body = res?.data ?? res;
      const content = body?.data?.content ?? body?.data ?? [];
      setTripOptions(
        (Array.isArray(content) ? content : []).map((item) => ({
          value: item.id,
          label: item.nameEnglish,
        }))
      );
    } catch (err) {
      console.error("Failed to load trips:", err);
      setTripOptions([]);
    } finally {
      setTripsLoading(false);
    }
  }, [userId]);

const fetchAgencyOptions = useCallback(async () => {
  setAgenciesLoading(true);
  try {
    const res = await getAllClientMaster({
      nameEnglish: "",
      page: 0,
      size: 1000,
      sortBy: "id",
      sortDirection: "DESC",
      userId,
    });
    const body = res?.data ?? res;
    const content = body?.data?.content ?? body?.data ?? [];
    const vendorsOnly = (Array.isArray(content) ? content : []).filter(
      (item) => item.categoryTypeNameEnglish !== "Customer"
    );
    setAgencyOptions(
      vendorsOnly.map((item) => ({
        value: item.id,
        label: item.nameEnglish,
      }))
    );
  } catch (err) {
    console.error("Failed to load agencies:", err);
    setAgencyOptions([]);
  } finally {
    setAgenciesLoading(false);
  }
}, [userId]);

  useEffect(() => {
    if (open) {
      fetchTripOptions();
      fetchAgencyOptions();
    }
  }, [open, fetchTripOptions, fetchAgencyOptions]);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        tripBegin: initialData.tripBeginId ?? initialData.tripBegin?.value ?? null,
        tripEnd: initialData.tripEndId ?? initialData.tripEnd?.value ?? null,
        amount: initialData.amount ?? "",
        agency: initialData.agencyId ?? initialData.agency?.value ?? null,
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [open, initialData]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.tripBegin) newErrors.tripBegin = "Origin is required";
    if (!form.tripEnd) newErrors.tripEnd = "Destination is required";
    if (form.tripBegin && form.tripEnd && form.tripBegin === form.tripEnd) {
      newErrors.tripEnd = "Destination must differ from origin";
    }
    if (form.amount === "" || form.amount === null) {
      newErrors.amount = "Amount is required";
    } else if (Number.isNaN(Number(form.amount)) || Number(form.amount) < 0) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!form.agency) newErrors.agency = "Agency is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      id: isEditMode && initialData?.id ? initialData.id : null,
      fromId: form.tripBegin,
      toId: form.tripEnd,
      amount: form.amount,
      partyId: form.agency,
      userId,
    };

    setSaving(true);
    try {
      const res = await AddTransportation(payload);
      showApiResult(res, {
        successTitle: isEditMode ? "Transportation Updated" : "Transportation Saved",
        onSuccess: () => {
          const body = res?.data ?? res;
          onSave?.(body?.data ?? body);
          handleReset();
        },
      });
    } catch (err) {
      console.error("Save transportation failed:", err);
      showApiError(err, { title: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  // Called when a new Trip is created via the inline "+" next to Origin.
  // Refreshes the trip options and auto-selects the newly created trip as the origin.
  const handleTripSaved = async (savedTrip) => {
    await fetchTripOptions();
    if (savedTrip?.id) {
      updateField("tripBegin", savedTrip.id);
    }
    setIsTripModalOpen(false);
  };

  // Called when a new Vendor is created via the inline "+" next to Agency.
  const handleVendorSaved = async () => {
    await fetchAgencyOptions();
    setIsVendorModalOpen(false);
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={handleReset}
        width={520}
        centered
        title={null}
        footer={
          <div className="flex justify-between items-center px-6 pb-6">
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors disabled:opacity-60"
            >
              <Route size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        }
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-[#7A2E45]">
              {isEditMode ? "Edit Transport Master" : "Add Transport Master"}
            </h2>
            <button onClick={handleReset} className="text-gray-500 hover:text-gray-700 mt-1">
              <i className="ki-filled ki-cross text-lg"></i>
            </button>
          </div>

          <hr className="border-t border-gray-200 mb-5" />

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Transport_begin</label>
              <div className="flex items-center gap-2">
                <Select
                  value={form.tripBegin}
                  onChange={(val) => updateField("tripBegin", val)}
                  placeholder={tripsLoading ? "Loading..." : "Select transport origin"}
                  className="flex-1 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                  options={tripOptions}
                  loading={tripsLoading}
                  showSearch
                  optionFilterProp="label"
                />
                <button
                  type="button"
                  onClick={() => setIsTripModalOpen(true)}
                  className="flex items-center justify-center h-[42px] w-[42px] rounded-lg bg-[#F7E5EA] text-[#7A2E45] hover:bg-[#f0d3dc] transition-colors shrink-0"
                  title="Add new trip"
                >
                  <Plus size={18} />
                </button>
              </div>
              {errors.tripBegin && <p className="mt-1 text-xs text-danger">{errors.tripBegin}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Transport_end</label>
              <Select
                value={form.tripEnd}
                onChange={(val) => updateField("tripEnd", val)}
                placeholder={tripsLoading ? "Loading..." : "Select transport destination"}
                className="w-full [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                options={tripOptions}
                loading={tripsLoading}
                showSearch
                optionFilterProp="label"
              />
              {errors.tripEnd && <p className="mt-1 text-xs text-danger">{errors.tripEnd}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
              <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#7A2E45] focus-within:border-[#7A2E45]">
                <span className="flex items-center px-3 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  placeholder="0.00"
                  className="flex-1 py-2.5 pr-3 text-sm focus:outline-none"
                />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-danger">{errors.amount}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Agency</label>
              <div className="flex items-center gap-2">
                <Select
                  value={form.agency}
                  onChange={(val) => updateField("agency", val)}
                  placeholder={agenciesLoading ? "Loading..." : "Select provider agency"}
                  className="flex-1 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!items-center"
                  options={agencyOptions}
                  loading={agenciesLoading}
                  showSearch
                  optionFilterProp="label"
                />
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(true)}
                  className="flex items-center justify-center h-[42px] w-[42px] rounded-lg bg-[#F7E5EA] text-[#7A2E45] hover:bg-[#f0d3dc] transition-colors shrink-0"
                  title="Add new vendor"
                >
                  <Plus size={18} />
                </button>
              </div>
              {errors.agency && <p className="mt-1 text-xs text-danger">{errors.agency}</p>}
            </div>
          </div>
        </div>
      </CustomModal>

      {/* Inline "+": create a new Trip without leaving the Transportation modal */}
      <AddTripModal
        open={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSave={handleTripSaved}
        initialData={null}
      />

      {/* Inline "+": create a new Vendor without leaving the Transportation modal */}
      <AddVendorModal
        open={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSave={handleVendorSaved}
        initialData={null}
      />
    </>
  );
};

export { AddTransportationModal };