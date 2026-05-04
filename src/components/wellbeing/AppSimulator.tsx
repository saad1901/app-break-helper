import { useEffect } from "react";
import { AppState, fmtTime } from "@/lib/wellbeing-store";

interface Props {
  app: AppState;
  isActive: boolean;
  onHome: () => void;
  onStart: () => void;
  onStop: () => void;
}

export function AppSimulator({ app, isActive, onHome, onStart, onStop }: Props) {
  // Auto-start timer on open
  useEffect(() => {
    if (!app.blocked && !isActive) onStart();
    return () => onStop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.id]);

  const pct = Math.min(100, (app.usage / app.limit) * 100);
  const barColor = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-success";
  const remaining = Math.max(0, app.limit - app.usage);

  return (
    <div className="h-full w-full flex flex-col bg-white text-phone-foreground animate-fade-in">
      {/* Tracker top bar */}
      <div className="px-4 py-2 bg-black text-white flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-success animate-pulse-danger" : "bg-white/40"}`} />
          <span className="font-semibold">🛡️ Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">left:</span>
          <span className="font-mono font-bold">{fmtTime(remaining)}</span>
        </div>
      </div>
      <div className="h-1 bg-muted shrink-0">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>

      {/* App "content" */}
      <div className={`flex-1 overflow-hidden bg-gradient-to-br ${app.color} relative`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <div className="text-7xl mb-4 drop-shadow-lg">{app.icon}</div>
          <h2 className="text-3xl font-bold drop-shadow">{app.name}</h2>
          <p className="mt-2 text-white/90 text-sm max-w-xs">
            Simulated app session in progress. The tracker is recording your time.
          </p>
          <div className="mt-6 px-4 py-2 rounded-full bg-black/30 backdrop-blur text-xs font-mono">
            {fmtTime(app.usage)} / {fmtTime(app.limit)} ({Math.round(pct)}%)
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-black/90 text-white flex justify-around items-center py-3 shrink-0">
        <button onClick={onHome} className="text-xs flex flex-col items-center gap-0.5 active:opacity-60 px-6">
          <span className="text-lg">◁</span>
          <span>Back</span>
        </button>
        <button onClick={onHome} className="text-xs flex flex-col items-center gap-0.5 active:opacity-60 px-6">
          <span className="text-lg">○</span>
          <span>Home</span>
        </button>
        <button onClick={onStop} className="text-xs flex flex-col items-center gap-0.5 active:opacity-60 px-6">
          <span className="text-lg">▭</span>
          <span>Recent</span>
        </button>
      </div>
    </div>
  );
}
