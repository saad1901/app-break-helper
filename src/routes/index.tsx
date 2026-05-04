import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWellbeing, AppId } from "@/lib/wellbeing-store";
import { PhoneFrame } from "@/components/wellbeing/PhoneFrame";
import { Dashboard } from "@/components/wellbeing/Dashboard";
import { AppDetail } from "@/components/wellbeing/AppDetail";
import { BlockOverlay } from "@/components/wellbeing/BlockOverlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Addiction Alarm — Wellbeing Simulator" },
      { name: "description", content: "Mobile simulator that tracks app usage, warns at 80%, blocks when limits are exceeded, with parent PIN override." },
    ],
  }),
  component: Index,
});

function Index() {
  const { state, startApp, stopApp, setLimit, grantOverride, resetDay } = useWellbeing();
  const [selected, setSelected] = useState<AppId | null>(null);

  const appsList = Object.values(state.apps);
  const totalUsage = appsList.reduce((a, b) => a + b.usage, 0);
  const totalLimit = appsList.reduce((a, b) => a + b.limit, 0);
  const selectedApp = selected ? state.apps[selected] : null;
  const blockedApp = selectedApp?.blocked ? selectedApp : null;

  return (
    <PhoneFrame>
      {!selectedApp ? (
        <Dashboard
          apps={appsList}
          totalUsage={totalUsage}
          totalLimit={totalLimit}
          activeAppId={state.activeAppId}
          onSelect={setSelected}
          onReset={resetDay}
        />
      ) : (
        <AppDetail
          app={selectedApp}
          isActive={state.activeAppId === selectedApp.id}
          onBack={() => setSelected(null)}
          onStart={() => startApp(selectedApp.id)}
          onStop={stopApp}
          onSetLimit={(m) => setLimit(selectedApp.id, m)}
        />
      )}

      {blockedApp && (
        <BlockOverlay
          app={blockedApp}
          onOverride={() => grantOverride(blockedApp.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </PhoneFrame>
  );
}
