import { ReactNode, useEffect, useState } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div
        className="relative w-[375px] h-[760px] bg-phone text-phone-foreground rounded-[44px] overflow-hidden"
        style={{ boxShadow: "var(--shadow-phone)" }}
      >
        {/* Status bar */}
        <div className="absolute top-0 inset-x-0 h-11 flex items-center justify-between px-7 text-xs font-semibold z-50 text-phone-foreground">
          <span>{time || "9:41"}</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-28 bg-black rounded-full" />
          <div className="flex items-center gap-1">
            <span>📶</span><span>📡</span><span>🔋</span>
          </div>
        </div>
        <div className="absolute inset-0 pt-11 pb-2 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
