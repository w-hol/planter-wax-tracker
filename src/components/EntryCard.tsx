import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { TrackedWaxCombo, WaxStatus } from "@/lib/types";
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

interface StatusTone {
  label: string;
  icon: LucideIcon;
  ring: string;
  iconContainer: string;
  badge: string;
  panel: string;
  progress: string;
}

const statusTones: Record<WaxStatus, StatusTone> = {
  ready: {
    label: "Ready",
    icon: CheckCircle2,
    ring: "ring-primary/18",
    iconContainer: "bg-primary-container text-on-primary-container ring-primary/20",
    badge: "bg-primary-container text-on-primary-container",
    panel: "bg-primary-container/70 text-on-primary-container",
    progress: "bg-primary",
  },
  growing: {
    label: "Growing",
    icon: Sprout,
    ring: "ring-secondary/18",
    iconContainer:
      "bg-secondary-container text-on-secondary-container ring-secondary/20",
    badge: "bg-secondary-container text-on-secondary-container",
    panel: "bg-secondary-container/72 text-on-secondary-container",
    progress: "bg-secondary",
  },
  cooldown: {
    label: "Cooldown",
    icon: TimerReset,
    ring: "ring-tertiary/18",
    iconContainer:
      "bg-tertiary-container text-on-tertiary-container ring-tertiary/20",
    badge: "bg-tertiary-container text-on-tertiary-container",
    panel: "bg-tertiary-container/72 text-on-tertiary-container",
    progress: "bg-tertiary",
  },
};

export function EntryCard({
  combo,
  onStartGrowing,
  onHarvest,
  onClear,
}: EntryCardProps) {
  const [, setTick] = useState(0);
  const displayStatus = getDisplayStatus(combo);
  const tone = statusTones[displayStatus];
  const StatusIcon = tone.icon;
  const cooldownProgress = combo.activated_at
    ? getCooldownProgress(combo.activated_at)
    : 0;
  const readySince =
    displayStatus === "ready" && combo.activated_at
      ? getReadyDate(combo.activated_at).toISOString()
      : null;

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

  return (
    <Card className={`h-full gap-0 bg-surface-container-low py-0 ${tone.ring}`}>
      <CardContent className="flex h-full min-h-[260px] flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${tone.iconContainer}`}
            >
              <StatusIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="m3-label-small truncate text-on-surface-variant">
                {combo.wax}
              </p>
              <h3 className="truncate text-base font-medium leading-snug text-on-surface">
                {combo.planter}
              </h3>
              <p className="truncate text-sm text-on-surface-variant">
                {combo.field}
              </p>
            </div>
          </div>

          <Badge className={`shrink-0 ${tone.badge}`}>
            <StatusIcon />
            {tone.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-outline-variant py-3">
          <div className="flex min-w-0 items-center gap-2">
            <AssetTile type="planter" name={combo.planter} size="sm" />
            <div className="min-w-0">
              <p className="m3-label-small text-on-surface-variant">Planter</p>
              <p className="truncate text-sm font-medium text-on-surface">
                {combo.planter}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <AssetTile type="field" name={combo.field} size="sm" />
            <div className="min-w-0">
              <p className="m3-label-small text-on-surface-variant">Field</p>
              <p className="truncate text-sm font-medium text-on-surface">
                {combo.field}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          {displayStatus === "ready" && (
            <div className={`rounded-lg px-3 py-3 ${tone.panel}`}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="m3-label-small opacity-80">Available</p>
                  <p className="mt-1 font-medium">
                    {readySince ? formatAvailableFor(readySince) : "Ready by default"}
                  </p>
                </div>
                <div>
                  <p className="m3-label-small opacity-80">Grow time</p>
                  <p className="mt-1 font-medium">
                    {formatDuration(combo.duration)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {displayStatus === "growing" && combo.started_at && (
            <div className={`rounded-lg px-3 py-3 ${tone.panel}`}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="m3-label-small opacity-80">
                    Time since planted
                  </p>
                  <p className="mt-1 font-medium">
                    {formatElapsed(combo.started_at)}
                  </p>
                </div>
                <div>
                  <p className="m3-label-small opacity-80">Planted</p>
                  <p className="mt-1 font-medium">
                    {formatDate(combo.started_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {displayStatus === "cooldown" && combo.activated_at && (
            <div className={`rounded-lg px-3 py-3 ${tone.panel}`}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="m3-label-small opacity-80">Last harvested</p>
                  <p className="mt-1 font-medium">
                    {formatDate(combo.activated_at)}
                  </p>
                </div>
                <div>
                  <p className="m3-label-small opacity-80">Time remaining</p>
                  <p className="mt-1 font-medium">
                    {formatCountdown(combo.activated_at)}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium opacity-80">
                  <span>Cooldown progress</span>
                  <span>{Math.round(cooldownProgress)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface/55">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${tone.progress}`}
                    style={{ width: `${cooldownProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {displayStatus === "ready" && combo.status === "cooldown" && (
            <div className="mt-3 rounded-lg bg-primary-container/70 px-3 py-3 text-on-primary-container">
              <div className="mb-2 flex items-center gap-2">
                <Clock3 className="size-4" />
                <p className="font-medium">Cooldown finished</p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface/55">
                <div className="h-full w-full rounded-full bg-primary" />
              </div>
              <p className="mt-2">
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
