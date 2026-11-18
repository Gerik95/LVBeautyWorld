export type MotionAxis = {
  x: number | null;
  y: number | null;
  z: number | null;
};

export type MotionReading = {
  acceleration: MotionAxis | null;
  accelerationIncludingGravity: MotionAxis | null;
};

export type Vector = { x: number; y: number; z: number };

/** Every browser reports device motion in m/s² (W3C Device Orientation and Motion). */
const G = 9.81;
/** Linear acceleration of one shake stroke. A hard shake reaches 2–4 g. */
const LINEAR_HIT = 1.25 * G;
/** Below this the linear sensor is treated as silent and gravity is used instead. */
const LINEAR_SILENT = 0.2 * G;
/** Sum of axis changes in the gravity vector between two samples. */
const GRAVITY_JUMP = 0.9 * G;

const axis = (sample: MotionAxis | null): Vector | null => {
  if (!sample || sample.x === null || sample.y === null || sample.z === null) return null;
  return { x: sample.x, y: sample.y, z: sample.z };
};

/**
 * One stroke of a shake: strong linear acceleration, or a sharp jump of the
 * gravity vector when the device has no linear sensor (no gyroscope) or it
 * stays at zero.
 */
export const readShake = (reading: MotionReading, previousGravity: Vector | null) => {
  const gravity = axis(reading.accelerationIncludingGravity);
  const next = gravity ?? previousGravity;
  const linear = axis(reading.acceleration);
  if (linear) {
    const magnitude = Math.hypot(linear.x, linear.y, linear.z);
    if (magnitude > LINEAR_SILENT) return { strong: magnitude > LINEAR_HIT, gravity: next };
  }
  if (!gravity || !previousGravity) return { strong: false, gravity: next };
  const delta =
    Math.abs(gravity.x - previousGravity.x) +
    Math.abs(gravity.y - previousGravity.y) +
    Math.abs(gravity.z - previousGravity.z);
  return { strong: delta > GRAVITY_JUMP, gravity: next };
};

/**
 * True on a touch device whose browser can send motion here. Browsers send
 * it only in a secure context (HTTPS or localhost); a desktop never shakes.
 */
export const motionSupported = () =>
  typeof window !== "undefined" &&
  window.isSecureContext &&
  typeof DeviceMotionEvent !== "undefined" &&
  navigator.maxTouchPoints > 0 &&
  window.matchMedia("(any-pointer: coarse)").matches;
