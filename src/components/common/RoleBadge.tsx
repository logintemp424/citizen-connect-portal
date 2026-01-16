import { cn } from "@/lib/utils";
import { Shield, User, UserCheck, Crown } from "lucide-react";

interface RoleBadgeProps {
  role: "citizen" | "volunteer" | "official" | "admin";
  showIcon?: boolean;
  className?: string;
}

const roleStyles: Record<string, { bg: string; icon: typeof User }> = {
  citizen: { bg: "bg-muted text-muted-foreground", icon: User },
  volunteer: { bg: "bg-indian-green/10 text-indian-green", icon: UserCheck },
  official: { bg: "bg-primary/10 text-primary", icon: Shield },
  admin: { bg: "bg-saffron/10 text-saffron", icon: Crown },
};

export function RoleBadge({ role, showIcon = true, className }: RoleBadgeProps) {
  const { bg, icon: Icon } = roleStyles[role] || roleStyles.citizen;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        bg,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {role}
    </span>
  );
}
