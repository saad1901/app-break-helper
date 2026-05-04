import { AppId, AppState, fmtTime } from "@/lib/wellbeing-store";

interface Props {
  apps: AppState[];
  totalUsage: number;
  totalLimit: number;
  activeAppId: AppId | null;
  onSelect: (id: AppId) => void;
  onReset: () => void;
}

export function Dashboard({ apps, totalUsage, totalLimit, activeAppId, onSelect, onReset }: Props) {
  const pct = Math.min(100, (totalUsage / totalLimit) * 100);

  return (
    <div className="h-full overflow-y-auto px-5 pb-6 animate-fade-in">
      <div className="flex items-center justify-between pt-2 pb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Today</p>
          <h1 className="text-2xl font-bold">Digital Wellbeing</h1>
        </div>
        <button
          onClick={onReset}
          className="text-xs px-3 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition"
        >
          ↻ New day
        </button>
      </div>

      {/* Total */}
      <div
        className="rounded-3xl p-5 text-primary-foreground mb-5 relative overflow-hidden"
        style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
      >
        <p className="text-xs opacity-80 uppercase tracking-wider">Total screen time</p>
        <p className="text-4xl font-bold mt-1">{fmtTime(totalUsage)}</p>
        <p className="text-xs opacity-80 mt-1">of {fmtTime(totalLimit)} daily budget</p>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">Apps</p>
      <div className="space-y-3">
        {apps.map((app) => (
          <AppRow key={app.id} app={app} active={activeAppId === app.id} onClick={() => onSelect(app.id)} />
        ))}
      </div>
    </div>
  );
}

function AppRow({ app, active, onClick }: { app: AppState; active: boolean; onClick: () => void }) {
  const pct = Math.min(100, (app.usage / app.limit) * 100);
  const color = app.blocked || pct >= 100
    ? "bg-destructive"
    : pct >= 80
    ? "bg-warning"
    : "bg-success";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-card rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.99] transition-transform ${active ? "ring-2 ring-primary" : ""}`}
      style={{ boxShadow: "0 2px 8px -2px oklch(0 0 0 / 0.08)" }}
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shrink-0`}>
        {app.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold truncate">{app.name}</p>
          {active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-success text-white font-bold">LIVE</span>}
          {app.blocked && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive text-white font-bold">BLOCKED</span>}
        </div>
        <p className="text-xs text-muted-foreground">{fmtTime(app.usage)} / {fmtTime(app.limit)}</p>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </button>
  );
}
