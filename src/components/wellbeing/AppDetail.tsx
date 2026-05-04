import { useState } from "react";
import { AppState, fmtTime } from "@/lib/wellbeing-store";

interface Props {
  app: AppState;
  isActive: boolean;
  onBack: () => void;
  onStart: () => void;
  onStop: () => void;
  onSetLimit: (minutes: number) => void;
}

export function AppDetail({ app, isActive, onBack, onStart, onStop, onSetLimit }: Props) {
  const [limitInput, setLimitInput] = useState(String(Math.round(app.limit / 60)));
  const pct = Math.min(100, (app.usage / app.limit) * 100);
  const warn = pct >= 80 && pct < 100;
  const color = app.blocked ? "text-destructive" : warn ? "text-warning" : "text-success";

  const ringColor = app.blocked
    ? "oklch(0.62 0.24 25)"
    : warn
    ? "oklch(0.78 0.17 75)"
    : "oklch(0.70 0.18 150)";

  return (
    <div className="h-full overflow-y-auto px-5 pb-6 animate-slide-up">
      <button onClick={onBack} className="text-sm text-muted-foreground py-3 -ml-1">‹ Back</button>

      <div className="flex flex-col items-center text-center mt-2">
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center text-4xl shadow-lg`}>
          {app.icon}
        </div>
        <h1 className="text-2xl font-bold mt-4">{app.name}</h1>
        <p className="text-sm text-muted-foreground">Daily usage</p>
      </div>

      {/* Progress ring */}
      <div className="flex justify-center my-6">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.92 0.01 270)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 282.7} 282.7`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={`text-2xl font-bold ${color}`}>{fmtTime(app.usage)}</p>
            <p className="text-xs text-muted-foreground">of {fmtTime(app.limit)}</p>
            <p className={`text-xs font-semibold mt-1 ${color}`}>{Math.round(pct)}%</p>
          </div>
        </div>
      </div>

      {warn && (
        <div className="bg-warning/15 border border-warning/40 text-foreground rounded-2xl p-3 mb-4 text-sm flex items-start gap-2 animate-fade-in">
          <span>⚠️</span>
          <p><span className="font-semibold">Heads up.</span> You've used 80% of your {app.name} time. Consider taking a break.</p>
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={onStart}
          disabled={app.blocked || isActive}
          className="py-4 rounded-2xl font-semibold bg-success text-white disabled:opacity-40 active:scale-95 transition"
        >
          ▶ Start
        </button>
        <button
          onClick={onStop}
          disabled={!isActive}
          className="py-4 rounded-2xl font-semibold bg-secondary text-secondary-foreground disabled:opacity-40 active:scale-95 transition"
        >
          ■ Stop
        </button>
      </div>

      {/* Limit setter */}
      <div className="bg-card rounded-2xl p-4">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Daily limit (minutes)</label>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            min={1}
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            className="flex-1 bg-input rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => {
              const n = parseInt(limitInput);
              if (!isNaN(n) && n > 0) onSetLimit(n);
            }}
            className="px-5 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-95 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
