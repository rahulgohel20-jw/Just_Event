import React, { useMemo, useState } from "react";
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Download,
    ChevronDown,
} from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";

import {
    PAGE_HEADER,
    
    DEFAULT_PAGINATION_SIZE,
    DEFAULT_SORTING,
    
    STATUS_OPTIONS,
    getRawItemColumns,
    UNIT_OPTIONS,
} from "./constant";
import AddRowItem from "../../../partials/modals/add-row-item/AddRowItem";

const RowItemMaster = () => {
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [unitFilter, setUnitFilter] = useState("");

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
        const matchesSearch = row.itemName
            .toLowerCase()
            .includes(searchText.toLowerCase());

        const matchesStatus = statusFilter
            ? row.status === statusFilter
            : true;

        const matchesUnit = unitFilter
            ? row.unit === unitFilter
            : true;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesUnit
        );
    });
}, [
    tableData,
    searchText,
    statusFilter,
    unitFilter,
]);

    const handleEdit = (row) => {
        setEditingItem(row);
        setIsModalOpen(true);
    };

    const handleDelete = (row) => {
        console.log(row);
    };

    const handleAddItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
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
                    onChange={(e) =>
                        setSearchText(e.target.value)
                    }
                    placeholder="Search by name..."
                    className="w-full rounded-lg border border-primary-clarity bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none"
                />
            </div>


            <div className="flex flex-wrap items-center gap-2">
            
                <FilterDropdown
                    label="Unit"
                    value={unitFilter}
                    options={UNIT_OPTIONS}
                    onChange={setUnitFilter}
                />
                <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    options={STATUS_OPTIONS}
                    onChange={setStatusFilter}
                />
               
            </div>
        </div>
    );
    return (
        <div className="min-h-screen p-6 mt-0">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
                </div>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red=900"
                >
                    <Plus size={16} />
                    {PAGE_HEADER.addButtonLabel}
                </button>
            </div>

            {toolbar}

            <TableComponent
                columns={columns}
                data={filteredData}
                tableData={filteredData}
                paginationSize={DEFAULT_PAGINATION_SIZE}
                defaultSorting={DEFAULT_SORTING}
            />

            <AddRowItem
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                }}
                initialData={editingItem}
            />

        </div>
    );
}
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

export default RowItemMaster
