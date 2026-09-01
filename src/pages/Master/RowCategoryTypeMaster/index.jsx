import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_PAGINATION_SIZE, DEFAULT_SORTING, getRowMaterialTypeColumns, PAGE_HEADER, STATUS_FILTER_OPTIONS } from './constant'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { TableComponent } from "@/components/table/TableComponent";
import AddRowCategoryType from '../../../partials/modals/add-rowcategory-type/AddRowCategoryType';
import {
    getAllRawCategoryTypeMaster,
    addupdaterawcategorytype,
    deleterawcategorytype,
} from '@/services/apiServices'; 
import { confirmDelete, showApiError, getPrimaryColor } from "@/utils/swalHelpers";
import Swal from "sweetalert2";

const RowMaterialTypeMaster = () => {
    const [tableData, setTableData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE);
    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const [statusFilter, setStatusFilter] = useState("");
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const searchDebounceRef = useRef(null);
const userId =2;


   
    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchText);
            setPageIndex(0); // reset to first page on new search
        }, 400);
        return () => clearTimeout(searchDebounceRef.current);
    }, [searchText]);
const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const payload = {
            page: pageIndex,
            pageSize,
            sortBy: sorting?.[0]?.id,
            sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
            ...(statusFilter ? { isActive: statusFilter === "active" } : {}),
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            userId,
        };

        const res = await getAllRawCategoryTypeMaster(payload);
        const records = res?.data?.data?.content ?? [];
        const total = res?.data?.data?.totalElements ?? 0;
        setTableData(records);
        setTotalCount(total);
    } catch (err) {
        console.error("Failed to fetch raw category types:", err);
        setTableData([]);
        setTotalCount(0);
    } finally {
        setLoading(false);
    }
}, [pageIndex, pageSize, sorting, statusFilter, debouncedSearch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        setIsAddModalOpen(true);
    };

   

    const handleDelete = async (record) => {
        const confirmed = await confirmDelete(
            record.nameEnglish || record.categoryNameEnglish || "this category type"
        );
        if (!confirmed) return;

        try {
            await deleterawcategorytype(record.id);
            Swal.fire({
                icon: "success",
                title: "Category Type Deleted",
                confirmButtonColor: getPrimaryColor(),
                timer: 1500,
                showConfirmButton: false,
            });
            // Refetch; if we deleted the last row on a page, step back a page
            if (tableData.length === 1 && pageIndex > 0) {
                setPageIndex((p) => p - 1);
            } else {
                fetchData();
            }
        } catch (err) {
            showApiError(err, {
                title: "Something went wrong",
                fallback: "Failed to delete category type.",
            });
        }
    };

    const handleSaveCategory = async (formData) => {
        try {
            const payload = {
                nameEnglish: formData.categoryName?.english || "",
                nameHindi: formData.categoryName?.hindi || "",
                nameGujarati: formData.categoryName?.gujarati || "",
                isActive: formData.isActive,
                userId,
                ...(editingCategory ? { id: editingCategory.id } : {}),
            };

            await addupdaterawcategorytype(payload);
            Swal.fire({
                icon: "success",
                title: editingCategory ? "Category Type Updated" : "Category Type Saved",
                confirmButtonColor: getPrimaryColor(),
                timer: 1500,
                showConfirmButton: false,
            });
            setIsAddModalOpen(false);
            setEditingCategory(null);
            fetchData();
        } catch (err) {
            showApiError(err, {
                title: "Something went wrong",
                fallback: "Failed to save category type.",
            });
        }
    };
    

    const columns = useMemo(
        () =>
            getRowMaterialTypeColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [tableData, pageIndex]
    );

    const toolbar = (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-3">
            <div className="relative w-full max-w-xs">
                <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by Name..."
                    className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-dark placeholder:text-dark-clarity focus:outline-none focus:ring-2 focus:ring-primary-inverse"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    options={STATUS_FILTER_OPTIONS}
                    onChange={(val) => {
                        setStatusFilter(val);
                        setPageIndex(0);
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className='min-h-screen p-6 mt-0'>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
                </div>
                <button
                    type="button"
                    onClick={handleAddCategory}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-light shadow-sm transition"
                >
                    <Plus size={16} />
                    {PAGE_HEADER.addButtonLabel}
                </button>
            </div>

            <TableComponent
                columns={columns}
                data={tableData}
                tableData={tableData}
                loading={loading}
                toolbar={toolbar}
                // server-side pagination/sorting — swap prop names to match TableComponent's actual API
                manualPagination
                manualSorting
                pageCount={Math.max(1, Math.ceil(totalCount / pageSize))}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={(updater) => {
                    const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
                    setPageIndex(next.pageIndex);
                    setPageSize(next.pageSize);
                }}
                sorting={sorting}
                onSortingChange={setSorting}
            />
            <AddRowCategoryType
                open={isAddModalOpen}
                onClose={() => {
                setIsAddModalOpen(false);
                setEditingCategory(null);
                }}
                initialData={editingCategory}
                onSave={handleSaveCategory}
            />
        </div>
    )
}

const FilterDropdown = ({ label, value, options, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none rounded-lg border border-primary-clarity bg-light py-2 pl-3 pr-8 text-sm text-dark-light focus:outline-none focus:ring-2 focus:ring-primary-inverse"
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

export default RowMaterialTypeMaster