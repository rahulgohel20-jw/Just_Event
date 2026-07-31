import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Circle } from "lucide-react";

import EventDetails from "./component/Eventdetails";
import ClientDetails from "./component/Clientdetails";
import FunctionDetails from "./component/Functiondetails";
import OtherInformation from "./component/Otherinformation";
import StepIndicator from "./component/StepIndicator";

const STEPS = [
  {
    key: "eventDetails",
    title: "Event Details",
    subtitle: "Configure the basic information for this event.",
    Component: EventDetails,
  },
  {
    key: "clientDetails",
    title: "Client Details",
    subtitle: "Keep your Event planning seamless from start to finish!",
    Component: ClientDetails,
  },
  {
    key: "functionDetails",
    title: "Function Details",
    subtitle: "Configure individual sessions for this event.",
    Component: FunctionDetails,
  },
  {
    key: "otherInformation",
    title: "Other Information",
    subtitle: "The final phase: Capturing every meticulous detail for a perfect execution.",
    Component: OtherInformation,
  },
];

export default function CreateEvent({ onSubmit }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    eventDetails: {},
    clientDetails: {},
    functionDetails: {},
    otherInformation: {},
  });
  const [draftSaved, setDraftSaved] = useState(false);

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const percentComplete = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const updateStepData = (patch) => {
    setFormData((prev) => ({
      ...prev,
      [step.key]: { ...prev[step.key], ...patch },
    }));
    setDraftSaved(false);
  };

  const handleSaveDraft = () => {
    // integrate with API service layer here
    console.log("Saving draft", formData);
    setDraftSaved(true);
  };

  const handleBack = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  const handleContinue = () => {
    if (isLast) {
      // integrate with API service layer here
      console.log("Submitting event", formData);
      onSubmit?.(formData);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const StepComponent = step.Component;

  return (
    <div className="min-h-screen ">
      <div className="w-full px-8 space-y-4">
        {/* Step indicator */}
       

        <div className="bg-white rounded-2xl shadow-sm p-6  w-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <p className="text-2xl font-bold text-primary">{step.title}</p>
            {/* <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 shrink-0">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              {draftSaved ? "DRAFT SAVED" : "UNSAVED CHANGES"}
            </span> */}
          </div>
          <p className="text-sm text-black mb-4">{step.subtitle}</p>
           <StepIndicator steps={STEPS} currentIndex={stepIndex} percentComplete={percentComplete} />

          {/* Step content */}
          <StepComponent
            data={formData[step.key]}
            onChange={updateStepData}
          />
        </div>

        {/* Footer nav */}
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirst}
            className={`flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2.5 border transition-colors ${
              isFirst
                ? "opacity-0 pointer-events-none"
                : "border-primary-clarity text-primary"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-sm font-medium rounded-xl px-4 py-2.5 border border-rose-200 text-rose-700 hover:bg-white transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-1.5 bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors"
            >
              {isLast ? "Finish" : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}