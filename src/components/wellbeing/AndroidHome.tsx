import { AppState, fmtTime } from "@/lib/wellbeing-store";

interface Props {
  apps: AppState[];
  onOpenApp: (id: string) => void;
  onOpenTracker: () => void;
  totalUsage: number;
}

export function AndroidHome({ apps, onOpenApp, onOpenTracker, totalUsage }: Props) {
  return (
    <div
      className="h-full w-full flex flex-col animate-fade-in"
      style={{ background: "linear-gradient(165deg, oklch(0.35 0.12 260), oklch(0.20 0.08 280))" }}
    >
      {/* Date / total widget */}
      <div className="px-6 pt-4 text-white">
        <p className="text-5xl font-light tracking-tight">
          {new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs">
          <span>📊</span>
          <span className="font-semibold">Screen time today: {fmtTime(totalUsage)}</span>
        </div>
      </div>

      {/* App grid */}
      <div className="flex-1 px-6 pt-8 grid grid-cols-4 gap-x-3 gap-y-6 content-start">
        {apps.map((app) => (
          <AppIcon key={app.id} app={app} onClick={() => onOpenApp(app.id)} />
        ))}
        <button onClick={onOpenTracker} className="flex flex-col items-center gap-1.5 active:scale-90 transition">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl shadow-lg">
            🛡️
          </div>
          <span className="text-[11px] text-white/90">Tracker</span>
        </button>
      </div>

      {/* Dock */}
      <div className="mx-4 mb-4 mt-2 rounded-3xl bg-white/10 backdrop-blur-md p-3 flex justify-around">
        {apps.slice(0, 4).map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="active:scale-90 transition"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-xl shadow-md`}>
              {app.icon}
            </div>
          </button>
        ))}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-28 h-1 bg-white/60 rounded-full" />
      </div>
    </div>
  );
}

function AppIcon({ app, onClick }: { app: AppState; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 active:scale-90 transition relative">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg ${app.blocked ? "grayscale opacity-60" : ""}`}>
        {app.icon}
      </div>
      <span className="text-[11px] text-white/90 truncate max-w-full">{app.name}</span>
      {app.blocked && (
        <span className="absolute -top-1 -right-1 text-xs bg-destructive rounded-full w-5 h-5 flex items-center justify-center">🔒</span>
      )}
    </button>
  );
}
