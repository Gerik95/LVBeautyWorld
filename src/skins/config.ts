/**
 * Active presentation. Change `activeSkinId` when a seasonal skin is registered.
 * `effectsEnabled` turns off lamp, spotlight, button glare, reveal and the photo trial together.
 * Scheduling (Europe/Berlin) is intentionally not wired until a skin needs it.
 */
export const skinConfig = {
  activeSkinId: "default" as string,
  effectsEnabled: true,
};
