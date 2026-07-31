import React, { useState } from "react";
import {  User2} from "lucide-react";

// Each entry is a self-contained sub-phase of "Other Information".
// Only "Photographer's Details" is fully built out below — the rest are
// scaffolded the same way so they're quick to fill in later.
const SUB_PHASES = [
  { key: "photographer", label: "Photographer's Details" },
  { key: "caterer", label: "Caterer Details" },
  { key: "decorator", label: "Decorator Details" },
  { key: "makeup", label: "Makeup Artist Details" },
  { key: "entertainment", label: "DJ / Entertainment Details" },
  { key: "misc", label: "Miscellaneous Vendors" },
];
function FloatField({
  label,
  placeholder,
  className = "",
  ...props
}) {
  const title = label || placeholder;

  return (
    <div className="relative mt-6">
      {title && (
        <label className="absolute -top-3 left-3 bg-light px-1 text-[13px] font-medium text-dark z-5">
          {title}
        </label>
      )}

      <input
        {...props}
        placeholder={props.type === "date" ? undefined : placeholder}
        className={`w-full h-12 bg-light border placeholder:text-dark-clarity border-primary-lighter rounded-xl px-4 text-sm text-dark outline-none focus:border-primary-lighter focus:ring-0 ${className}`}
      />
    </div>
  );
}


export default function OtherInformation({ data, onChange }) {
  const [subStep, setSubStep] = useState(0);
  const current = SUB_PHASES[subStep];

  const updateSub = (key, patch) => {
    onChange({ [key]: { ...(data[key] || {}), ...patch } });
  };

  return (
    <div>

      {current.key === "photographer" ? (
        <PhotographerDetails
          data={data.photographer || {}}
          onChange={(patch) => updateSub("photographer", patch)}
        />
      ) : (
        <PlaceholderSection label={current.label} />
      )}
    </div>
  );
}

function PhotographerDetails({ data, onChange }) {
  const mode = data.mode || "groomBride"; // "groomBride" | "other"

 const setField = (person) => (field) => (e) =>
  onChange({
    [person]: { ...(data[person] || {}), [field]: e.target.value },
  });
  return (
    <div className="bg-light border border-primary-clarity rounded-2xl p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-medium text-dark m-0">
            Photographer's Details
          </h3>
          <p className="text-xs text-dark font-medium mt-0.5">
            Identify the responsible parties for media coverage.
          </p>
        </div>
        <div className="flex bg-primary-inverse border border-primary-clarity rounded-full p-1 shrink-0">
          {[
            { id: "groomBride", label: "Groom/Bride" },
            { id: "other", label: "Other/Reference" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ mode: opt.id })}
              className={`rounded-full px-6 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                mode === opt.id
                  ? "bg-primary text-light"
                  : "text-dark"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "groomBride" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <PersonColumn
            icon={User2}
            title="GROOM'S INFORMATION"
            person={data.groom || {}}
            onFieldChange={setField("groom")}
          />
          <PersonColumn
            icon={User2}
            title="BRIDE'S INFORMATION"
            person={data.bride || {}}
            onFieldChange={setField("bride")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Photographer's Name"
            value={data.photographerName || ""}
            onChange={(e) => onChange({ photographerName: e.target.value })}
            className="w-full bg-light border border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity"
          />
          <input
            type="tel"
            placeholder="Photographer's No."
            value={data.photographerNo || ""}
            onChange={(e) => onChange({ photographerNo: e.target.value })}
            className="w-full bg-light border border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity"
          />
        </div>
      )}
    </div>
  );
}

function PersonColumn({ icon: Icon, title, person, onFieldChange }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <Icon className="w-3.5 h-3.5 text-dark" />
        <p className="text-[11px] font-bold tracking-wide text-dark my-auto">
          {title}
        </p>
      </div>
      <div className="space-y-3 mb-3">
        <input
          type="text"
          placeholder="Name"
          value={person.name || ""}
          onChange={onFieldChange("name")}
          className="w-full bg-light border-2 border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity mb-3"
        />
        <input
          type="text"
          placeholder="Father's Name"
          value={person.fatherName || ""}
          onChange={onFieldChange("fatherName")}
          className="w-full bg-light border-2 border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity mb-3"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Contact Number"
            value={person.contactNumber || ""}
            onChange={onFieldChange("contactNumber")}
            className="w-full bg-light border-2 mt-4 border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity mb-3"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={person.occupation || ""}
            onChange={onFieldChange("occupation")}
            className="w-full bg-light border-2 mt-4 border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity mb-3"
          />
        </div>
        <input
          type="text"
          placeholder="Insta ID"
          value={person.instaId || ""}
          onChange={onFieldChange("instaId")}
          className="w-full bg-light border-2 border-primary-clarity rounded-xl px-4 py-3 text-sm text-dark placeholder:text-dark outline-none focus:ring-2 focus:ring-primary-clarity mb-3"
        />
        <div>
           <FloatField
            label="Birthdate"
            type="date"
             value={person.birthdate || ""}
            onChange={onFieldChange("birthdate")}
          />
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ label }) {
  return (
    <div className="bg-light border border-dashed border-primary-clarity rounded-2xl p-10 text-center">
      <p className="text-sm font-semibold text-primary mb-1">{label}</p>
      <p className="text-xs text-primary-dark">
        Not built out yet — follow the PhotographerDetails pattern in this
        file to add its fields.
      </p>
    </div>
  );
}