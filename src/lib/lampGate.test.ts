import { describe, expect, it } from "vitest";
import { lampGate } from "@/lib/lampGate";

describe("lamp gate", () => {
  it("plays a dark hero that has not finished", () => {
    expect(lampGate({ lamp: true, spotlight: true, reduced: false, phase: "fresh", themeDark: true })).toBe("play");
    expect(lampGate({ lamp: true, spotlight: true, reduced: false, phase: "playing", themeDark: true })).toBe("play");
    expect(lampGate({ lamp: false, spotlight: true, reduced: false, phase: "fresh", themeDark: true })).toBe("play");
  });

  it("plays the logo lamp in light theme and leaves a beam-only visit waiting", () => {
    expect(lampGate({ lamp: true, spotlight: true, reduced: false, phase: "fresh", themeDark: false })).toBe("play");
    expect(lampGate({ lamp: false, spotlight: true, reduced: false, phase: "fresh", themeDark: false })).toBe("wait");
  });

  it("settles for reduced motion, disabled effects, or a finished session", () => {
    expect(lampGate({ lamp: true, spotlight: true, reduced: true, phase: "fresh", themeDark: true })).toBe("steady");
    expect(lampGate({ lamp: false, spotlight: false, reduced: false, phase: "fresh", themeDark: true })).toBe("steady");
    expect(lampGate({ lamp: true, spotlight: true, reduced: false, phase: "done", themeDark: true })).toBe("steady");
    expect(lampGate({ lamp: true, spotlight: true, reduced: false, phase: "done", themeDark: false })).toBe("steady");
  });
});
