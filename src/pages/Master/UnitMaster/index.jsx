import React, { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { confirmDelete, showApiError, showApiResult } from "@/utils/swalHelpers";
import { TableComponent } from "@/components/table/TableComponent";

import {
    PAGE_HEADER,
    DEFAULT_PAGINATION_SIZE,
    DEFAULT_SORTING,
    getUnitColumns,
    STATUS_OPTIONS,
} from "./constant";
import AddUnit from "../../../partials/modals/add-unit/AddUnit";
import {
    getAllUnitMaster,
    addupdateunitmaster,
    deleteunitmaster,
} from "@/services/apiServices";

const UnitMaster = () => {
    const [tableData, setTableData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const [pageIndex, setPageIndex] = useState(0); // 0-indexed, matches Spring Pageable
    const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION_SIZE);
    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

  const userId = Number(localStorage.getItem("userId"));

    const searchDebounceRef = useRef(null);

    useEffect(() => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchText);
            setPageIndex(0);
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

            const res = await getAllUnitMaster(payload);
            const records = res?.data?.data?.content ?? [];
            const total = res?.data?.data?.totalElements ?? 0;

            setTableData(records);
            setTotalCount(total);
        } catch (err) {
            console.error("Failed to fetch units:", err);
            setTableData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize, sorting, statusFilter, debouncedSearch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (row) => {
        setEditingUnit(row);
        setIsModalOpen(true);
    };

   const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nameEnglish || "this unit");
    if (!confirmed) return;

    try {
        const res = await deleteunitmaster(row.id);
        showApiResult(res, {
            successTitle: "Unit Deleted",
            fallbackSuccess: "Unit deleted successfully.",
            onSuccess: () => {
                if (tableData.length === 1 && pageIndex > 0) {
                    setPageIndex((p) => p - 1);
                } else {
                    fetchData();
                }
            },
        });
    } catch (err) {
        showApiError(err, {
            title: "Something went wrong",
            fallback: "Failed to delete unit.",
        });
    }
};

const handleSaveUnit = async (formData) => {
    try {
        const payload = {
            unitNameEnglish: formData.unitName?.english || "",
            unitNameHindi: formData.unitName?.hindi || "",
            unitNameGujarati: formData.unitName?.gujarati || "",
            symbolEnglish: formData.symbol,
            isActive: formData.isActive,
            ...(editingUnit ? { id: editingUnit.id } : {}),
            userId,
        };

        const res = await addupdateunitmaster(payload);
        showApiResult(res, {
            successTitle: editingUnit ? "Unit Updated" : "Unit Saved",
            onSuccess: () => {
                setIsModalOpen(false);
                setEditingUnit(null);
                fetchData();
            },
        });
    } catch (err) {
        showApiError(err, {
            title: "Something went wrong",
            fallback: "Failed to save unit.",
        });
    }
};

    const columns = useMemo(
        () => getUnitColumns({ onEdit: handleEdit, onDelete: handleDelete }),
        [tableData, pageIndex]
    );

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl  text-primary">{PAGE_HEADER.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUnit(null);
                        setIsModalOpen(true);
                    }}
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark"
                >
                    <Plus size={16} />
                    {PAGE_HEADER.addButtonLabel}
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-3">
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

               
            </div>

            <TableComponent
                columns={columns}
                data={tableData}
                tableData={tableData}
                loading={loading}
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

            <AddUnit
                open={isModalOpen}
                onClose={() => {
                    setEditingUnit(null);
                    setIsModalOpen(false);
                }}
                initialData={editingUnit}
                onSave={handleSaveUnit}
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

export default UnitMaster;