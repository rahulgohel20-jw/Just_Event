import React, { useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";

import { TableComponent } from "@/components/table/TableComponent";

import {
    PAGE_HEADER,
    UNIT_TABLE_DATA,
    DEFAULT_PAGINATION_SIZE,
    DEFAULT_SORTING,
    getUnitColumns,
    STATUS_OPTIONS,
} from "./constant";
import AddUnit from "../../../partials/modals/add-unit/AddUnit";

const UnitMaster = () => {
    const [tableData, setTableData] = useState(UNIT_TABLE_DATA);

    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

    const filteredData = useMemo(() => {
        return tableData.filter((row) => {
            const matchesSearch = row.unitName
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const matchesStatus = statusFilter
                ? row.status === statusFilter
                : true;

            return matchesSearch && matchesStatus;
        });
    }, [tableData, searchText, statusFilter]);

    const handleEdit = (row) => {
        setEditingUnit(row);
        setIsModalOpen(true);
    };

    const handleDelete = (row) => {
        console.log(row);
    };

    const columns = useMemo(
        () =>
            getUnitColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        []
    );

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
                    <p className="mt-1 max-w-xl text-sm text-gray-500">{PAGE_HEADER.description}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingUnit(null);
                        setIsModalOpen(true);
                    }}
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red=900"
                >
                    <Plus size={16} />
                    {PAGE_HEADER.addButtonLabel}
                </button>
            </div>

            {/* Toolbar */}

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


                <div>
                    <FilterDropdown
                        label="Status"
                        value={statusFilter}
                        options={STATUS_OPTIONS}
                        onChange={setStatusFilter}
                    />
                </div>
            </div>

            <TableComponent
                columns={columns}
                data={filteredData}
                tableData={filteredData}
                paginationSize={DEFAULT_PAGINATION_SIZE}
                defaultSorting={DEFAULT_SORTING}
            />

            <AddUnit
                open={isModalOpen}
                onClose={() => {
                    setEditingUnit(null);
                    setIsModalOpen(false);
                }}
                initialData={editingUnit}
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