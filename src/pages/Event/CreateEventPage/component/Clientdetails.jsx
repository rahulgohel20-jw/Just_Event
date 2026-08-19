import React, { useState } from "react";
import { UserPlus, Users, Plus } from "lucide-react";
import { getAllClientMaster } from "@/services/apiServices";
import PaginatedSearchSelect from "../../../../components/form-inputs/select/PaginatedSearchSelect";
import { AddClientModal } from "../../../../partials/modals/AddClientModal/AddClientModal"; // adjust path to your actual location

const TITLES = ["Mr.", "Mrs."];
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
    clientMasterId: null,
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
 
  
  const [extraClients, setExtraClients] = useState([]);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addClientTargetId, setAddClientTargetId] = useState(null);

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

  const updateClientFields = (id, patch) => {
    onChange({
      clients: clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const openAddClient = (clientId) => {
    setAddClientTargetId(clientId);
    setAddClientOpen(true);
  };

  const handleClientCreated = (created) => {
    if (!created) return;
    const option = {
      value: created.id,
      label: created.nameEnglish,
      mobileNo: created.mobileNo,
      address: created.address,
    };
    setExtraClients((prev) => [option, ...prev]);

    if (addClientTargetId) {
      updateClientFields(addClientTargetId, {
        clientMasterId: option.value,
        name: option.label,
        mobile: option.mobileNo || "",
        address: option.address || "",
      });
    }
    setAddClientOpen(false);
    setAddClientTargetId(null);
  };

  const visibleClients = addBrideGroom
    ? clients.slice(0, 2)
    : clients.slice(0, 1);

  return (
    <div className="space-y-6">
      {visibleClients.map((client, i) => (
        <ClientCard
          key={client.id}
          index={i}
          client={client}
          showTypeToggle={addBrideGroom}
          extraClients={extraClients}
          onChange={(field, value) => updateClient(client.id, field, value)}
          onSelectClient={(patch) => updateClientFields(client.id, patch)}
          onAddNew={() => openAddClient(client.id)}
        />
      ))}

      <AddClientModal
        open={addClientOpen}
        onClose={() => {
          setAddClientOpen(false);
          setAddClientTargetId(null);
        }}
        onSave={handleClientCreated}
      />
    </div>
  );
}

function ClientCard({
  index,
  client,
  showTypeToggle,
  extraClients,
  onChange,
  onSelectClient,
  onAddNew,
}) {
    const userId = Number(localStorage.getItem("userId"));

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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[13px] font-medium text-dark-light">
              1. Client's Name<span className="text-danger ml-0.5">*</span>
            </label>
            <button
              type="button"
              onClick={onAddNew}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus size={14} /> Add New
            </button>
          </div>
          <div className="flex gap-3 w-full items-center">
            <p className="bg-light w-40 h-10 border border-primary-clarity rounded-lg px-4 m-auto flex items-center  text-sm text-dark ">
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
            <div className="flex-1">
              <PaginatedSearchSelect
  fetchFn={getAllClientMaster}
  extraParams={{ sortBy: "id", sortDirection: "DESC", userId ,categoryId: null , categoryTypeId:1 }}
  labelKey="nameEnglish"
  valueKey="id"
  searchParamName="nameEnglish"
  sizeParamName="size"
  mapOption={(r) => ({
    value: r.id,
    label: r.nameEnglish,
    mobileNo: r.mobileNo,
    address: r.address,
  })}
 initialOption={
  client.clientMasterId
    ? {
        value: Number(client.clientMasterId),
        label: client.name,
        mobileNo: client.mobile,
        address: client.address,
      }
    : undefined
}
  extraOptions={extraClients}
  value={client.clientMasterId != null ? Number(client.clientMasterId) : undefined}
  onChange={() => {}}
  onSelectOption={(opt) =>
    onSelectClient({
      clientMasterId: opt?.value ?? null,
      name: opt?.label || "",
      mobile: opt?.mobileNo || "",
      address: opt?.address || "",
    })
  }
  placeholder="Search full legal name..."
  size="large"
  className="h-14-select"
/>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-dark-light mb-1.5">
            Mobile Number
          </label>
          <input
            type="tel"
            value={client.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            className="flex-1 bg-light w-full border border-primary-clarity rounded-lg px-2 py-2 text-sm text-dark placeholder:text-dark-light outline-none focus:ring-2 focus:ring-primary-clarity"
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
      </div>
    </div>
  );
}