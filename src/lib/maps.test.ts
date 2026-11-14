import { describe, expect, it } from "vitest";
import { googleDirectionsUrl, googleQueryEmbedUrl, mapsDestination } from "@/lib/maps";

describe("google directions", () => {
  it("opens Google Maps directions for the verified address", () => {
    const url = new URL(googleDirectionsUrl());
    expect(`${url.origin}${url.pathname}`).toBe("https://www.google.com/maps/dir/");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("dir_action")).toBe("navigate");
    expect(url.searchParams.get("destination")).toBe(mapsDestination);
    expect(url.searchParams.has("origin")).toBe(false);
    expect(url.searchParams.has("destination_place_id")).toBe(false);
    expect(mapsDestination).toContain("LV Beauty World");
    expect(mapsDestination).toContain("Weingartenstraße 9");
    expect(mapsDestination).toContain("44263");
    expect(mapsDestination).toContain("Dortmund");
    expect(url.href).not.toContain("0x47b9171cf2d64e25");
    expect(url.href).not.toContain("51.4944583");
  });

  it("opens the chosen travel mode and leaves it to Google otherwise", () => {
    expect(new URL(googleDirectionsUrl()).searchParams.has("travelmode")).toBe(false);
    for (const mode of ["driving", "transit", "walking"] as const) {
      const url = new URL(googleDirectionsUrl(mapsDestination, mode));
      expect(url.searchParams.get("travelmode")).toBe(mode);
      expect(url.searchParams.get("destination")).toBe(mapsDestination);
      expect(url.searchParams.has("origin")).toBe(false);
    }
  });

  it("embeds the salon by address without a place id or an API key", () => {
    const embed = new URL(googleQueryEmbedUrl("de"));
    expect(`${embed.origin}${embed.pathname}`).toBe("https://maps.google.com/maps");
    expect(embed.searchParams.get("output")).toBe("embed");
    expect(embed.searchParams.get("q")).toBe(mapsDestination);
    expect(embed.searchParams.get("hl")).toBe("de");
    expect(embed.searchParams.has("key")).toBe(false);
    expect(embed.searchParams.has("pb")).toBe(false);
    expect(embed.href).not.toContain("destination_place_id");
    expect(embed.href).not.toContain("0x47b9171cf2d64e25");
    expect(embed.href).not.toContain("51.4944583");
  });
});
