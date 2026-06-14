import type { DataFile, GitHubGistResponse } from "./types";
import { GIST_FILENAME } from "./types";

const API_BASE = "https://api.github.com";
const TOKEN_KEY = "github_pat";
const GIST_ID_KEY = "github_gist_id";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getGistId(): string | null {
  return localStorage.getItem(GIST_ID_KEY);
}

function headers(): HeadersInit {
  const token = getToken();
  if (!token) throw new Error("No GitHub token configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

async function readResponseError(
  res: Response,
  fallback: string
): Promise<Error> {
  const err = await res.json().catch(() => ({}));
  const message =
    typeof err === "object" && err && "message" in err
      ? String((err as { message?: unknown }).message)
      : res.statusText;

  return new Error(`${fallback}: ${res.status} ${message}`);
}

function parseDataFile(content: string): DataFile {
  const parsed = JSON.parse(content) as Partial<DataFile> & {
    entries?: unknown[];
  };

  if (Array.isArray(parsed.states)) {
    return {
      states: parsed.states.map((state) => {
        const storedState = state as {
          id: string;
          status: DataFile["states"][number]["status"];
          activated_at?: string | null;
          started_at?: string | null;
        };

        return {
          id: storedState.id,
          status: storedState.status,
          activated_at: storedState.activated_at ?? null,
          started_at: storedState.started_at ?? null,
        };
      }),
    };
  }

  if (Array.isArray(parsed.entries)) {
    return { states: [] };
  }

  return { states: [] };
}

async function fetchGist(gistId: string): Promise<GitHubGistResponse> {
  const res = await fetch(`${API_BASE}/gists/${gistId}`, { headers: headers() });

  if (!res.ok) {
    throw await readResponseError(res, "Failed to load Gist");
  }

  return (await res.json()) as GitHubGistResponse;
}

export async function fetchData(): Promise<DataFile> {
  const gistId = getGistId();
  if (!gistId) throw new Error("No GitHub Gist configured");

  const gist = await fetchGist(gistId);
  const file = gist.files[GIST_FILENAME];

  if (!file) {
    const empty: DataFile = { states: [] };
    await saveData(empty);
    return empty;
  }

  let content = file.content;
  if (file.truncated && file.raw_url) {
    const res = await fetch(file.raw_url);
    if (!res.ok) {
      throw new Error(`Failed to load Gist file: ${res.status} ${res.statusText}`);
    }
    content = await res.text();
  }

  if (!content) {
    return { states: [] };
  }

  return parseDataFile(content);
}

export async function saveData(data: DataFile): Promise<void> {
  const gistId = getGistId();
  if (!gistId) throw new Error("No GitHub Gist configured");

  const res = await fetch(`${API_BASE}/gists/${gistId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      description: "Planter Wax Tracker data",
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    throw await readResponseError(res, "Failed to save Gist data");
  }
}

export function hasConfig(): boolean {
  return !!getToken() && !!getGistId();
}

export function setConfig(token: string, gistId: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(GIST_ID_KEY, gistId);
}

export function clearConfig(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(GIST_ID_KEY);
}

export async function validateToken(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error("Invalid token. Make sure it can access GitHub Gists.");
  }
}

export async function validateGist(token: string, gistId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/gists/${gistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw await readResponseError(res, "Failed to access Gist");
  }
}

export async function createDataGist(token: string): Promise<string> {
  const empty: DataFile = { states: [] };
  const res = await fetch(`${API_BASE}/gists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: "Planter Wax Tracker data",
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(empty, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    throw await readResponseError(res, "Failed to create Gist");
  }

  const gist = (await res.json()) as GitHubGistResponse;
  return gist.id;
}
