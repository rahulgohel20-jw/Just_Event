import { useState } from "react";
import { Select } from "antd";
import { Plus } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { AddVendorModal } from "../AddVendorModal/AddVendorModal";

const supplierOptionsData = [
  {
    value: 1,
    label: "DINESH FRUIT",
    price: 45,
  },
  {
    value: 2,
    label: "SHREE TRADERS",
    price: 55,
  },
];

const AddSupplier = ({
  open,
  onClose,
  onSave,
}) => {
  const [supplier, setSupplier] = useState();
  const [price, setPrice] = useState("");
  const [defaultSupplier, setDefaultSupplier] = useState(false);

  const [vendorList, setVendorList] = useState(supplierOptionsData);

  const [vendorModalOpen, setVendorModalOpen] =
    useState(false);

  const handleSave = () => {
    const selected = vendorList.find(
      (x) => x.value === supplier
    );

    if (!selected) return;

    onSave({
      supplierId: selected.value,
      supplierName: selected.label,
      price,
      isDefault: defaultSupplier,
    });

    onClose();
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={onClose}
        width={520}
        centered
        title={null}
        footer={
          <div className="flex justify-end gap-3 p-5">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-primary text-white"
            >
              Save
            </button>
          </div>
        }
      >
        <div className="p-6">

          <h2 className="text-2xl font-semibold">
            Add Supplier
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Associate supplier with this raw item.
          </p>

          {/* Supplier */}

          <label className="text-sm font-medium">
            Supplier
          </label>

          <div className="flex gap-2 mt-2">

            <Select
              className="w-full"
              placeholder="Select Supplier"
              value={supplier}
              onChange={setSupplier}
              options={vendorList}
              size="large"
            />

            <button
              onClick={() =>
                setVendorModalOpen(true)
              }
              className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center"
            >
              <Plus size={18} />
            </button>

          </div>
        </div>
      </CustomModal>

      {/* Vendor Modal */}

      <AddVendorModal
        open={vendorModalOpen}
        onClose={() =>
          setVendorModalOpen(false)
        }
        onSave={(vendor) => {
          const newVendor = {
            value: Date.now(),
            label: vendor.vendorName,
            price: vendor.price || 0,
          };

          setVendorList((prev) => [
            ...prev,
            newVendor,
          ]);

          setSupplier(newVendor.value);

          setVendorModalOpen(false);
        }}
      />
    </>
  );
};

export default AddSupplier;