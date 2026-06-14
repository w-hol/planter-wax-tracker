import { useState } from "react";
import { hasConfig } from "@/lib/github";
import { SetupScreen } from "@/components/SetupScreen";
import { Dashboard } from "@/components/Dashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(hasConfig());

  if (!authenticated) {
    return <SetupScreen onComplete={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />;
}

export default App;

