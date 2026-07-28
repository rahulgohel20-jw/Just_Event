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

export default function OtherInformation({ data, onChange }) {
  const [subStep, setSubStep] = useState(0);
  const current = SUB_PHASES[subStep];

  const updateSub = (key, patch) => {
    onChange({ [key]: { ...(data[key] || {}), ...patch } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold text-rose-800">
          Phase {String(subStep + 1).padStart(2, "0")} of{" "}
          {String(SUB_PHASES.length).padStart(2, "0")}
        </p>
        <p className="text-xs text-rose-400">
          {Math.round(((subStep + 1) / SUB_PHASES.length) * 100)}% Completed
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-rose-100 mb-6 overflow-hidden">
        <div
          className="h-full bg-rose-900 rounded-full transition-all"
          style={{ width: `${((subStep + 1) / SUB_PHASES.length) * 100}%` }}
        />
      </div>

      {current.key === "photographer" ? (
        <PhotographerDetails
          data={data.photographer || {}}
          onChange={(patch) => updateSub("photographer", patch)}
        />
      ) : (
        <PlaceholderSection label={current.label} />
      )}

      {/* Sub-phase navigation, separate from the main wizard's Back/Continue */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          disabled={subStep === 0}
          onClick={() => setSubStep((s) => Math.max(0, s - 1))}
          className={`text-sm font-medium rounded-xl px-4 py-2 border ${
            subStep === 0
              ? "border-rose-100 text-rose-200 cursor-not-allowed"
              : "border-rose-200 text-rose-700 hover:bg-rose-50"
          }`}
        >
          Previous Detail
        </button>
        <button
          type="button"
          disabled={subStep === SUB_PHASES.length - 1}
          onClick={() =>
            setSubStep((s) => Math.min(SUB_PHASES.length - 1, s + 1))
          }
          className={`text-sm font-medium rounded-xl px-4 py-2 ${
            subStep === SUB_PHASES.length - 1
              ? "bg-rose-100 text-rose-300 cursor-not-allowed"
              : "bg-rose-900 hover:bg-rose-950 text-white"
          }`}
        >
          Next Detail
        </button>
      </div>
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
    <div className="bg-white border border-rose-100 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-rose-950">
            Photographer's Details
          </h3>
          <p className="text-xs text-rose-400 mt-0.5">
            Identify the responsible parties for media coverage.
          </p>
        </div>
        <div className="flex bg-rose-50/60 border border-rose-100 rounded-xl p-1 shrink-0">
          {[
            { id: "groomBride", label: "Groom/Bride" },
            { id: "other", label: "Other/Reference" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ mode: opt.id })}
              className={`rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                mode === opt.id
                  ? "bg-rose-900 text-white"
                  : "text-rose-500 hover:text-rose-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "groomBride" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
          />
          <input
            type="tel"
            placeholder="Photographer's No."
            value={data.photographerNo || ""}
            onChange={(e) => onChange({ photographerNo: e.target.value })}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
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
        <Icon className="w-3.5 h-3.5 text-rose-700" />
        <p className="text-[11px] font-bold tracking-wide text-rose-800">
          {title}
        </p>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={person.name || ""}
          onChange={onFieldChange("name")}
          className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
        />
        <input
          type="text"
          placeholder="Father's Name"
          value={person.fatherName || ""}
          onChange={onFieldChange("fatherName")}
          className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Contact Number"
            value={person.contactNumber || ""}
            onChange={onFieldChange("contactNumber")}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
          />
          <input
            type="text"
            placeholder="Occupation"
            value={person.occupation || ""}
            onChange={onFieldChange("occupation")}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <input
          type="text"
          placeholder="Insta ID"
          value={person.instaId || ""}
          onChange={onFieldChange("instaId")}
          className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder:text-rose-300 outline-none focus:ring-2 focus:ring-rose-200"
        />
        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1.5">
            Birthdate
          </label>
          <input
            type="date"
            value={person.birthdate || ""}
            onChange={onFieldChange("birthdate")}
            className="w-full bg-white border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>
    </div>
  );
}

function PlaceholderSection({ label }) {
  return (
    <div className="bg-white border border-dashed border-rose-200 rounded-2xl p-10 text-center">
      <p className="text-sm font-semibold text-rose-900 mb-1">{label}</p>
      <p className="text-xs text-rose-400">
        Not built out yet — follow the PhotographerDetails pattern in this
        file to add its fields.
      </p>
    </div>
  );
}