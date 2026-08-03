import React, { useEffect, useState } from "react";
import { Save, Loader2, Upload, Search, Pencil, Trash2, UserPlus } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import MultiLangInputBox from "@/components/form-inputs/input/Multilanginputbox";
import { Select } from "antd";
import { supplierColumns } from "../../../pages/Master/RowItemMaster/constant";
import { TableComponent } from "@/components/table/TableComponent";
import AddSupplier from "./AddSupplier";
import {
    Translateapi,
    getAllRawCategoryMaster,
    getAllRawSubCategoryMaster,
    getAllUnitMaster,
} from "@/services/apiServices";

const AddRowItem = ({ open, onClose, onSave, initialData }) => {
    const [form, setForm] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSubCategories, setLoadingSubCategories] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);

    const isEditMode = Boolean(initialData);

    // Load Main Category options when modal opens
    useEffect(() => {
        if (!open) return;
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const res = await getAllRawCategoryMaster({ page: 0, pageSize: 100, isActive: true });
                const records = res?.data?.data?.content ?? [];
                setCategoryOptions(records.map((r) => ({ value: r.id, label: r.nameEnglish })));
            } catch (err) {
                console.error("Failed to fetch raw categories:", err);
                setCategoryOptions([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, [open]);

    // Load Unit options when modal opens
    useEffect(() => {
        if (!open) return;
        const fetchUnits = async () => {
            setLoadingUnits(true);
            try {
                const res = await getAllUnitMaster({ page: 0, pageSize: 100, isActive: true });
                const records = res?.data?.data?.content ?? [];
                setUnitOptions(records.map((r) => ({ value: r.id, label: r.nameEnglish })));
            } catch (err) {
                console.error("Failed to fetch units:", err);
                setUnitOptions([]);
            } finally {
                setLoadingUnits(false);
            }
        };
        fetchUnits();
    }, [open]);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleItemNameChange = (
        name,
        updatedValue
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
    };

    const handleTranslate = async (
        englishText
    ) => {
        try {
            const res = await Translateapi(
                englishText
            );

            const data = res?.data ?? res;

            return {
                hindi: data?.hindi,
                gujarati: data?.gujarati,
            };
        } catch (err) {
            console.log(err);

            return null;
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(
            e.target.files
        );

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...previews],
        }));
    };

    const removeImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const handleReset = () => {
        setForm(initialFormState);
        onClose();
    };

    const handleSave = () => {
        onSave?.(form);
        onClose();
    };
    return (
        <CustomModal
            open={open}
            onClose={handleReset}
            width={900}
            centered
            title={null}
            footer={
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded-lg border border-primary-clarity text-primary"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}

                        {isEditMode ? "Update Item" : "Save"}
                    </button>
                </div>
            }
        >
            <div className="max-h-[75vh] overflow-y-auto px-6 pt-2 pb-4">

                {/* Header */}

                <div className="flex justify-between items-start mb-6 pt-2">
                    <div>
                        <h2 className="text-xl font-semibold text-dark m-0">
                            {isEditMode ? "Edit Raw Item" : "Add Raw Item"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Enter the raw item details below
                        </p>
                    </div>
                    <button onClick={handleReset}>
                        <i className="ki-filled ki-cross text-lg"></i>
                    </button>
                </div>
                {/* Item Name */}
                <div className="mb-6">
                    <MultiLangInputBox
                        label="Item Name"
                        name="itemName"
                        value={form.itemName}
                        onChange={handleItemNameChange}
                        onTranslate={handleTranslate}
                        required
                    />
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Item Main Category
                        </label>
                        <Select
                            value={form.mainCategory}
                            onChange={(value) =>
                                updateField("mainCategory", value)
                            }
                            options={mainCategoryOptions}
                            placeholder="Select Main Category"
                            size="large"
                            className="w-full custom-category-select"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Sub Category
                        </label>
                        <Select
                            value={form.subCategory}
                            onChange={(value) =>
                                updateField("subCategory", value)
                            }
                            options={subCategoryOptions}
                            placeholder="Select Sub Category"
                            size="large"
                            className="w-full custom-category-select"
                        />
                    </div>
                </div>

                {/* Row 2 */}

                <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Opening Quantity
                        </label>
                        <input
                            type="text"
                            value={form.openingQty}
                            onChange={(e) =>
                                updateField("openingQty", e.target.value)
                            }
                            placeholder="Opening Quantity"
                            className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-primary-clarity outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Closing Quantity
                        </label>
                        <input
                            type="text"
                            value={form.closingQty}
                            onChange={(e) =>
                                updateField("closingQty", e.target.value)
                            }
                            placeholder="Closing Quantity"
                            className="w-full border border-primary-clarity rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-primary-clarity outline-none"
                        />

                    </div>

                </div>

                {/* Row 3 */}

                <div className="grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2">

                    <div>

                        <label className="text-sm font-medium mb-2 block">
                            Unit Type
                        </label>

                        <Select
                            value={form.unitType}
                            onChange={(value) =>
                                updateField("unitType", value)
                            }
                            options={unitOptions}
                            placeholder="Select Unit"
                            size="large"
                            className="w-full custom-category-select"
                        />

                    </div>

                    <div>

                        <label className="text-sm font-medium mb-2 block">
                            Expiry Date
                        </label>

                        <input
                            type="date"
                            value={form.expiryDate}
                            onChange={(e) =>
                                updateField("expiryDate", e.target.value)
                            }
                            className="w-full border border-primary-clarity rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-clarity outline-none"
                        />

                    </div>

                </div>

                {/* Product Images */}

                <div className="mb-7">

                    <h4 className="text-xs uppercase tracking-wide text-primary font-semibold mb-3">
                        Product Images
                    </h4>

                    <div className="flex gap-3 flex-wrap border-b-2 border-primary-inverse pb-10">
                        <label className="w-24 h-24 border-2 border-dashed border-primary rounded-xl cursor-pointer flex flex-col justify-center items-center">
                            <Upload
                                size={22}
                                className="text-primary"
                            />
                            <span className="text-xs mt-2">
                                Upload
                            </span>
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={handleImageUpload}
                            />
                        </label>
                        {form.images.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-24 h-24 rounded-xl overflow-hidden"
                            >
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white shadow"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status */}

                <div className="rounded-xl bg-primary-inverse p-4 flex justify-between items-center mb-7">
                    <div>
                        <h4 className="font-semibold">
                            Item Status
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Set whether this unit is currently available.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                updateField(
                                    "isActive",
                                    !form.isActive
                                )
                            }
                            className={`relative inline-flex h-6 w-11 rounded-full ${form.isActive
                                ? "bg-primary"
                                : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 rounded-full bg-white mt-1 transition ${form.isActive
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                    }`}
                            />
                        </button>
                        <span className="text-sm font-medium">
                            {form.isActive
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>
                </div>


                <div className="rounded-xl border border-primary-clarity p-5 mt-5">

                    <div className="flex justify-between items-center mb-5">

                        <div>
                            <h3 className="text-lg font-semibold text-primary">
                                Supplier Association
                            </h3>
                        </div>

                    </div>
                    <div className="flex justify-between gap-5 items-center">
                        <div className="relative w-[80%]">

                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                placeholder="Search Supplier..."
                                value={form.supplierSearch}
                                onChange={(e) =>
                                    updateField("supplierSearch", e.target.value)
                                }
                                className="w-full rounded-lg border border-primary-clarity pl-10 py-2 outline-none"
                            />
                        </div>

                        <button
                            onClick={() => setIsSupplierModalOpen(true)}
                            className="bg-primary text-white rounded-lg px-4 py-2 w-max flex gap-1 items-center"
                        >
                            <UserPlus size={18} />
                            Add Supplier
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-primary-clarity mt-5">

                        <table className="w-full text-sm">
                            <thead className="bg-primary-lighest">
                                <tr className="text-left">
                                    <th className="px-4 py-3 font-semibold">Sr.</th>
                                    <th className="px-4 py-3 font-semibold">Supplier Name</th>
                                    <th className="px-4 py-3 font-semibold">Price</th>
                                    <th className="px-4 py-3 font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {form.suppliers
                                    .filter((supplier) =>
                                        supplier.supplierName
                                            .toLowerCase()
                                            .includes(
                                                form.supplierSearch.toLowerCase()
                                            )
                                    )
                                    .map((supplier, index) => (
                                        <tr
                                            key={supplier.id}
                                            className="border-t border-primary-clarity"
                                        >
                                            <td className="px-4 py-3">{index + 1}</td>

                                            <td className="px-4 py-3 font-medium">
                                                {supplier.supplierName}
                                            </td>

                                            <td className="px-4 py-3">
                                                ₹ {supplier.price}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onEdit(row.original)}
                                                        className="btn btn-sm btn-icon btn-clear border rounded-lg"
                                                    >
                                                        <i className="ki-filled ki-notepad-edit text-third"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(row.original)}
                                                        className="btn btn-sm btn-icon btn-clear border rounded-lg text-danger"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                {form.suppliers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No supplier added.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="mt-6">
                           <TableComponent
                            columns={supplierColumns}
                            data={form.suppliers.filter((x) =>
                                x.supplierName
                                    .toLowerCase()
                                    .includes(form.supplierSearch.toLowerCase())
                            )}
                            tableData={form.suppliers}
                            paginationSize={5}
                            showToolbar={false}
                        />
                    </div> */}
                </div>
            </div>

            <AddSupplier
                open={isSupplierModalOpen}
                onClose={() => {
                    setIsSupplierModalOpen(false);
                }} />

        </CustomModal>
    )
}

export default AddRowItem
