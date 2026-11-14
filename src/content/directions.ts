import type { TravelMode } from "@/lib/maps";

/**
 * "Anfahrt" on the contacts page. Each mode opens Google Maps with that mode.
 * Add a note only with a confirmed fact (nearest stop, parking); an empty note
 * is not shown. Nothing here is guessed.
 */
export type DirectionsMode = {
  mode: TravelMode;
  note: { de: string; uk: string } | null;
};

export const directionsModes: DirectionsMode[] = [
  { mode: "driving", note: null },
  { mode: "transit", note: null },
  { mode: "walking", note: null },
];
