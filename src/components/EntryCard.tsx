import { useEffect, useState } from "react";
import type { TrackedWaxCombo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatAvailableFor,
  formatCountdown,
  formatDate,
  formatDuration,
  formatElapsed,
  getCooldownProgress,
  getDisplayStatus,
  getGrowthProgress,
  getReadyDate,
} from "@/lib/time";
import {
  getFieldImageUrl,
  getPlanterImageUrl,
} from "@/lib/images";
import {
  Clock3,
  CheckCircle2,
  Hourglass,
  RotateCcw,
  Sprout,
  TimerReset,
} from "lucide-react";

interface EntryCardProps {
  combo: TrackedWaxCombo;
  onStartGrowing: (combo: TrackedWaxCombo) => void;
  onHarvest: (combo: TrackedWaxCombo) => void;
  onClear: (combo: TrackedWaxCombo) => void;
}

export function EntryCard({
  combo,
  onStartGrowing,
  onHarvest,
  onClear,
}: EntryCardProps) {
  const [, setTick] = useState(0);
  const displayStatus = getDisplayStatus(combo);
  const cooldownProgress = combo.activated_at
    ? getCooldownProgress(combo.activated_at)
    : 0;
  const growthProgress =
    combo.started_at && combo.duration
      ? getGrowthProgress(combo.started_at, combo.duration)
      : 0;
  const readySince =
    displayStatus === "ready" && combo.activated_at
      ? getReadyDate(combo.activated_at).toISOString()
      : null;
  const cardTone =
    displayStatus === "ready"
      ? "border-emerald-500/35 bg-linear-to-br from-emerald-500/12 via-card to-card shadow-emerald-950/20"
      : displayStatus === "growing"
        ? "border-sky-500/35 bg-linear-to-br from-sky-500/12 via-card to-card shadow-sky-950/20"
        : "border-amber-500/35 bg-linear-to-br from-amber-500/12 via-card to-card shadow-amber-950/20";

  useEffect(() => {
    if (
      (displayStatus !== "cooldown" || !combo.activated_at) &&
      (displayStatus !== "growing" || !combo.started_at) &&
      (displayStatus !== "ready" || !readySince)
    ) {
      return;
    }

    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, [combo.activated_at, combo.started_at, displayStatus, readySince]);

  const statusBadge =
    displayStatus === "growing" ? (
      <Badge
        variant="outline"
        className="shrink-0 rounded-full border-sky-500/40 bg-sky-500/12 px-3 py-1.5 text-sky-200"
      >
        <Sprout className="mr-1.5 h-3.5 w-3.5" />
        Growing
      </Badge>
    ) : displayStatus === "ready" ? (
      <Badge className="shrink-0 rounded-full bg-emerald-600/90 px-3 py-1.5 text-white hover:bg-emerald-600">
        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
        Ready
      </Badge>
    ) : (
      <Badge
        variant="destructive"
        className="shrink-0 rounded-full bg-amber-500/15 px-3 py-1.5 text-amber-200 ring-1 ring-amber-500/30"
      >
        <TimerReset className="mr-1.5 h-3.5 w-3.5" />
        Cooldown
      </Badge>
    );

  return (
    <Card className={`h-full gap-0 py-0 shadow-lg shadow-black/10 ${cardTone}`}>
      <CardContent className="flex h-full min-h-[240px] flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-2.5">
            <div className="rounded-xl border border-border/60 bg-background/35 p-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={getPlanterImageUrl(combo.planter)}
                  alt=""
                  className="h-10 w-10 rounded-md border border-border/70 bg-background/50 object-contain p-1"
                />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Planter
                  </p>
                  <p className="truncate text-base font-semibold">{combo.planter}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-background/35 p-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={getFieldImageUrl(combo.field)}
                  alt=""
                  className="h-10 w-10 rounded-md border border-border/70 bg-background/50 object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Field
                  </p>
                  <p className="truncate text-base font-semibold">{combo.field}</p>
                </div>
              </div>
            </div>
          </div>

          {statusBadge}
        </div>

        <div className="space-y-2 text-sm">
          {displayStatus === "ready" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-2.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">
                  Available
                </p>
                <p className="mt-1 font-medium text-emerald-200">
                  {readySince ? formatAvailableFor(readySince) : "Ready by default"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/35 p-2.5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Grow time
                </p>
                <p className="mt-1 font-medium">~ {formatDuration(combo.duration)}</p>
              </div>
            </div>
          )}

          {displayStatus === "growing" && combo.started_at && (
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-sky-400/15 bg-background/20 p-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">
                    Growing for
                  </p>
                  <p className="mt-1 font-medium text-sky-100">
                    {formatElapsed(combo.started_at)}
                  </p>
                </div>
                <div className="rounded-lg border border-sky-400/15 bg-background/20 p-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200/70">
                    Est. duration
                  </p>
                  <p className="mt-1 font-medium text-sky-100">
                    ~ {formatDuration(combo.duration)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-sky-100/70">
                  <span>Approx. growth progress</span>
                  <span>{Math.round(growthProgress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-sky-950/70">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-sky-400 via-cyan-300 to-emerald-300 transition-[width] duration-500"
                    style={{ width: `${growthProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {displayStatus === "cooldown" && combo.activated_at && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-amber-400/15 bg-background/20 p-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                    Last harvested
                  </p>
                  <p className="mt-1 font-medium text-amber-50">
                    {formatDate(combo.activated_at)}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-400/15 bg-background/20 p-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                    Time remaining
                  </p>
                  <p className="mt-1 font-medium text-amber-50">
                    {formatCountdown(combo.activated_at)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-100/70">
                  <span>Cooldown progress</span>
                  <span>{Math.round(cooldownProgress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-amber-950/70">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-rose-400 via-amber-400 to-emerald-300 transition-[width] duration-500"
                    style={{ width: `${cooldownProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {displayStatus === "ready" && combo.status === "cooldown" && (
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3">
              <div className="mb-2 flex items-center gap-2 text-emerald-100">
                <Clock3 className="h-4 w-4" />
                <p className="font-medium">Cooldown finished</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-950/70">
                <div className="h-full w-full rounded-full bg-linear-to-r from-emerald-400 to-lime-300" />
              </div>
              <p className="mt-2 text-emerald-300">
                This combo is available again and can be started whenever you want.
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          {displayStatus === "ready" && (
            <Button
              className="col-span-2 h-12 w-full text-sm font-semibold"
              onClick={() => onStartGrowing(combo)}
            >
              <Sprout className="mr-1.5 h-4 w-4" />
              Set growing
            </Button>
          )}

          {displayStatus === "growing" && (
            <>
              <Button
                className="h-12 w-full text-sm font-semibold"
                onClick={() => onHarvest(combo)}
              >
                <Hourglass className="mr-1.5 h-4 w-4" />
                Harvest
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full text-sm font-semibold"
                onClick={() => onClear(combo)}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Clear
              </Button>
            </>
          )}

          {displayStatus === "cooldown" && (
            <Button
              variant="outline"
              className="col-span-2 h-12 w-full text-sm font-semibold"
              onClick={() => onClear(combo)}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
