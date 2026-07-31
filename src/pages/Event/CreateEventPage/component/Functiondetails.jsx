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
  CirclePlus,
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
              <th className="px-6 py-2">Function Type</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">Sub Venue</th>
              <th className="px-6 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((f) => {
              const Icon = ICONS[f.type] || Sparkles;

              return (
                <tr
                  key={f.id}
                  className="text-sm rounded-2xl"
                >
                  <td className="border-y-2 border-l-2 border-primary-inverse rounded-l-2xl px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary-inverse flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>

                      <span className="font-bold text-sm text-dark">
                        {f.type}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse">
                    <input
                      type="date"
                      value={f.date}
                      onChange={(e) => update(f.id, "date", e.target.value)}
                      className="w-full bg-primary-lighest rounded p-1 outline-none text-primary"
                    />
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse">
                    <input
                      type="time"
                      value={f.time}
                      onChange={(e) => update(f.id, "time", e.target.value)}
                      className="w-full bg-primary-lighest rounded p-1  outline-none text-primary"
                    />
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse">
                    <p className="w-full bg-primary-lighest rounded  m-auto px-3">
                      <select
                        value={f.venue}
                        onChange={(e) => update(f.id, "venue", e.target.value)}
                        className="outline-none bg-primary-lighest  text-primary w-full py-1.5"
                      >
                        {VENUES.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </p>
                  </td>

                  <td className="px-4 py-4 border-y-2 border-primary-inverse">
                    <p className="w-full bg-primary-lighest rounded  m-auto px-3">
                      <select
                        value={f.subVenue}
                        onChange={(e) => update(f.id, "subVenue", e.target.value)}
                        className="outline-none bg-primary-lighest  text-primary w-full py-1.5"
                      >
                        {SUB_VENUES.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </p>
                  </td>

                  <td className="px-6 py-4 rounded-r-2xl border-y-2 border-r-2 border-primary-inverse">
                    <div className="flex justify-center items-center gap-4 text-dark">
                      <button>
                        <MessageSquare className="w-5 h-5 hover:text-primary" />
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
    </div>
  );
}