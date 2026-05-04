import { useState } from "react";
import { AppState, PARENT_PIN } from "@/lib/wellbeing-store";

interface Props {
  app: AppState;
  onOverride: () => void;
  onClose: () => void;
}

export function BlockOverlay({ app, onOverride, onClose }: Props) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (pin === PARENT_PIN) {
      onOverride();
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-8 text-white animate-fade-in"
      style={{ background: "linear-gradient(160deg, oklch(0.45 0.22 25), oklch(0.30 0.15 15))" }}>
      <div className="text-7xl mb-4 animate-pulse-danger">🚫</div>
      <h2 className="text-2xl font-bold">Usage limit exceeded</h2>
      <p className="mt-2 text-white/80">Take a break from {app.name}.</p>
      <p className="mt-1 text-xs text-white/60">Further usage is disabled.</p>

      {!showPin ? (
        <div className="mt-8 w-full max-w-xs flex flex-col gap-3">
          <button
            onClick={() => setShowPin(true)}
            className="py-3 rounded-2xl bg-white/15 backdrop-blur font-semibold active:scale-95 transition"
          >
            Parent override
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-white text-destructive font-semibold active:scale-95 transition"
          >
            Okay, I'll take a break
          </button>
        </div>
      ) : (
        <div className="mt-8 w-full max-w-xs flex flex-col gap-3 animate-slide-up">
          <p className="text-sm text-white/80">Enter 4-digit parent PIN (hint: 1234)</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
            className="text-center text-2xl tracking-[0.6em] py-3 rounded-2xl bg-white/15 backdrop-blur outline-none placeholder-white/40"
            placeholder="••••"
            autoFocus
          />
          {error && <p className="text-xs text-yellow-200">{error}</p>}
          <button
            onClick={submit}
            disabled={pin.length !== 4}
            className="py-3 rounded-2xl bg-white text-destructive font-semibold disabled:opacity-50 active:scale-95 transition"
          >
            Unlock 10 extra minutes
          </button>
          <button onClick={() => { setShowPin(false); setPin(""); setError(""); }} className="text-xs text-white/70 underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
