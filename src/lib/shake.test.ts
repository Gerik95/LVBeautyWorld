import { describe, expect, it } from "vitest";
import { readShake } from "@/lib/shake";

const rest = { x: 0, y: 0, z: 9.8 };

describe("shake", () => {
  it("accepts a hard stroke of linear acceleration", () => {
    expect(readShake({ acceleration: { x: 20, y: 3, z: 0 }, accelerationIncludingGravity: rest }, null).strong).toBe(
      true,
    );
  });

  it("ignores a phone that is only being held or walked with", () => {
    expect(
      readShake({ acceleration: { x: 0.2, y: 0.1, z: 0.1 }, accelerationIncludingGravity: rest }, rest).strong,
    ).toBe(false);
    expect(readShake({ acceleration: { x: 4, y: 2, z: 1 }, accelerationIncludingGravity: rest }, rest).strong).toBe(
      false,
    );
  });

  it("ignores a slow tilt of the phone", () => {
    let gravity: { x: number; y: number; z: number } | null = null;
    for (let step = 0; step <= 30; step += 1) {
      const angle = (step / 30) * (Math.PI / 2);
      const sample = readShake(
        {
          acceleration: { x: 0.1, y: 0, z: 0 },
          accelerationIncludingGravity: { x: 9.8 * Math.sin(angle), y: 0, z: 9.8 * Math.cos(angle) },
        },
        gravity,
      );
      expect(sample.strong).toBe(false);
      gravity = sample.gravity;
    }
  });

  it("uses the gravity jump when linear acceleration stays at zero", () => {
    const first = readShake({ acceleration: { x: 0, y: 0, z: 0 }, accelerationIncludingGravity: rest }, null);
    expect(first.strong).toBe(false);
    const shaken = readShake(
      { acceleration: { x: 0, y: 0, z: 0 }, accelerationIncludingGravity: { x: 8, y: 4, z: 2 } },
      first.gravity,
    );
    expect(shaken.strong).toBe(true);
  });

  it("uses gravity when the device has no linear sensor", () => {
    const shaken = readShake({ acceleration: null, accelerationIncludingGravity: { x: 9, y: 5, z: 3 } }, rest);
    expect(shaken.strong).toBe(true);
    expect(readShake({ acceleration: null, accelerationIncludingGravity: rest }, null).strong).toBe(false);
  });
});
