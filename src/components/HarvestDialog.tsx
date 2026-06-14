import { useState } from "react";
import type { TrackedWaxCombo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toLocalDateTimeInput } from "@/lib/time";

interface HarvestDialogProps {
  open: boolean;
  onClose: () => void;
  onHarvest: (activatedAt: string) => void;
  combo: TrackedWaxCombo | null;
}

export function HarvestDialog({
  open,
  onClose,
  onHarvest,
  combo,
}: HarvestDialogProps) {
  const [activatedAt, setActivatedAt] = useState(() =>
    toLocalDateTimeInput(new Date().toISOString())
  );

  function resetToNow() {
    setActivatedAt(toLocalDateTimeInput(new Date().toISOString()));
  }

  if (!combo) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onHarvest(new Date(activatedAt).toISOString());
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Harvest {combo.wax}</DialogTitle>
          <DialogDescription>
            Confirm when you harvested the {combo.planter} in {combo.field}.
            This starts the 36-day cooldown.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="harvest-time">Harvest time</Label>
              <Button type="button" variant="tonal" size="sm" onClick={resetToNow}>
                <Clock3 />
                Reset to now
              </Button>
            </div>
            <Input
              id="harvest-time"
              type="datetime-local"
              value={activatedAt}
              onChange={(e) => setActivatedAt(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start cooldown</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
