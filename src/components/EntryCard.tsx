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
  getReadyDate,
} from "@/lib/time";
import { AssetTile } from "@/components/AssetTile";
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
  const readySince =
    displayStatus === "ready" && combo.activated_at
      ? getReadyDate(combo.activated_at).toISOString()
      : null;
  const cardTone =
    displayStatus === "ready"
      ? "border-primary/25 bg-linear-to-br from-primary/12 via-card to-card"
      : displayStatus === "growing"
        ? "border-secondary/25 bg-linear-to-br from-secondary/12 via-card to-card"
        : "border-accent/25 bg-linear-to-br from-accent/12 via-card to-card";

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
        className="shrink-0 border-secondary/25 bg-secondary/14 text-secondary"
      >
        <Sprout />
        Growing
      </Badge>
    ) : displayStatus === "ready" ? (
      <Badge className="shrink-0 bg-primary/18 text-primary ring-1 ring-primary/20 hover:bg-primary/18">
        <CheckCircle2 />
        Ready
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="shrink-0 border-accent/25 bg-accent/14 text-accent"
      >
        <TimerReset />
        Cooldown
      </Badge>
    );

  return (
    <Card className={`h-full gap-0 py-0 ${cardTone}`}>
      <CardContent className="flex h-full min-h-[260px] flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="rounded-[1.35rem] border border-outline bg-surface-container-low/75 p-3">
              <div className="flex items-center gap-2">
                <AssetTile type="planter" name={combo.planter} size="sm" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Planter
                  </p>
                  <p className="truncate text-base font-semibold leading-tight">
                    {combo.planter}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-outline bg-surface-container-low/75 p-3">
              <div className="flex items-center gap-2">
                <AssetTile type="field" name={combo.field} size="sm" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Field
                  </p>
                  <p className="truncate text-base font-semibold leading-tight">
                    {combo.field}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {statusBadge}
        </div>

        <div className="space-y-2 text-sm">
          {displayStatus === "ready" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[1.35rem] border border-primary/20 bg-primary/12 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/75">
                  Available
                </p>
                <p className="mt-1 font-semibold text-primary">
                  {readySince ? formatAvailableFor(readySince) : "Ready by default"}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-outline bg-surface-container-low/75 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Grow time
                </p>
                <p className="mt-1 font-semibold">{formatDuration(combo.duration)}</p>
              </div>
            </div>
          )}

          {displayStatus === "growing" && combo.started_at && (
            <div className="rounded-[1.5rem] border border-secondary/25 bg-secondary/12 p-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[1.1rem] border border-secondary/15 bg-background/20 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/75">
                    Time since planted
                  </p>
                  <p className="mt-1 font-semibold text-secondary">
                    {formatElapsed(combo.started_at)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-secondary/15 bg-background/20 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/75">
                    Planted
                  </p>
                  <p className="mt-1 font-semibold text-secondary">
                    {formatDate(combo.started_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {displayStatus === "cooldown" && combo.activated_at && (
            <div className="rounded-[1.5rem] border border-accent/25 bg-accent/12 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div className="rounded-[1.1rem] border border-accent/15 bg-background/20 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/75">
                    Last harvested
                  </p>
                  <p className="mt-1 font-semibold text-accent">
                    {formatDate(combo.activated_at)}
                  </p>
                </div>
                <div className="rounded-[1.1rem] border border-accent/15 bg-background/20 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/75">
                    Time remaining
                  </p>
                  <p className="mt-1 font-semibold text-accent">
                    {formatCountdown(combo.activated_at)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-accent/75">
                  <span>Cooldown progress</span>
                  <span>{Math.round(cooldownProgress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-background/55">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-destructive via-accent to-primary transition-[width] duration-500"
                    style={{ width: `${cooldownProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {displayStatus === "ready" && combo.status === "cooldown" && (
            <div className="rounded-[1.5rem] border border-primary/25 bg-primary/12 p-3">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Clock3 className="h-4 w-4" />
                <p className="font-semibold">Cooldown finished</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background/55">
                <div className="h-full w-full rounded-full bg-linear-to-r from-primary to-lime-300" />
              </div>
              <p className="mt-2 text-primary">
                This combo is available again and can be started whenever you want.
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          {displayStatus === "ready" && (
            <Button
              className="col-span-2 w-full"
              size="lg"
              onClick={() => onStartGrowing(combo)}
            >
              <Sprout />
              Set growing
            </Button>
          )}

          {displayStatus === "growing" && (
            <>
              <Button
                className="w-full"
                size="lg"
                onClick={() => onHarvest(combo)}
              >
                <Hourglass />
                Harvest
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => onClear(combo)}
              >
                <RotateCcw />
                Clear
              </Button>
            </>
          )}

          {displayStatus === "cooldown" && (
            <Button
              variant="outline"
              className="col-span-2 w-full"
              size="lg"
              onClick={() => onClear(combo)}
            >
              <RotateCcw />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
