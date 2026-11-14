import { site } from "@/lib/site";

/**
 * Salon name and street address. This is the Embed API `q` and the directions
 * destination. It is not a Place ID. The owner's Maps link uses a hex feature
 * id, which is not `destination_place_id`, so that parameter is omitted.
 */
export const mapsDestination = `${site.name}, ${site.street}, ${site.postalCode} ${site.city}, Germany`;

export type TravelMode = "driving" | "transit" | "walking";

/** Without a mode Google picks one. With a mode the route opens in that tab. */
export const googleDirectionsUrl = (destination = mapsDestination, travelmode?: TravelMode) => {
  const params = new URLSearchParams({
    api: "1",
    destination,
    dir_action: "navigate",
  });
  if (travelmode) params.set("travelmode", travelmode);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

/**
 * Google's query embed. The maps product resolves the salon from the address
 * and draws the pin. This is not a `/maps/place/` page, not a `pb` string,
 * and not a Place ID.
 */
export const googleQueryEmbedUrl = (language: "de" | "uk", destination = mapsDestination) => {
  const params = new URLSearchParams({
    q: destination,
    z: "16",
    hl: language,
    output: "embed",
  });
  return `https://maps.google.com/maps?${params.toString()}`;
};
