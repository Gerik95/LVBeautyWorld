export type LampPhase = "fresh" | "playing" | "done";

/**
 * Logo ignition runs in both themes. The beam is dark-only, so a light page
 * with no logo lamp waits and does not spend the visit.
 */
export const lampGate = ({
  lamp,
  spotlight,
  reduced,
  phase,
  themeDark,
}: {
  lamp: boolean;
  spotlight: boolean;
  reduced: boolean;
  phase: LampPhase;
  themeDark: boolean;
}): "play" | "wait" | "steady" => {
  if (reduced || phase === "done") return "steady";
  if (themeDark) return lamp || spotlight ? "play" : "steady";
  return lamp ? "play" : "wait";
};
