import React, { useEffect, useState } from "react";
import { Select } from "antd";
import {
  Search,
  MessageSquare,
  MapPin,
  Trash2,
  CirclePlus,
  Plus,
} from "lucide-react";
import { getallvenuemmmaster, getalllistfuntionmaster } from "@/services/apiServices";
import PaginatedSearchSelect from "../../../../components/form-inputs/select/PaginatedSearchSelect";
import DateField from "../../../../components/form-inputs/DatePicker/Datefield";
import TimeInput12h from "../../../../components/form-inputs/Time/Timeinput12h";
import { useEventDraftStore } from "@/stores/useEventDraftStore";
import AddNotesModal from "../../../../components/Notes/AddNotesModal";
import { AddFunctionModal } from "../../../../partials/modals/AddFunctionModal/AddFunctionModal"; // adjust path to your actual location

function emptyFunctionRow(venue = null) {
  return {
    id: crypto.randomUUID(),
    type: "", // display label
    functionTypeId: null,
    date: "",
    time: "",
    venue, // { value, label, subVenues }
    subVenues: [], // array of selected sub-venue values
    notesEnglish: "",
    notesGujarati: "",
    notesHindi: "",
  };
}

// Normalizes a raw subVenue entry (object or string) into a {value,label} option
function mapSubVenue(sv) {
  if (sv && typeof sv === "object") {
    return {
      value: sv.id ?? sv.value ?? sv.nameEnglish,
      label: sv.nameEnglish ?? sv.name ?? sv.label ?? String(sv.id),
    };
  }
  return { value: sv, label: sv };
}

export default function FunctionDetails({ data, onChange }) {
  const { venue } = useEventDraftStore();
  const functions = data.functions || [];
  const [query, setQuery] = useState("");
  const [notesRowId, setNotesRowId] = useState(null); // which row's notes modal is open

  // Newly-created function types pushed here so PaginatedSearchSelect shows
  // them immediately, without a refetch.
  const [extraFunctionTypes, setExtraFunctionTypes] = useState([]);
  const [addFunctionOpen, setAddFunctionOpen] = useState(false);
  // which row's "+" was clicked, so we know which row to auto-select on save
  const [addFunctionTargetId, setAddFunctionTargetId] = useState(null);

  // Seed one row with the event-level venue as soon as it's picked in Event Details,
  // but only while the list is still empty (won't override rows the user already added/edited).
  useEffect(() => {
    if (venue && functions.length === 0) {
      onChange({ functions: [emptyFunctionRow(venue)] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue]);

  const update = (id, field, value) => {
    onChange({
      functions: functions.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    });
  };

  const updateFields = (id, patch) => {
    onChange({
      functions: functions.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  };

  const removeRow = (id) => {
    onChange({ functions: functions.filter((f) => f.id !== id) });
  };

  const addRow = () => {
    onChange({ functions: [...functions, emptyFunctionRow(venue)] });
  };

  const openAddFunction = (rowId) => {
    setAddFunctionTargetId(rowId);
    setAddFunctionOpen(true);
  };

  const handleFunctionCreated = (created) => {
    if (!created) return;
    const option = {
      value: created.id,
      label: created.nameEnglish,
      timeFrom: created.timeFrom,
    };
    setExtraFunctionTypes((prev) => [option, ...prev]);

    if (addFunctionTargetId) {
      updateFields(addFunctionTargetId, {
        functionTypeId: option.value,
        type: option.label,
        time: option.timeFrom || undefined,
      });
    }
    setAddFunctionOpen(false);
    setAddFunctionTargetId(null);
  };

  const filtered = functions.filter((f) =>
    (f.type || "").toLowerCase().includes(query.toLowerCase())
  );

  const notesRow = functions.find((f) => f.id === notesRowId) || null;

  const handleNotesSave = (notes) => {
    if (!notesRowId) return;
    updateFields(notesRowId, {
      notesEnglish: notes.english || "",
      notesGujarati: notes.gujarati || "",
      notesHindi: notes.hindi || "",
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-dark-light absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search functions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-light border border-primary-clarity rounded-xl pl-9 pr-4 py-2.5 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-inverse"
          />
        </div>
        <button
          type="button"
          onClick={addRow}
          className="ml-auto flex items-center gap-1.5 bg-primary  text-light text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
        >
          <CirclePlus className="w-4 h-4" /> Add Function
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate  border-spacing-y-3">
          <thead>
            <tr className="text-left text-sm font-bold uppercase text-dark">
              <th className="px-6 py-2">
             <div className="flex items-center gap-1.5">
    <span>
      Function Type<span className="text-danger ml-0.5">*</span>
    </span>
    <button
      type="button"
      onClick={() => openAddFunction(null)}
      title="Add new function type"
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-light hover:opacity-90"
    >
      <Plus size={12} />
    </button>
  </div>
              </th>
              <th className="px-4 py-2">
                Date<span className="text-danger ml-0.5">*</span>
              </th>
              <th className="px-4 py-2">
                Time<span className="text-danger ml-0.5">*</span>
              </th>
              <th className="px-4 py-2">
                Venue<span className="text-danger ml-0.5">*</span>
              </th>
              <th className="px-4 py-2">Sub Venue</th>
              <th className="px-6 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const subVenueOptions = (f.venue?.subVenues || []).map(mapSubVenue);
              const hasNotes = !!(f.notesEnglish || f.notesGujarati || f.notesHindi);

              return (
                <tr
                  key={f.id}
                  className="text-sm rounded-2xl"
                >
                  <td className="border-y-2 border-l-2 border-primary-inverse rounded-l-2xl px-6 py-4 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <PaginatedSearchSelect
                          fetchFn={getalllistfuntionmaster}
                          extraParams={{ sortBy: "id", sortDirection: "DESC" }}
                          labelKey="nameEnglish"
                          valueKey="id"
                          searchParamName="nameEnglish"
                          sizeParamName="size"
                          mapOption={(r) => ({
                            value: r.id,
                            label: r.nameEnglish,
                            timeFrom: r.timeFrom,
                          })}
                          initialOption={
                            f.functionTypeId
                              ? { value: f.functionTypeId, label: f.type }
                              : undefined
                          }
                          extraOptions={extraFunctionTypes}
                          value={f.functionTypeId || undefined}
                          onChange={() => {}}
                          onSelectOption={(opt) =>
                            updateFields(f.id, {
                              functionTypeId: opt?.value ?? null,
                              type: opt?.label || "",
                              time: opt?.timeFrom || f.time,
                            })
                          }
                          placeholder="Select function type..."
                          size="large"
                        />
                      </div>
                     
                    </div>
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse min-w-[160px]">
                    <DateField
                      value={f.date || ""}
                      onChange={(e) =>
                        update(f.id, "date", e?.target ? e.target.value : e)
                      }
                    />
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse min-w-[140px]">
                    <TimeInput12h
                      value={f.time || ""}
                      onChange={(val) => update(f.id, "time", val)}
                    />
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse min-w-[200px]">
                    <PaginatedSearchSelect
                      fetchFn={getallvenuemmmaster}
                      extraParams={{ sortBy: "id", sortDirection: "DESC" }}
                      labelKey="nameEnglish"
                      valueKey="id"
                      searchParamName="search"
                      sizeParamName="size"
                      mapOption={(r) => ({
                        value: r.id,
                        label: r.nameEnglish,
                        subVenues: r.subVenues || [],
                      })}
                      initialOption={f.venue || undefined}
                      value={f.venue?.value}
                      onChange={() => {}}
                      onSelectOption={(opt) =>
                        updateFields(f.id, {
                          venue: opt || null,
                          subVenues: [], // reset sub venue selection when venue changes
                        })
                      }
                      placeholder="Search venue..."
                      size="large"
                    />
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse min-w-[200px]">
                    <Select
                      mode="multiple"
                      allowClear
                      value={f.subVenues || []}
                      onChange={(vals) => update(f.id, "subVenues", vals)}
                      options={subVenueOptions}
                      placeholder={
                        f.venue ? "Select sub venue(s)..." : "Select a venue first"
                      }
                      disabled={!f.venue || subVenueOptions.length === 0}
                      className="w-full"
                      size="large"
                    />
                  </td>

                  <td className="px-6 py-4 rounded-r-2xl border-y-2 border-r-2 border-primary-inverse">
                    <div className="flex justify-center items-center gap-4 text-dark">
                      <button
                        type="button"
                        onClick={() => setNotesRowId(f.id)}
                        title={hasNotes ? "Edit notes" : "Add notes"}
                      >
                        <MessageSquare
                          className={`w-5 h-5 hover:text-primary ${
                            hasNotes ? "text-primary fill-primary/10" : ""
                          }`}
                        />
                      </button>

                      <button>
                        <MapPin className="w-5 h-5 hover:text-primary" />
                      </button>

                      <button onClick={() => removeRow(f.id)}>
                        <Trash2 className="w-5 h-5 hover:text-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddNotesModal
        open={!!notesRowId}
        onClose={() => setNotesRowId(null)}
        onSave={handleNotesSave}
        initialValue={
          notesRow
            ? {
                english: notesRow.notesEnglish || "",
                hindi: notesRow.notesHindi || "",
                gujarati: notesRow.notesGujarati || "",
              }
            : undefined
        }
      />

      <AddFunctionModal
        open={addFunctionOpen}
        onClose={() => {
          setAddFunctionOpen(false);
          setAddFunctionTargetId(null);
        }}
        onSave={handleFunctionCreated}
      />
    </div>
  );
}