import { describe, expect, it } from "vitest";
import { motion } from "@/skins/motion";
import {
  abortUnpaintedLamp,
  beginLamp,
  lampState,
  markLampPainted,
  resetLampSession,
} from "@/components/hero/lampSession";

describe("lamp session", () => {
  it("does not keep a cancelled mount from playing", () => {
    resetLampSession();
    beginLamp(1_000);
    abortUnpaintedLamp();
    expect(lampState(1_100)).toBe("fresh");
  });

  it("starts again after a finished visit is reset", () => {
    resetLampSession();
    beginLamp(1_000);
    markLampPainted();
    expect(lampState(1_000 + motion.lampMs)).toBe("done");
    resetLampSession();
    expect(lampState(1_000 + motion.lampMs + 5_000)).toBe("fresh");
  });

  it("resumes after a painted frame and then settles", () => {
    resetLampSession();
    beginLamp(1_000);
    markLampPainted();
    abortUnpaintedLamp();
    expect(lampState(1_400)).toBe("playing");
    expect(lampState(1_000 + motion.lampMs)).toBe("done");
    resetLampSession();
  });
});
