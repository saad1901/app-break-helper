import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useWellbeing, AppId } from "@/lib/wellbeing-store";
import { PhoneFrame } from "@/components/wellbeing/PhoneFrame";
import { Dashboard } from "@/components/wellbeing/Dashboard";
import { AppDetail } from "@/components/wellbeing/AppDetail";
import { BlockOverlay } from "@/components/wellbeing/BlockOverlay";
import { AndroidHome } from "@/components/wellbeing/AndroidHome";
import { AppSimulator } from "@/components/wellbeing/AppSimulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Addiction Alarm — Wellbeing Simulator" },
      { name: "description", content: "Android-style simulator that auto-tracks app time, warns at 80%, and blocks over-limit apps with a parent PIN override." },
    ],
  }),
  component: Index,
});

type Screen =
  | { kind: "home" }
  | { kind: "app"; id: AppId }
  | { kind: "tracker" }
  | { kind: "tracker-detail"; id: AppId };

function Index() {
  const { state, startApp, stopApp, setLimit, grantOverride, resetDay } = useWellbeing();
  const [screen, setScreen] = useState<Screen>({ kind: "home" });

  const appsList = Object.values(state.apps);
  const totalUsage = appsList.reduce((a, b) => a + b.usage, 0);
  const totalLimit = appsList.reduce((a, b) => a + b.limit, 0);

  const goHome = () => { stopApp(); setScreen({ kind: "home" }); };

  const openApp = (id: string) => {
    const appId = id as AppId;
    if (state.apps[appId].blocked) {
      // show block overlay over home
      setScreen({ kind: "app", id: appId });
      return;
    }
    setScreen({ kind: "app", id: appId });
  };

  const currentApp = screen.kind === "app" ? state.apps[screen.id] : null;
  const trackerApp = screen.kind === "tracker-detail" ? state.apps[screen.id] : null;
  const blockedApp = currentApp?.blocked ? currentApp : null;

  return (
    <PhoneFrame>
      {screen.kind === "home" && (
        <AndroidHome
          apps={appsList}
          totalUsage={totalUsage}
          onOpenApp={openApp}
          onOpenTracker={() => setScreen({ kind: "tracker" })}
        />
      )}

      {screen.kind === "app" && currentApp && (
        <AppSimulator
          app={currentApp}
          isActive={state.activeAppId === currentApp.id}
          onHome={goHome}
          onStart={() => startApp(currentApp.id)}
          onStop={stopApp}
        />
      )}

      {screen.kind === "tracker" && (
        <Dashboard
          apps={appsList}
          totalUsage={totalUsage}
          totalLimit={totalLimit}
          activeAppId={state.activeAppId}
          onSelect={(id) => setScreen({ kind: "tracker-detail", id })}
          onReset={resetDay}
        />
      )}

      {screen.kind === "tracker-detail" && trackerApp && (
        <AppDetail
          app={trackerApp}
          isActive={state.activeAppId === trackerApp.id}
          onBack={() => setScreen({ kind: "tracker" })}
          onStart={() => startApp(trackerApp.id)}
          onStop={stopApp}
          onSetLimit={(m) => setLimit(trackerApp.id, m)}
        />
      )}

      {blockedApp && (
        <BlockOverlay
          app={blockedApp}
          onOverride={() => grantOverride(blockedApp.id)}
          onClose={goHome}
        />
      )}
    </PhoneFrame>
  );
}
