import { useState } from "react";
import { Plus } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { AddVendorModal } from "../AddVendorModal/AddVendorModal";
import PaginatedSearchSelect from "@/components/form-inputs/select/PaginatedSearchSelect";
import { getAllClientMaster } from "@/services/apiServices";

const userId = Number(localStorage.getItem("userId"));

const AddSupplier = ({ open, onClose, onSave }) => {
  const [supplier, setSupplier] = useState();
  const [supplierName, setSupplierName] = useState("");
  const [price, setPrice] = useState("");
  const [defaultSupplier, setDefaultSupplier] = useState(false);
  const [localVendors, setLocalVendors] = useState([]); // vendors added via the "+" modal, shown immediately
  const [vendorModalOpen, setVendorModalOpen] = useState(false);

  const handleReset = () => {
    setSupplier(undefined);
    setSupplierName("");
    setPrice("");
    setDefaultSupplier(false);
    onClose();
  };

  const handleSave = () => {
    if (!supplier || !price) return;

    onSave({
      supplierId: supplier,
      supplierName,
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
            <PaginatedSearchSelect
              key={open ? "open" : "closed"}
              fetchFn={getAllClientMaster}
              extraParams={{ isActive: true, userId }}
              sizeParamName="size"
              searchParamName="nameEnglish"
              extraOptions={localVendors}
              value={supplier}
              onChange={setSupplier}
              onSelectOption={(full) => {
                setSupplierName(full?.label || "");
                // ⚠️ party-master/list records likely don't carry a price/rate —
                // remove this line if getAllClientMaster never returns one.
                if (full?.price) setPrice(String(full.price));
              }}
              placeholder="Select Supplier"
            />
            <button
              onClick={() => setVendorModalOpen(true)}
              className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0"
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
          // ⚠️ assumes AddVendorModal only creates the client locally for now
          // (no create-client API call here) — if it does call an API,
          // use the real returned id instead of Date.now().
          const newVendor = { value: Date.now(), label: vendor.vendorName };
          setLocalVendors((prev) => [...prev, newVendor]);
          setSupplier(newVendor.value);
          setSupplierName(newVendor.label);
          if (vendor.price) setPrice(String(vendor.price));
          setVendorModalOpen(false);
        }}
      />
    </>
  );
};

export default AddSupplier;