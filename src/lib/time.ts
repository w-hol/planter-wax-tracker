import type { TrackedWaxCombo, WaxStatus } from "./types";
import { COOLDOWN_MS } from "./types";

export function getReadyDate(activatedAt: string): Date {
  return new Date(new Date(activatedAt).getTime() + COOLDOWN_MS);
}

export function isReady(activatedAt: string): boolean {
  return Date.now() >= getReadyDate(activatedAt).getTime();
}

export function getDisplayStatus(combo: TrackedWaxCombo): WaxStatus {
  if (
    combo.status === "cooldown" &&
    combo.activated_at &&
    isReady(combo.activated_at)
  ) {
    return "ready";
  }

  return combo.status;
}

export function formatCountdown(activatedAt: string): string {
  const readyAt = getReadyDate(activatedAt).getTime();
  const remaining = readyAt - Date.now();

  if (remaining <= 0) return "Ready!";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export function formatElapsed(startedAt: string): string {
  const elapsed = Date.now() - new Date(startedAt).getTime();

  if (elapsed <= 0) {
    return "Just now";
  }

  const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatSpan(ms: number): string {
  if (ms <= 0) {
    return "0m";
  }

  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}

export function formatDuration(seconds: number): string {
  return formatSpan(seconds * 1000);
}

export function formatAvailableFor(readyAt: string): string {
  return `Available for ${formatSpan(Date.now() - new Date(readyAt).getTime())}`;
}

export function getCooldownProgress(activatedAt: string): number {
  const elapsed = Date.now() - new Date(activatedAt).getTime();
  const progress = (elapsed / COOLDOWN_MS) * 100;
  return Math.max(0, Math.min(100, progress));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toLocalDateTimeInput(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
