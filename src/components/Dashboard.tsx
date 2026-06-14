import { useState, useEffect, useCallback } from "react";
import type { TrackedWaxCombo } from "@/lib/types";
import { fetchData, saveData, clearConfig } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/EntryCard";
import { HarvestDialog } from "@/components/HarvestDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AssetTile } from "@/components/AssetTile";
import { getDisplayStatus } from "@/lib/time";
import {
  CheckCircle2,
  ChevronDown,
  LogOut,
  RefreshCw,
  Sprout,
  TimerReset,
} from "lucide-react";
import { getSections, mergeWithMasterList, toStoredStates } from "@/lib/tracker";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [combos, setCombos] = useState<TrackedWaxCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [harvestOpen, setHarvestOpen] = useState(false);
  const [activeCombo, setActiveCombo] = useState<TrackedWaxCombo | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Caustic Wax": true,
    "Swirled Wax": true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchData();
      setCombos(mergeWithMasterList(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function persist(updated: TrackedWaxCombo[]) {
    setSaving(true);
    setError("");
    try {
      await saveData({ states: toStoredStates(updated) });
      setCombos(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function updateCombo(
    comboId: string,
    updater: (combo: TrackedWaxCombo) => TrackedWaxCombo
  ) {
    persist(combos.map((combo) => (combo.id === comboId ? updater(combo) : combo)));
  }

  function handleStartGrowing(combo: TrackedWaxCombo) {
    updateCombo(combo.id, (current) => ({
      ...current,
      status: "growing",
      activated_at: null,
      started_at: new Date().toISOString(),
    }));
  }

  function handleClear(combo: TrackedWaxCombo) {
    updateCombo(combo.id, (current) => ({
      ...current,
      status: "ready",
      activated_at: null,
      started_at: null,
    }));
  }

  function handleHarvestClick(combo: TrackedWaxCombo) {
    setActiveCombo(combo);
    setHarvestOpen(true);
  }

  function handleHarvest(activatedAt: string) {
    if (!activeCombo) {
      return;
    }

    updateCombo(activeCombo.id, (current) => ({
      ...current,
      status: "cooldown",
      activated_at: activatedAt,
      started_at: null,
    }));
  }

  function handleLogout() {
    clearConfig();
    onLogout();
  }

  const sections = getSections(combos);
  const summaryCards = [
    {
      label: "Ready",
      value: sections.ready.length,
      icon: CheckCircle2,
      tone: "text-primary",
      tile: "bg-primary/18 text-primary ring-primary/20",
    },
    {
      label: "Growing",
      value: sections.growing.length,
      icon: Sprout,
      tone: "text-secondary",
      tile: "bg-secondary/18 text-secondary ring-secondary/20",
    },
    {
      label: "Cooldown",
      value: sections.cooldown.length,
      icon: TimerReset,
      tone: "text-accent",
      tile: "bg-accent/18 text-accent ring-accent/20",
    },
  ];
  const waxGroups = ["Caustic Wax", "Swirled Wax"].map((wax) => {
    const groupCombos = combos.filter((combo) => combo.wax === wax);

    return {
      wax,
      combos: groupCombos,
      ready: groupCombos.filter((combo) => getDisplayStatus(combo) === "ready")
        .length,
      growing: groupCombos.filter(
        (combo) => getDisplayStatus(combo) === "growing"
      ).length,
      cooldown: groupCombos.filter(
        (combo) => getDisplayStatus(combo) === "cooldown"
      ).length,
    };
  });

  function toggleGroup(wax: string) {
    setOpenGroups((current) => ({
      ...current,
      [wax]: !current[wax],
    }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-outline bg-background/90 supports-backdrop-filter:backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Bee Swarm
            </p>
            <h1 className="truncate text-xl font-semibold sm:text-2xl">
              Planter Wax Tracker
            </h1>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="tonal"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      {saving && (
        <div
          role="status"
          aria-live="polite"
          className="m3-elevation-2 fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-4xl border border-outline bg-surface-container-high px-4 py-2 text-sm font-semibold text-foreground"
        >
          <RefreshCw className="size-4 animate-spin text-primary" />
          Saving changes
        </div>
      )}

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {error && (
          <div className="rounded-[1.5rem] border border-destructive/25 bg-destructive/12 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className="gap-0 border-outline bg-surface-container py-0"
            >
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {card.label}
                  </p>
                  <p className={`text-4xl font-semibold leading-none ${card.tone}`}>
                    {card.value}
                  </p>
                </div>
                <div
                  className={`grid size-12 place-items-center rounded-[1.35rem] ring-1 ${card.tile}`}
                >
                  <card.icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {loading ? (
          <div className="rounded-[2rem] border border-outline bg-surface-container-low p-8 text-center text-sm font-medium text-muted-foreground">
            Loading tracker data
          </div>
        ) : (
          <>
            {waxGroups.map((group) => (
              <section key={group.wax} className="space-y-3">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.wax)}
                  className="m3-state-layer flex w-full flex-col gap-4 rounded-[2rem] border border-outline bg-surface-container-low p-4 text-left transition hover:bg-surface-container sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <AssetTile type="wax" name={group.wax} size="lg" />
                    <div>
                      <h2 className="text-lg font-semibold leading-tight">
                        {group.wax}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {group.combos.length} combinations
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                    <Badge className="bg-primary/18 text-primary ring-1 ring-primary/20 hover:bg-primary/18">
                      {group.ready} ready
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-secondary/25 bg-secondary/14 text-secondary"
                    >
                      {group.growing} growing
                    </Badge>
                    <Badge className="bg-accent/16 text-accent ring-1 ring-accent/20 hover:bg-accent/16">
                      {group.cooldown} cooldown
                    </Badge>
                    <ChevronDown
                      className={`ml-auto size-5 shrink-0 text-muted-foreground transition-transform sm:ml-1 ${
                        openGroups[group.wax] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openGroups[group.wax] && (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {group.combos.map((combo) => (
                      <EntryCard
                        key={combo.id}
                        combo={combo}
                        onStartGrowing={handleStartGrowing}
                        onHarvest={handleHarvestClick}
                        onClear={handleClear}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}
      </main>

      <HarvestDialog
        key={activeCombo?.id ?? "harvest-closed"}
        open={harvestOpen}
        onClose={() => {
          setHarvestOpen(false);
          setActiveCombo(null);
        }}
        onHarvest={handleHarvest}
        combo={activeCombo}
      />
    </div>
  );
}
