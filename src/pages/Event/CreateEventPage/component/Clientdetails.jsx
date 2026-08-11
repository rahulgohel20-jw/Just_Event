import React from "react";
import { UserPlus, Users } from "lucide-react";

const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr."];
const LEAD_SOURCES = [
  "Referral",
  "Website",
  "Social Media",
  "Walk-in",
  "Other",
];

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
  const clients = data.clients?.length ? data.clients : [emptyClient("groom")];

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
      clients: clients.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  const visibleClients = addBrideGroom
    ? clients.slice(0, 2)
    : clients.slice(0, 1);

  return (
    <div className="space-y-6">
      {/* Bride & Groom toggle */}
      <div className="flex items-center justify-between bg-primary-inverse rounded-xl p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-dark">
              Add Bride &amp; Groom
            </h5>
            <h4 className="text-sm text-primary font-bold">
              Enable for wedding event specifics
            </h4>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={addBrideGroom}
          onClick={toggleBrideGroom}
          className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${
            addBrideGroom ? "bg-primary" : "bg-primary-clarity"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              addBrideGroom ? "translate-x-5" : "translate-x-0"
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
  const label = showTypeToggle
    ? index == 0
      ? "PRIMARY CONTACT"
      : "SECONDARY CONTACT"
    : "";

  return (
    <div className="bg-light border border-primary-clarity rounded-2xl p-5">
      {showTypeToggle && (
        <div className="flex items-center gap-5 mb-5">
          <div className="w-10 h-10 rounded-lg bg-primary-clarity flex items-center justify-center shrink-0 text-primary">
            <UserPlus />
          </div>
          <div>
            <h6 className="m-0 text-lg font-semibold text-dark">
              {index + 1}. Client's Name
            </h6>
            <p className="m-0 text-[12px] text-primary font-semibold">
              {label}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-[13px] font-medium text-dark-light mb-1.5">
            1. Client's Name
          </label>
          <div className="flex gap-3 w-full items-center">
            <p className="bg-light w-40 border border-primary-clarity rounded-lg px-4 py-3 m-auto flex items-center  text-sm text-dark ">
              <select
                value={client.title}
                onChange={(e) => onChange("title", e.target.value)}
                className="outline-none w-full"
              >
                {TITLES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </p>
            <input
              type="text"
              placeholder="Full legal name"
              value={client.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="flex-1 bg-light border border-primary-clarity rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-clarity"
            />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-dark-light mb-1.5">
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={client.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            className="flex-1 bg-light w-full border border-primary-clarity rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-clarity"
          />
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${showTypeToggle ? "grid-cols-1" : ""} sm:grid-cols-2 gap-4 mb-4`}
      >
        <div>
          <label className="block text-[13px] font-medium text-dark-light mb-1.5">
            Address
          </label>
          <textarea
            placeholder="Street, Building, Suite, City, State, ZIP..."
            value={client.address}
            onChange={(e) => onChange("address", e.target.value)}
            rows={3}
            className="flex-1 bg-light w-full border border-primary-clarity rounded-lg px-4 py-3 text-sm text-dark placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-clarity resize-none"
          />
        </div>

        {showTypeToggle && (
          <div>
            <label className="block text-[13px] font-medium text-dark-light mb-1.5">
              Client Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("clientType", "groom")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors ${
                  !isBride
                    ? "bg-primary text-light"
                    : "bg-light border border-primary-clarity text-primary"
                }`}
              >
                <Users className="w-4 h-4" />
                Groom
              </button>
              <button
                type="button"
                onClick={() => onChange("clientType", "bride")}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-medium transition-colors ${
                  isBride
                    ? "bg-primary text-light"
                    : "bg-light border border-primary-clarity text-primary"
                }`}
              >
                <Users className="w-4 h-4" /> Bride
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {showTypeToggle && (
          <div>
            <p className="text-[13px] font-medium text-dark-light mb-1.5">
              High Priority:
            </p>
            <div className="flex items-center gap-5">
              {["Yes", "No"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-primary cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={client.highPriority === opt}
                    onChange={() => onChange("highPriority", opt)}
                    className="accent-primary w-4 h-4"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-[13px] font-medium text-dark-light mb-1.5">
            Lead Source:
          </label>
          <p className="bg-light border border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark">
            <select
              value={client.leadSource}
              onChange={(e) => onChange("leadSource", e.target.value)}
              className="w-full outline-none"
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </p>
        </div>
      </div>
    </div>
  );
}
