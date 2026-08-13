import { useEffect, useState } from "react";
import { useEventDraftStore } from "@/stores/useEventDraftStore";
import { getbyeventid } from "@/services/apiServices";

const STATUS_MAP_REVERSE = { INQUIRY: "Inquiry", TENTATIVE: "Tentative", CONFIRMED: "Confirmed" };
const PRIORITY_MAP_REVERSE = { HIGH: "High", MED: "Med", LOW: "Low" };

// Turns one API `eventFunctions[]` entry back into a FunctionDetails row.
function mapEventFunctionToRow(ef) {
  const primaryVenue = ef.venues?.[0] || null;

  return {
    id: crypto.randomUUID(),
    functionRecordId: ef.id ?? null, // this row's own record id (for update payloads)
    type: ef.nameEnglish || "",
    functionTypeId: ef.functionId ?? null,
    date: ef.functionDate || "",
    time: ef.functionTime || "",
    venueRecordId: primaryVenue?.id ?? null, // the venue-link row id, for update payloads
    venue: primaryVenue
      ? {
          value: primaryVenue.venueId,
          label: primaryVenue.venueNameEnglish || "",
          subVenues: (primaryVenue.subVenues || []).map((sv) => ({
            id: sv.subVenueId,
            nameEnglish: sv.subVenueNameEnglish,
          })),
        }
      : null,
    subVenues: (primaryVenue?.subVenues || []).map((sv) => sv.subVenueId),
    notesEnglish: ef.notesEnglish || "",
    notesGujarati: ef.notesGujarati || "",
    notesHindi: ef.notesHindi || "",
  };
}

// Turns an API event record back into the { eventDetails, clientDetails,
// functionDetails, otherInformation } shape the multi-step form uses,
// and returns the pieces that belong in useEventDraftStore separately.
export function mapEventToFormData(event) {
  const otherInfo = event.otherInfo || {};

  const formData = {
    eventDetails: {
      inquiryDate: event.inquiryDate || "",
      eventStatus: STATUS_MAP_REVERSE[event.eventStatus] || "Inquiry",
      eventStartDate: event.eventStartDate || "",
      eventStartTime: event.eventStartTime || "",
      eventEndDate: event.eventEndDate || "",
      eventEndTime: event.eventEndTime || "",
      budgetAmount: event.budgetAmount ?? "",
      remarks: event.remarks || "",
    },
    clientDetails: {
      addBrideGroom: false, // this endpoint only returns one party — adjust if the API adds a second
      clients: [
        {
          id: crypto.randomUUID(),
          clientMasterId: event.partyId ?? null,
          title: "Mr.", // not present in this response shape
          name: event.partyNameEnglish || "",
          mobile: "", // not present in this response shape
          address: "", // not present in this response shape
          highPriority: "No",
          leadSource: "Referral",
          clientType: "groom",
        },
      ],
    },
    functionDetails: {
      functions: (event.eventFunctions || []).map(mapEventFunctionToRow),
    },
    otherInformation: {
      photographer: {
        mode: otherInfo.photographerDetailType === "OTHER" ? "other" : "groomBride",
        photographerName: otherInfo.groomPhotographerName || otherInfo.bridePhotographerName || "",
        photographerNo:
          otherInfo.groomPhotographerContactNumber || otherInfo.bridePhotographerContactNumber || "",
        groom: {
          name: otherInfo.groomName || "",
          fatherName: otherInfo.groomFatherName || "",
          contactNumber: otherInfo.groomContactNumber || "",
          instaId: otherInfo.groomInstaId || "",
          birthdate: otherInfo.groomBirthdate || "",
        },
        bride: {
          name: otherInfo.brideName || "",
          fatherName: otherInfo.brideFatherName || "",
          contactNumber: otherInfo.brideContactNumber || "",
          instaId: otherInfo.brideInstaId || "",
          birthdate: otherInfo.brideBirthdate || "",
        },
      },
    },
  };

  const draftValues = {
    eventName: event.projectName || "",
    eventType: event.eventTypeId
      ? { value: event.eventTypeId, label: event.eventNameEnglish || "" }
      : null,
    eventDate: event.inquiryDate || "",
    priority: PRIORITY_MAP_REVERSE[event.priority] || "High",
    venue: event.venueId
      ? { value: event.venueId, label: event.venueNameEnglish || "", subVenues: [] }
      : null,
  };

  return { formData, draftValues };
}

// Hook: fetches an event by id and prefills both the multi-step formData
// and the Zustand draft store. Use in CreateEvent when editing an existing event.
export function useEventEditLoader(eventId) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState(null);

  const setEventName = useEventDraftStore((s) => s.setEventName);
  const setEventType = useEventDraftStore((s) => s.setEventType);
  const setEventDate = useEventDraftStore((s) => s.setEventDate);
  const setPriority = useEventDraftStore((s) => s.setPriority);
  const setVenue = useEventDraftStore((s) => s.setVenue);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getbyeventid(eventId);
        const event = res?.data?.data;

        if (!event) throw new Error("No event data returned");
        if (cancelled) return;

        const { formData: mappedFormData, draftValues } = mapEventToFormData(event);

        setFormData(mappedFormData);
        setEventName(draftValues.eventName);
        setEventType(draftValues.eventType);
        setEventDate(draftValues.eventDate);
        setPriority(draftValues.priority);
        setVenue(draftValues.venue);
      } catch (err) {
        console.error("Failed to load event for edit:", err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return { formData, loading, error };
}