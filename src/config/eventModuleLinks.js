// src/config/eventModuleLinks.js
import {
  Receipt,
  ClipboardList,
  Flower2,
  Lightbulb,
  MonitorPlay,
  Mic2,
  Landmark,
  Sofa,
  UserSquare2,
  Printer,
  Briefcase,
  PlusSquare,
  Warehouse,
  Users,
} from "lucide-react";

// Only these two routes are defined with an :eventId path param
// (see App routes: "/quotation/:eventId", "/execution/:eventId").
// Everything else reads eventId via query string, same pattern
// ExecutionPage already uses: routeEventId ?? searchParams.get("eventId").
const ROUTE_PARAM_PATHS = new Set(["/quotation", "/execution"]);

export const EVENT_MODULE_LINKS = [
  { title: "Estimate", path: "/quotation", icon: Receipt, primary: true },
  { title: "Execution", path: "/execution", icon: ClipboardList, primary: true },
  { title: "Event Flower", path: "/flower", icon: Flower2 },
  { title: "Event Lighting", path: "/lighting", icon: Lightbulb },
  { title: "Event LED Wall", path: "/ledwall", icon: MonitorPlay },
  { title: "Event Sound", path: "/sound", icon: Mic2 },
  { title: "Event Mandap", path: "/mandap", icon: Landmark },
  { title: "Event Furniture", path: "/furniture", icon: Sofa },
  { title: "Event Artist Entertainment", path: "/artist-entertainment", icon: UserSquare2 },
  { title: "Event Printing", path: "/printing", icon: Printer },
  { title: "Event Outsource Agency", path: "/outsource-agency", icon: Briefcase },
  { title: "Event New Making", path: "/new-making", icon: PlusSquare },
  { title: "Event Godown", path: "/godown", icon: Warehouse },
  { title: "Event Labour Agency", path: "/labour-agency", icon: Users },
];

/**
 * Builds the actual URL for a module link given the current eventId.
 * - /quotation, /execution -> /quotation/123, /execution/123 (route param)
 * - everything else        -> /flower?eventId=123 (query string)
 * Falls back to the bare path if no eventId is known yet.
 */
export const buildModuleUrl = (path, eventId) => {
  if (!eventId) return path;
  return ROUTE_PARAM_PATHS.has(path) ? `${path}/${eventId}` : `${path}?eventId=${eventId}`;
};