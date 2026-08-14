// Builds the API payload for POST /event/add-update from the CreateEvent
// multi-step formData + useEventDraftStore state.
// This is the inverse of mapEventToFormData (see useEventEditLoader.js) —
// keep the two in sync if the API response/request shape changes.

const TITLE_MAP = { "Mr.": "MR", "Mrs.": "MRS", "Ms.": "MS", "Dr.": "DR" };
const STATUS_MAP = { Inquiry: "INQUIRY", Tentative: "TENTATIVE", Confirmed: "CONFIRMED" };
const PRIORITY_MAP = { High: "HIGH", Med: "MED", Low: "LOW" };

function buildEventFunctionPayload(fn) {
  return {
    id: fn.functionRecordId || null,
    functionId: fn.functionTypeId ?? null,
    functionDate: fn.date || "",
    functionTime: fn.time || "",
    notesEnglish: fn.notesEnglish || "",
    notesGujarati: fn.notesGujarati || "",
    notesHindi: fn.notesHindi || "",
    venues: fn.venue?.value
      ? [
          {
            id: fn.venueRecordId || null, // venue-link row id — see note below
            venueId: fn.venue.value,
            subVenueId: fn.subVenues || [],
          },
        ]
      : [],
  };
}

export function buildEventPayload({ formData, draftStore, existingId = 0 }) {
  const eventDetails = formData.eventDetails || {};
  const clientDetails = formData.clientDetails || {};
  const functionDetails = formData.functionDetails || {};
  const otherInformation = formData.otherInformation || {};
  const photographer = otherInformation.photographer || {};

  const primaryClient = clientDetails.clients?.[0] || {};


const userId = Number(localStorage.getItem("userId"));

  return {
    id: existingId || null,
    userId,

    // From draft store
    projectName: draftStore.eventName || "",
    eventTypeId: draftStore.eventType?.value ?? null,
    priority: PRIORITY_MAP[draftStore.priority] || "HIGH",
    venueId: draftStore.venue?.value ?? null,

    // Event details
    inquiryDate: eventDetails.inquiryDate || "",
    eventStatus: STATUS_MAP[eventDetails.eventStatus] || "INQUIRY",
    eventStartDate: eventDetails.eventStartDate || "",
    eventStartTime: eventDetails.eventStartTime || "",
    eventEndDate: eventDetails.eventEndDate || "",
    eventEndTime: eventDetails.eventEndTime || "",
    budgetAmount: eventDetails.budgetAmount ? Number(eventDetails.budgetAmount) : 0,
    remarks: eventDetails.remarks || "",

    // Client details (single party — extend here if addBrideGroom adds a second)
    partyId: primaryClient.clientMasterId ?? null,
    title: TITLE_MAP[primaryClient.title] || "MR",
    // partyNameEnglish: primaryClient.name || "",
    // partyMobileNo: primaryClient.mobile || "",
    // partyAddress: primaryClient.address || "",

    // Function details
    eventFunctions: (functionDetails.functions || []).map(buildEventFunctionPayload),

    
    eventOtherInfo: {
      photographerDetailType: photographer.mode === "other" ? "OTHER" : "GROOM_BRIDE",
      groomPhotographerName: photographer.photographerName || "",
      groomPhotographerContactNumber: photographer.photographerNo || "",
      bridePhotographerName: photographer.photographerName || "",
      bridePhotographerContactNumber: photographer.photographerNo || "",
      groomName: photographer.groom?.name || "",
      groomFatherName: photographer.groom?.fatherName || "",
      groomContactNumber: photographer.groom?.contactNumber || "",
      groomInstaId: photographer.groom?.instaId || "",
      groomBirthdate: photographer.groom?.birthdate || "",
      brideName: photographer.bride?.name || "",
      brideFatherName: photographer.bride?.fatherName || "",
      brideContactNumber: photographer.bride?.contactNumber || "",
      brideInstaId: photographer.bride?.instaId || "",
      brideBirthdate: photographer.bride?.birthdate || "",
    },
  };
}