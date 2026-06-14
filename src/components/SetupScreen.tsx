import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AssetTile } from "@/components/AssetTile";
import {
  createDataGist,
  setConfig,
  validateGist,
  validateToken,
} from "@/lib/github";

interface SetupScreenProps {
  onComplete: () => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [token, setTokenValue] = useState("");
  const [gistId, setGistId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmed = token.trim();
    if (!trimmed) {
      setError("Token is required");
      setLoading(false);
      return;
    }

    try {
      await validateToken(trimmed);
      const trimmedGistId = gistId.trim();
      const configuredGistId = trimmedGistId || (await createDataGist(trimmed));

      if (trimmedGistId) {
        await validateGist(trimmed, trimmedGistId);
      }

      setConfig(trimmed, configuredGistId);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to validate token."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    onComplete();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-outline bg-surface-container">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-4">
            <AssetTile type="wax" name="Swirled Wax" size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Setup
              </p>
              <CardTitle className="text-2xl">Planter Wax Tracker</CardTitle>
            </div>
          </div>
          <CardDescription>
            Enter a GitHub Personal Access Token with{" "}
            <code className="rounded-md bg-surface-container-high px-1.5 py-0.5 text-xs text-foreground">
              gist
            </code>{" "}
            access to sync through a private Gist.
            <br />
            Your token is stored locally and only sent to GitHub's API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">GitHub Personal Access Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_..."
                value={token}
                onChange={(e) => setTokenValue(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gistId">Gist ID</Label>
              <Input
                id="gistId"
                placeholder="Leave blank to create a private Gist"
                value={gistId}
                onChange={(e) => setGistId(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && (
              <p className="rounded-2xl border border-destructive/25 bg-destructive/12 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Connecting…" : "Save & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
