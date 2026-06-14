export type WaxStatus = "ready" | "growing" | "cooldown";
export type MutableWaxStatus = Exclude<WaxStatus, "ready">;

export interface WaxCombo {
  id: string;
  wax: string;
  planter: string;
  field: string;
  duration: number;
}

export interface TrackedWaxCombo extends WaxCombo {
  status: WaxStatus;
  activated_at: string | null;
  started_at: string | null;
}

export interface StoredWaxState {
  id: string;
  status: MutableWaxStatus;
  activated_at: string | null;
  started_at: string | null;
}

export interface DataFile {
  states: StoredWaxState[];
}

export interface GitHubGistFile {
  filename: string;
  content?: string;
  truncated?: boolean;
  raw_url?: string;
}

export interface GitHubGistResponse {
  id: string;
  files: Record<string, GitHubGistFile | null>;
}

export const COOLDOWN_DAYS = 36;
export const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
export const GIST_FILENAME = "planter-wax-tracker.json";
