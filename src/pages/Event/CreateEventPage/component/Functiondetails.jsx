import React, { useState } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  MapPin,
  Trash2,
  Heart,
  Waves,
  Music,
  Baby,
  PartyPopper,
  Cake,
  Sparkles,
} from "lucide-react";

const ICONS = {
  Wedding: Heart,
  "Pool Party": Waves,
  Sangeet: Music,
  "Baby Shower": Baby,
  "Farewell Party": PartyPopper,
  Birthday: Cake,
  Other: Sparkles,
};

const VENUES = ["Ahmedabad", "Mumbai", "Delhi", "Jaipur"];
const SUB_VENUES = ["Grand Ballroom", "Lawn A", "Lawn B", "Terrace"];

function defaultFunctions() {
  return [
    "Wedding",
    "Pool Party",
    "Sangeet",
    "Baby Shower",
    "Farewell Party",
    "Birthday",
  ].map((type) => ({
    id: crypto.randomUUID(),
    type,
    date: "2024-06-15",
    time: "18:00",
    venue: "Ahmedabad",
    subVenue: "Grand Ballroom",
  }));
}

export default function FunctionDetails({ data, onChange }) {
  const functions = data.functions?.length ? data.functions : defaultFunctions();
  const [query, setQuery] = useState("");

  const update = (id, field, value) => {
    onChange({
      functions: functions.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    });
  };

  const removeRow = (id) => {
    onChange({ functions: functions.filter((f) => f.id !== id) });
  };

  const addRow = () => {
    onChange({
      functions: [
        ...functions,
        {
          id: crypto.randomUUID(),
          type: "Other",
          date: "",
          time: "",
          venue: VENUES[0],
          subVenue: SUB_VENUES[0],
        },
      ],
    });
  };

  const filtered = functions.filter((f) =>
    f.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search functions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-rose-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <button
          type="button"
          onClick={addRow}
          className="ml-auto flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Function
        </button>
      </div>

      <div className="border border-rose-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rose-50/60 text-[11px] font-semibold tracking-wide text-rose-400 text-left">
              <th className="px-4 py-3">FUNCTION TYPE</th>
              <th className="px-4 py-3">DATE</th>
              <th className="px-4 py-3">TIME</th>
              <th className="px-4 py-3">VENUE</th>
              <th className="px-4 py-3">SUB VENUE</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const Icon = ICONS[f.type] || Sparkles;
              return (
                <tr key={f.id} className="border-t border-rose-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-rose-900">
                      <Icon className="w-4 h-4 text-rose-700" />
                      {f.type}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={f.date}
                      onChange={(e) => update(f.id, "date", e.target.value)}
                      className="bg-transparent text-rose-700 outline-none w-32"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="time"
                      value={f.time}
                      onChange={(e) => update(f.id, "time", e.target.value)}
                      className="bg-transparent text-rose-700 outline-none w-24"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={f.venue}
                      onChange={(e) => update(f.id, "venue", e.target.value)}
                      className="bg-transparent text-rose-900 outline-none"
                    >
                      {VENUES.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={f.subVenue}
                      onChange={(e) =>
                        update(f.id, "subVenue", e.target.value)
                      }
                      className="bg-transparent text-rose-900 outline-none"
                    >
                      {SUB_VENUES.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-rose-300">
                      <button type="button" className="hover:text-rose-600">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button type="button" className="hover:text-rose-600">
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRow(f.id)}
                        className="hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-rose-300"
                >
                  No functions match "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}