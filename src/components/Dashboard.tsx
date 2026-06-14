import { useState, useEffect, useCallback } from "react";
import type { TrackedWaxCombo } from "@/lib/types";
import { fetchData, saveData, clearConfig } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/EntryCard";
import { HarvestDialog } from "@/components/HarvestDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getWaxImageUrl } from "@/lib/images";
import { getDisplayStatus } from "@/lib/time";
import { ChevronDown, LogOut, RefreshCw } from "lucide-react";
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
    { label: "Ready", value: sections.ready.length, tone: "text-emerald-300" },
    { label: "Growing", value: sections.growing.length, tone: "text-sky-300" },
    { label: "Cooldown", value: sections.cooldown.length, tone: "text-amber-300" },
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
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Planter Wax Tracker</h1>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {saving && (
          <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground text-center">
            Saving…
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.label} className="gap-0 border-border/70 bg-card/90 py-0">
              <CardContent className="space-y-1 p-4">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className={`text-3xl font-bold ${card.tone}`}>{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading…</div>
        ) : (
          <>
            {waxGroups.map((group) => (
              <section key={group.wax}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.wax)}
                  className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card/85 px-4 py-4 text-left shadow-lg shadow-black/10 transition hover:bg-card"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getWaxImageUrl(group.wax)}
                      alt=""
                      className="h-14 w-14 rounded-xl border border-border/70 bg-background/40 object-contain p-1"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{group.wax}</h2>
                      <p className="text-sm text-muted-foreground">
                        {group.combos.length} combinations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                      {group.ready} ready
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-sky-500/60 bg-sky-500/10 text-sky-300"
                    >
                      {group.growing} growing
                    </Badge>
                    <Badge variant="destructive" className="bg-rose-600/90">
                      {group.cooldown} cooldown
                    </Badge>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        openGroups[group.wax] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openGroups[group.wax] && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
