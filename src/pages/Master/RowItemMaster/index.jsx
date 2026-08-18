import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, ChevronDown, ChevronLeft, ChevronRight  ,  X} from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";
import { ContentLoader } from "@/components/loaders/ContentLoader";
import PaginatedSearchSelect from "@/components/form-inputs/select/PaginatedSearchSelect";
import { confirmDelete, showApiResult, showApiError } from "../../../utils/swalHelpers";
import {
    PAGE_HEADER,
    DEFAULT_SORTING,
    STATUS_OPTIONS,
    getRawItemColumns,
} from "./constant";
import AddRowItem from "../../../partials/modals/add-row-item/AddRowItem";
import {
    getAllRawItemMaster,
    getbyidrawitem,
    deleterawitem,
    getAllRawCategoryMaster,
    getAllRawSubCategoryMaster,
    getAllUnitMaster,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const PAGE_SIZE = 100;

const userId = Number(localStorage.getItem("userId"));

const normalizeRow = (row) => ({
    id: row.id,
    itemName: row.nameEnglish || row.nameHindi || row.nameGujarati || "",
    itemNameEnglish: row.nameEnglish,
    itemNameHindi: row.nameHindi,
    itemNameGujarati: row.nameGujarati,

    image: row.images?.[0]?.path || null,

    status: row.isActive === false ? "inactive" : "active",

    unit: row.unitNameEnglish || "",
    mainCategory: row.rawCategoryNameEnglish || "",
    subCategory: row.rawSubCategoryNameEnglish || "",

    rawCategoryId: row.rawCategoryId,
    rawSubCategoryId: row.rawSubCategoryId,
    unitId: row.unitId,

    openingQuantity: row.openingQuantity,
    closingQuantity: row.closingQuantity,
    expiryDate: row.expiryDate,
});

const RowItemMaster = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [pageMeta, setPageMeta] = useState({ last: true, totalElements: 0, totalPages: 0 });

    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [subCategoryFilter, setSubCategoryFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [unitFilter, setUnitFilter] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
const hasActiveFilters =
    searchText !== "" ||
    categoryFilter !== null ||
    subCategoryFilter !== null ||
    statusFilter !== "" ||
    unitFilter !== null;

const handleClearFilters = () => {
    setSearchText("");
    setCategoryFilter(null);
    setSubCategoryFilter(null);
    setStatusFilter("");
    setUnitFilter(null);
    // page reset to 0 happens automatically via the existing filter-change useEffect
};
    const fetchRowItemList = useCallback(async () => {
        setLoading(true);
        try {
            const payload = {
                isActive: statusFilter === "" ? null : statusFilter === "active",
                nameEnglish: searchText,
                page,
                rawCategoryId: categoryFilter ?? null,
                rawSubCategoryId: subCategoryFilter ?? null,
                size: PAGE_SIZE,
                sortBy: DEFAULT_SORTING?.sortBy || "id",
                sortDirection: DEFAULT_SORTING?.sortDirection || "DESC",
                supplierId: null, // no supplier filter in the toolbar yet
                unitId: unitFilter ?? null,
                userId:userId,
            };

            const res = await getAllRawItemMaster(payload);
            const data = res?.data?.data;
            const list = data?.content || [];

            setTableData(Array.isArray(list) ? list.map(normalizeRow) : []);
            setPageMeta({
                last: data?.last ?? true,
                totalElements: data?.totalElements ?? list.length,
                totalPages: data?.totalPages ?? 1,
            });
        } catch (err) {
            console.error(err);
            setTableData([]);
            setPageMeta({ last: true, totalElements: 0, totalPages: 0 });
        } finally {
            setLoading(false);
        }
    }, [searchText, categoryFilter, subCategoryFilter, statusFilter, unitFilter, page]);

    useEffect(() => {
        fetchRowItemList();
    }, [fetchRowItemList]);

    // reset to page 0 whenever any filter/search changes (avoids landing on an out-of-range page)
    useEffect(() => {
        setPage(0);
    }, [searchText, categoryFilter, subCategoryFilter, statusFilter, unitFilter]);

    // clear sub-category whenever main category changes, since sub-category options depend on it
    useEffect(() => {
        setSubCategoryFilter(null);
    }, [categoryFilter]);

    const handleEdit = async (row) => {
        try {
            const res = await getbyidrawitem(row.id);
            const item = res?.data?.data ?? res?.data;

            setEditingItem(item);
            setIsModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

   const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.itemNameEnglish);
    if (!confirmed) return;

    try {
        const res = await deleterawitem(row.id);
        const success = showApiResult(res, {
            onSuccess: fetchRowItemList,
        });
        // showApiResult already shows the toast using the API's own msg;
        // nothing else needed here.
    } catch (err) {
        showApiError(err);
    }
};

    const handleAddItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleSaveItem = async () => {
        await fetchRowItemList();
        setEditingItem(null);
        setIsModalOpen(false);
    };

    const columns = useMemo(
        () =>
            getRawItemColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        []
    );

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-3">
        {/* Search */}
        <div className="relative w-full max-w-sm">
            <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none"
            />
        </div>

        <div className="flex flex-wrap items-center gap-2">
            <div className="w-44">
                <PaginatedSearchSelect
                    key={`cat-${hasActiveFilters ? "x" : "reset"}-${categoryFilter ?? "none"}`}
                    fetchFn={getAllRawCategoryMaster}
                    extraParams={{ isActive: true, userId }}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    placeholder="Category"
                />
            </div>

            <div className="w-44">
                <PaginatedSearchSelect
                    key={categoryFilter ?? "all-cats"}
                    fetchFn={getAllRawSubCategoryMaster}
                    extraParams={{
                        isActive: true,
                        userId,
                        rawCategoryId: categoryFilter ?? undefined,
                    }}
                    value={subCategoryFilter}
                    onChange={setSubCategoryFilter}
                    placeholder="Sub Category"
                    disabled={!categoryFilter}
                />
            </div>

            <div className="w-40">
                <PaginatedSearchSelect
                    key={unitFilter ?? "unit-reset"}
                    fetchFn={getAllUnitMaster}
                    extraParams={{ isActive: true, userId }}
                    value={unitFilter}
                    onChange={setUnitFilter}
                    placeholder="Unit"
                />
            </div>

            <FilterDropdown
                label="Status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={setStatusFilter}
            />

            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex items-center gap-1.5 rounded-lg border border-primary-clarity px-3 py-2 text-sm font-medium text-primary hover:bg-primary-inverse transition"
                >
                    <X size={14} />
                    Clear Filters
                </button>
            )}
        </div>
    </div>
);

    const showEmptyState = !loading && tableData.length === 0;

    return (
        <div className="min-h-screen p-6 mt-0">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
                </div>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-900"
                >
                    <Plus size={16} />
                    {PAGE_HEADER.addButtonLabel}
                </button>
            </div>

            {toolbar}

            {loading ? (
                <div className="min-h-[300px] relative">
                    <ContentLoader />
                </div>
            ) : showEmptyState ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                    No raw items found.
                </div>
            ) : (
                <TableComponent
                    columns={columns}
                    data={tableData}
                    tableData={tableData}
                    loading={false}
                    paginationSize={PAGE_SIZE}
                />
            )}

            

            <AddRowItem
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    fetchRowItemList();
                }}
                onSave={handleSaveItem}
                initialData={editingItem}
            />
        </div>
    );
};

const FilterDropdown = ({ label, value, options, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
            <option value="" disabled hidden>
                {label}
            </option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
    </div>
);

export default RowItemMaster;