// component/StepIndicator.jsx
import { Check } from "lucide-react";

export default function StepIndicator({ steps, currentIndex, percentComplete }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-6 py-4 w-full">
      {/* Step circles + connecting lines */}
      <div className="flex items-center flex-1">
        {steps.map((s, i) => {
          const isActive    = i === currentIndex;
          const isCompleted = i < currentIndex;
          const isLast      = i === steps.length - 1;

          return (
            <div key={s.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isActive
                      ? "bg-rose-900 text-white"
                      : isCompleted
                      ? "bg-rose-900 text-white"
                      : "bg-rose-50 text-rose-300"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    isActive ? "text-rose-950" : isCompleted ? "text-rose-800" : "text-rose-300"
                  }`}
                >
                  {s.title}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`h-px flex-1 mx-3 ${
                    isCompleted ? "bg-rose-300" : "bg-rose-100"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Divider + Step Progress */}
      <div className="flex items-center gap-4 pl-6 ml-6 border-l border-rose-100 shrink-0">
        <div className="min-w-[110px]">
          <p className="text-[11px] font-bold text-gray-700 tracking-wide mb-1.5">
            STEP PROGRESS
          </p>
          <div className="h-1 rounded-full bg-rose-100 overflow-hidden">
            <div
              className="h-full bg-rose-900 rounded-full transition-all"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}