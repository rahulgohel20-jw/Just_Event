import React, { useMemo, useState } from 'react'
import { DEFAULT_PAGINATION_SIZE, DEFAULT_SORTING, getRowMaterialTypeColumns, PAGE_HEADER, RAW_CATEGORY_TABLE_DATA, STATUS_FILTER_OPTIONS } from './constant'
import { ChevronDown, Plus, Search } from 'lucide-react'
import { TableComponent } from "@/components/table/TableComponent";
import AddRowCategoryType from '../../../partials/modals/add-rowcategory-type/AddRowCategoryType';

const RowMaterialTypeMaster = () => {
    const [tableData, setTableData] = useState(RAW_CATEGORY_TABLE_DATA)
    const [statusFilter, setStatusFilter] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        setIsAddModalOpen(true);
    };

    const handleDelete = (record) => console.log("Delete category:", record);

    const columns = useMemo(
        () =>
            getRowMaterialTypeColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        []
    );


    
    const filteredData = useMemo(() => {
        return tableData.filter((row) => {
            const matchesSearch = row.categoryName
                .toLowerCase()
                .includes(searchText.toLowerCase());
            const matchesStatus = statusFilter ? row.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [tableData, searchText, statusFilter]);

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
                    onChange={setStatusFilter}
                />
            </div>
        </div>
    );
    return (
        <div className='min-h-screen p-6 mt-0'>

            {/* Page header */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{PAGE_HEADER.title}</h1>
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

            {/* Table */}
            <TableComponent
                columns={columns}
                data={filteredData}
                tableData={filteredData}
                paginationSize={DEFAULT_PAGINATION_SIZE}
                defaultSorting={DEFAULT_SORTING}
                toolbar={toolbar}
            />

            {/* Add / Edit Row Category Modal */}
            <AddRowCategoryType
                open={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingCategory(null);
                }}
                initialData={editingCategory}
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
