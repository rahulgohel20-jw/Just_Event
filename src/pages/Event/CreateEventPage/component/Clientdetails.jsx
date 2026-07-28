import React from "react";
import { Users } from "lucide-react";

const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr."];
const LEAD_SOURCES = ["Referral", "Website", "Social Media", "Walk-in", "Other"];

function emptyClient(clientType) {
  return {
    id: crypto.randomUUID(),
    title: "Mr.",
    name: "",
    mobile: "",
    address: "",
    highPriority: "No",
    leadSource: "Referral",
    clientType,
  };
}

export default function ClientDetails({ data, onChange }) {
  const addBrideGroom = !!data.addBrideGroom;
  const clients = data.clients?.length
    ? data.clients
    : [emptyClient("groom")];

  const toggleBrideGroom = () => {
    const next = !addBrideGroom;
    let nextClients = clients;
    if (next && clients.length < 2) {
      nextClients = [clients[0], emptyClient("bride")];
    }
    onChange({ addBrideGroom: next, clients: nextClients });
  };

  const updateClient = (id, field, value) => {
    onChange({
      clients: clients.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const visibleClients = addBrideGroom ? clients.slice(0, 2) : clients.slice(0, 1);

  return (
    <div className="space-y-6">
      {/* Bride & Groom toggle */}
      <div className="flex items-center justify-between bg-rose-50 border border-rose-100 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-rose-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-950">
              Add Bride &amp; Groom
            </p>
            <p className="text-xs text-rose-400">
              Enable for wedding event specifics
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={addBrideGroom}
          onClick={toggleBrideGroom}
          className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${
            addBrideGroom ? "bg-rose-900" : "bg-rose-200"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              addBrideGroom ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {visibleClients.map((client, i) => (
        <ClientCard
          key={client.id}
          index={i}
          client={client}
          showTypeToggle={addBrideGroom}
          onChange={(field, value) => updateClient(client.id, field, value)}
        />
      ))}
    </div>
  );
}

function ClientCard({ index, client, showTypeToggle, onChange }) {
  const isBride = client.clientType === "bride";
  const label = index === 0 ? "PRIMARY CONTACT" : "SECONDARY CONTACT";

  return (
    <div className="bg-white border border-rose-100 rounded-2xl p-5">
      {showTypeToggle && (
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            
          
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-950">
              {index + 1}. Client's Name
            </p>
            <p className="text-[11px] text-rose-400">{label}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
            {showTypeToggle ? "" : "1. Client's Name"}
          </label>
          <div className="flex gap-2">
            <select
              value={client.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-20 bg-white border border-rose-100 rounded-xl px-2 text-sm text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
            >
              {TITLES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Full legal name"
              value={client.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="flex-1 bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={client.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
            Address
          </label>
          <textarea
            placeholder="Street, Building, Suite, City, State, ZIP..."
            value={client.address}
            onChange={(e) => onChange("address", e.target.value)}
            rows={3}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200 resize-none"
          />
        </div>

        {showTypeToggle && (
          <div>
            <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
              Client Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("clientType", "groom")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors ${
                  !isBride
                    ? "bg-rose-900 text-white"
                    : "bg-white border border-rose-100 text-rose-700"
                }`}
              >
              </button>
              <button
                type="button"
                onClick={() => onChange("clientType", "bride")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors ${
                  isBride
                    ? "bg-rose-900 text-white"
                    : "bg-white border border-rose-100 text-rose-700"
                }`}
              >
                <Users className="w-4 h-4" /> Bride
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium text-rose-400 mb-1.5">
            High Priority:
          </p>
          <div className="flex items-center gap-5">
            {["Yes", "No"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-rose-800 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={client.highPriority === opt}
                  onChange={() => onChange("highPriority", opt)}
                  className="accent-rose-900 w-4 h-4"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
            Lead Source:
          </label>
          <select
            value={client.leadSource}
            onChange={(e) => onChange("leadSource", e.target.value)}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}