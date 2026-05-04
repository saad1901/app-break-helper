import { AppId } from "@/lib/wellbeing-store";

interface AppIconProps {
  appId: AppId;
  className?: string;
}

export function AppIcon({ appId, className = "" }: AppIconProps) {
  if (appId === "instagram") {
    return <img src="/imgs/Instagram_logo_2016.svg" alt="Instagram" className={className} />;
  }
  
  const icons: Record<AppId, string> = {
    instagram: "📷",
    youtube: "▶️",
    whatsapp: "💬",
    chrome: "🌐",
  };
  
  return <span className={className}>{icons[appId]}</span>;
}
