import { useCallback, useState } from "react";
import { getalltheme, deletetheme } from "@/services/apiServices";
import { confirmDelete, showApiResult, showApiError } from "../../../../utils/swalHelpers"; 
import { AddThemeName } from "./AddThemeName";
import { getThemeColumns, DEFAULT_LIST_PAYLOAD } from "./constant";
import { TableComponent } from "../../../../components/table/TableComponent";
import { Plus } from "lucide-react";

const TemplateNameMaster = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [listPayload, setListPayload] = useState(DEFAULT_LIST_PAYLOAD);
  const [refreshKey, setRefreshKey] = useState(0);

 
  const fetchThemes = useCallback(
    async ({ pageIndex, pageSize, sortBy, sortDirection } = {}) => {
      const payload = {
        ...listPayload,
        page: pageIndex ?? listPayload.page,
        size: pageSize ?? listPayload.size,
        sortBy: sortBy ?? listPayload.sortBy,
        sortDirection: sortDirection ?? listPayload.sortDirection,
      };

      try {
        const res = await getalltheme(payload);
        const body = res?.data ?? res;
        const result = body?.data ?? {};

        setListPayload(payload);

        return {
          data: result?.content ?? [],
          total: result?.totalElements ?? 0,
        };
      } catch (error) {
        showApiError(error, { fallback: "Failed to load Template Names" });
        return { data: [], total: 0 };
      }
    },
    [listPayload]
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setListPayload((prev) => ({ ...prev, nameEnglish: value, page: 0 }));
    setRefreshKey((k) => k + 1); // force grid to re-fetch with new search term
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nameEnglish);
    if (!confirmed) return;

    try {
      const res = await deletetheme(row.id);
      showApiResult(res, {
        fallbackSuccess: "Template name deleted successfully",
        onSuccess: () => setRefreshKey((k) => k + 1),
      });
    } catch (error) {
      showApiError(error, { fallback: "Failed to delete Template Name" });
    }
  };

  const columns = getThemeColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="p-4">
   
      <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl  text-primary">Theme Name </h2>
                
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 bg-primary text-light text-sm font-semibold rounded-xl px-4 py-2.5 hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Add Template Name
              </button>
            </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Template..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-72 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
       
      </div>

      <TableComponent
        key={refreshKey}
        columns={columns}
        paginationSize={listPayload.size}
        defaultSorting={[]}
        toolbar={false}
        serverSide
        onFetchData={fetchThemes}
      />

      <AddThemeName
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editData}
        onSave={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default TemplateNameMaster;