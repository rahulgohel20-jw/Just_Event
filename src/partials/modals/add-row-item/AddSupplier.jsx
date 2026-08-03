import { useState } from "react";
import { Select } from "antd";
import { Plus } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { AddVendorModal } from "../AddVendorModal/AddVendorModal";

const supplierOptionsData = [
  { value: 1, label: "DINESH FRUIT", price: 45 },
  { value: 2, label: "SHREE TRADERS", price: 55 },
];

const AddSupplier = ({ open, onClose, onSave }) => {
  const [supplier, setSupplier] = useState();
  const [price, setPrice] = useState("");
  const [defaultSupplier, setDefaultSupplier] = useState(false);
  const [vendorList, setVendorList] = useState(supplierOptionsData);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);

  const handleReset = () => {
    setSupplier(undefined);
    setPrice("");
    setDefaultSupplier(false);
    onClose();
  };

  const handleSave = () => {
    const selected = vendorList.find((x) => x.value === supplier);
    if (!selected || !price) return;

    onSave({
      supplierId: selected.value,
      supplierName: selected.label,
      price,
      isDefault: defaultSupplier,
    });

    handleReset();
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
          <div className="flex justify-end gap-3 p-5">
            <button onClick={handleReset} className="px-5 py-2 rounded-lg border">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white">
              Save
            </button>
          </div>
        }
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Add Supplier</h2>
          <p className="text-sm text-gray-500 mb-6">
            Associate supplier with this raw item.
          </p>

          <label className="text-sm font-medium">Supplier</label>
          <div className="flex gap-2 mt-2 mb-5">
            <Select
              className="w-full"
              placeholder="Select Supplier"
              value={supplier}
              onChange={(value) => {
                setSupplier(value);
                const match = vendorList.find((v) => v.value === value);
                if (match?.price) setPrice(String(match.price));
              }}
              options={vendorList}
              size="large"
            />
            <button
              onClick={() => setVendorModalOpen(true)}
              className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>

          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 mt-2 mb-5 outline-none"
          />

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={defaultSupplier}
              onChange={(e) => setDefaultSupplier(e.target.checked)}
            />
            Set as default supplier
          </label>
        </div>
      </CustomModal>

      <AddVendorModal
        open={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        onSave={(vendor) => {
          const newVendor = {
            value: Date.now(),
            label: vendor.vendorName,
            price: vendor.price || 0,
          };
          setVendorList((prev) => [...prev, newVendor]);
          setSupplier(newVendor.value);
          if (vendor.price) setPrice(String(vendor.price));
          setVendorModalOpen(false);
        }}
      />
    </>
  );
};

export default AddSupplier;