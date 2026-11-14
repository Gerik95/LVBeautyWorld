import { describe, expect, it } from "vitest";
import { serviceGalleryImage, services } from "@/content/services";
import {
  formatGalleryCount,
  isCurrentRequest,
  resolveStoredService,
  shouldResetWaveOrigin,
} from "@/lib/serviceGallery";

describe("resolveStoredService", () => {
  it("keeps a known service id", () => {
    expect(resolveStoredService("laser")).toBe("laser");
    expect(resolveStoredService("lash-extensions")).toBe("lash-extensions");
  });

  it("falls back when the stored value is empty or not in the gallery", () => {
    expect(resolveStoredService(null)).toBe("nails");
    expect(resolveStoredService("")).toBe("nails");
    expect(resolveStoredService("pmu")).toBe("nails");
    expect(resolveStoredService("makeup")).toBe("nails");
  });
});

describe("formatGalleryCount", () => {
  it("pads the current index and the total", () => {
    expect(formatGalleryCount(0, 6)).toBe("01 / 06");
    expect(formatGalleryCount(5, 6)).toBe("06 / 06");
  });
});

describe("shouldResetWaveOrigin", () => {
  it("starts a new origin only when the wave is closed", () => {
    expect(shouldResetWaveOrigin(0)).toBe(true);
    expect(shouldResetWaveOrigin(Number.NaN)).toBe(true);
    expect(shouldResetWaveOrigin(0.4)).toBe(true);
    expect(shouldResetWaveOrigin(18)).toBe(false);
    expect(shouldResetWaveOrigin(165)).toBe(false);
  });
});

describe("isCurrentRequest", () => {
  it("ignores a load that finished after a newer choice", () => {
    expect(isCurrentRequest(3, 3)).toBe(true);
    expect(isCurrentRequest(2, 3)).toBe(false);
  });
});

describe("serviceGalleryImage", () => {
  it("uses each service photo, including skin care", () => {
    const skin = services.find((item) => item.id === "skin");
    const nails = services.find((item) => item.id === "nails");
    expect(skin).toBeTruthy();
    expect(nails).toBeTruthy();
    if (!skin || !nails) return;
    expect(serviceGalleryImage(skin)).toBe("/photos/services/skin.jpg");
    expect(serviceGalleryImage(nails)).toBe(nails.image);
  });
});
