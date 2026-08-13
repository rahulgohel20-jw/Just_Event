import { create } from "zustand";

export const useEventDraftStore = create((set) => ({
  eventName: "",
  eventType: null,
  eventDate: "",
  priority: "High",
  venue: null,
  setEventName: (eventName) => set({ eventName }),
  setEventType: (eventType) => set({ eventType }),
  setEventDate: (eventDate) => set({ eventDate }),
  setPriority: (priority) => set({ priority }),
  setVenue: (venue) => set({ venue }),
  reset: () =>
    set({
      eventName: "",
      eventType: null,
      eventDate: "",
      priority: "High",
      venue: null,
    }),
}));