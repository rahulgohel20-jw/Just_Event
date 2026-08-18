import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Circle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { useSearchParams , useNavigate   } from "react-router-dom";
import EventDetails from "./component/Eventdetails";
import ClientDetails from "./component/Clientdetails";
import FunctionDetails from "./component/Functiondetails";
import OtherInformation from "./component/Otherinformation";
import StepIndicator from "./component/StepIndicator";
import { useEventDraftStore } from "@/stores/useEventDraftStore";
import { buildEventPayload } from "./buildEventPayload";
import { addupadtevent } from "@/services/apiServices";
import { showApiResult, showApiError, getPrimaryColor } from "@/utils/swalHelpers";
import { useEventEditLoader } from "./useEventEditLoader"; // adjust path to wherever this hook actually lives

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

export default function CreateEvent({ onSubmit, existingId: existingIdProp = 0 }) {
   const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idFromParams = Number(searchParams.get("id")) || 0;
  const existingId = existingIdProp || idFromParams;

  const { formData: loadedFormData, loading: loadingEvent, error: loadError } =
    useEventEditLoader(existingId > 0 ? existingId : null);

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    eventDetails: {},
    clientDetails: {},
    functionDetails: {},
    otherInformation: {},
  });
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const draftStore = useEventDraftStore();

  // Once the edit-loader hook finishes fetching, hydrate the local formData
  useEffect(() => {
    if (loadedFormData) {
      setFormData(loadedFormData);
    }
  }, [loadedFormData]);

   useEffect(() => {
    if (existingId > 0) return;
    const prefillDate = draftStore.eventDate;
    if (!prefillDate) return;

    setFormData((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        eventStartDate: prev.eventDetails.eventStartDate || prefillDate,
        eventEndDate: prev.eventDetails.eventEndDate || prefillDate,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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

  // Returns a list of missing-field labels for the current step, or [] if valid.
  const getMissingFields = () => {
    const missing = [];

    if (step.key === "eventDetails") {
      const ed = formData.eventDetails || {};

      if (!draftStore.eventType?.value) missing.push("Event Type");
      if (!ed.eventStatus) missing.push("Event Status");
      if (!ed.eventStartDate) missing.push("Event Start Date");
      if (!ed.eventStartTime) missing.push("Event Start Time");
      if (!ed.eventEndDate) missing.push("Event End Date");
      if (!ed.eventEndTime) missing.push("Event End Time");
      if (!draftStore.venue?.value) missing.push("Venue");
    }

    if (step.key === "clientDetails") {
      const cd = formData.clientDetails || {};
      const clients = cd.clients?.length ? cd.clients : [];
      const addBrideGroom = !!cd.addBrideGroom;
      const visibleClients = addBrideGroom ? clients.slice(0, 2) : clients.slice(0, 1);

      visibleClients.forEach((client, i) => {
        if (!client.name?.trim()) {
          missing.push(
            visibleClients.length > 1
              ? `Client ${i + 1} Name`
              : "Client's Name"
          );
        }
      });
    }

    if (step.key === "functionDetails") {
      const fd = formData.functionDetails || {};
      const functions = fd.functions || [];

      if (functions.length === 0) {
        missing.push("At least one Function");
      }

      functions.forEach((fn) => {
        if (!fn.functionTypeId) missing.push("Function Type");
        if (!fn.date) missing.push("Date");
        if (!fn.time) missing.push("Time");
        if (!fn.venue?.value) missing.push("Venue");
      });
    }

    return missing;
  };

  const showMissingFieldsAlert = (missing) => {
    Swal.fire({
      icon: "warning",
      title: "Missing Required Fields",
      html: `Please fill in the following before continuing:<br/><b>${missing.join(", ")}</b>`,
      confirmButtonColor: getPrimaryColor(),
    });
  };

  const handleSaveDraft = async () => {
  const payload = buildEventPayload({ formData, draftStore, existingId });
  try {
    const res = await addupadtevent(payload);
    showApiResult(res, {
      successTitle: "Draft Saved",
      errorTitle: "Failed to Save Draft",
      onSuccess: () => setDraftSaved(true),
    });
  } catch (err) {
    showApiError(err, { title: "Failed to Save Draft" });
  }
};

 const handleBack = () => {
  if (isFirst) {
    navigate(existingId > 0 ? `/creteevnetname?id=${existingId}` : "/creteevnetname");
  } else {
    setStepIndex((i) => i - 1);
  }
};

  const handleContinue = async () => {
  const missing = getMissingFields();
  if (missing.length > 0) {
    showMissingFieldsAlert(missing);
    return;
  }

  if (isLast) {
    const payload = buildEventPayload({ formData, draftStore, existingId });
    setSubmitting(true);
    try {
      const res = await addupadtevent(payload);
      showApiResult(res, {
        successTitle: "Event Submitted",
        errorTitle: "Failed to Submit Event",
        onSuccess: () => {
          draftStore.resetDraft?.();
          onSubmit?.(res.data);
          navigate("/calendar");
        },
      });
    } catch (err) {
      showApiError(err, { title: "Failed to Submit Event" });
    } finally {
      setSubmitting(false);
    }
  } else {
    setStepIndex((i) => i + 1);
  }
};

  const StepComponent = step.Component;

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full px-8 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm px-4 py-0 w-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <p className="text-3xl font-bold text-primary my-2">{step.title}</p>
          </div>
          <p className="text-sm text-black mb-10">{step.subtitle}</p>
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
  onClick={handleBack}
  className="flex items-center gap-1.5 text-sm font-medium rounded-xl px-4 py-2.5 border transition-colors border-primary-clarity text-primary"
>
  <ArrowLeft className="w-4 h-4" /> Back
</button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="flex items-center gap-1.5 bg-primary hover:bg-rose-950 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors disabled:opacity-60"
            >
              {isLast ? (submitting ? "Submitting..." : "Finish") : "Continue"}{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}