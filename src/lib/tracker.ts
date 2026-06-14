import { masterWaxes } from "@/lib/master-waxes";
import { getDisplayStatus } from "@/lib/time";
import type { DataFile, StoredWaxState, TrackedWaxCombo } from "@/lib/types";

export function mergeWithMasterList(data: DataFile): TrackedWaxCombo[] {
  const stateMap = new Map(data.states.map((state) => [state.id, state]));

  return masterWaxes.map((combo) => {
    const state = stateMap.get(combo.id);

    return {
      ...combo,
      status: state?.status ?? "ready",
      activated_at: state?.activated_at ?? null,
      started_at: state?.started_at ?? null,
    };
  });
}

export function toStoredStates(combos: TrackedWaxCombo[]): StoredWaxState[] {
  return combos
    .filter(
      (combo): combo is TrackedWaxCombo & { status: StoredWaxState["status"] } =>
        combo.status !== "ready"
    )
    .map((combo) => ({
      id: combo.id,
      status: combo.status,
      activated_at: combo.status === "cooldown" ? combo.activated_at : null,
      started_at: combo.status === "growing" ? combo.started_at : null,
    }));
}

export function getSections(combos: TrackedWaxCombo[]) {
  return {
    ready: combos.filter((combo) => getDisplayStatus(combo) === "ready"),
    growing: combos.filter((combo) => getDisplayStatus(combo) === "growing"),
    cooldown: combos.filter((combo) => getDisplayStatus(combo) === "cooldown"),
  };
}
